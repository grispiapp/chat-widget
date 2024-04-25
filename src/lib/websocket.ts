import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import { websocketConnectionReadyEvent } from "../api/chat";
import {
    SERVER_MESSAGE_CODE,
    type SubscribeableChatResponseForEndUser,
    type UploadFilesResponse,
    type WsMessage,
} from "../types/backend";
import { type MediaFileMeta } from "../types/file";
import { internalEventTypeMap } from "./config";
import { STORAGE_KEYS } from "./storage";
import { debug, destinationPaths, getBrokerUrl, uuidv4 } from "./utils";

interface Gate {
    destination: string;
    brokerUrl: string;
    token: string;
}

/**
 * this will be overridden in backend
 */
export const CURRENT_USER_TEMP_MESSAGE_ID = "0";
/**
 * msgGrispiId or message id header
 */
const MESSAGE_ID_HEADER = "msg-grispi-id";
const UPDATES_QUEUE_DESTINATION = `/user/queue/updates`;

const chatDisconnectedEvent = () =>
    window.dispatchEvent(new CustomEvent(internalEventTypeMap.CHAT_DISCONNECTED));
const myMessageSentEvent = (receiptId: string) =>
    window.dispatchEvent(new CustomEvent(internalEventTypeMap.GOT_RECEIPT, { detail: receiptId }));
const myMessageReceivedEvent = (messageId: string) =>
    window.dispatchEvent(
        new CustomEvent(internalEventTypeMap.MESSAGE_RECEIVED, {
            detail: messageId,
        })
    );
const myMessageSeenEvent = (messageId: string) =>
    window.dispatchEvent(
        new CustomEvent(internalEventTypeMap.MESSAGE_SEEN, {
            detail: messageId,
        })
    );
const myMessageInvalidEvent = (messageId: string) =>
    window.dispatchEvent(
        new CustomEvent(internalEventTypeMap.MESSAGE_INVALID, {
            detail: messageId,
        })
    );

const WebSocketErrorMessages = {
    tokenIsMissing: "TOKEN_IS_MISSING",
    tokenExpired: "TOKEN_EXPIRED",
    unexpectedError: "UNEXPECTED_ERROR",
} as const;

let subscription: StompSubscription | undefined;
let subscriptionToUpdates: StompSubscription | undefined;

//<editor-fold desc="Websocket client config">
const client = new Client({
    reconnectDelay: 0,
    onWebSocketClose: (frame: any) => {
        const chatSessionId = localStorage.getItem(STORAGE_KEYS.CHAT_SESSION_ID);

        if (chatSessionId) {
            debug("Ending chat session because websocket is closing...");
            endChatSession({ chatSessionId });
        }

        terminateWsConnection();
        chatDisconnectedEvent();
    },
    onDisconnect: (frame) => {
        client.onWebSocketClose(frame);
    },
    onStompError: (str) => {
        switch (str.headers.message) {
            case WebSocketErrorMessages.tokenExpired:
                // TODO: send event so that end user knows?
                console.error("token has expired");
                break;
            case WebSocketErrorMessages.tokenIsMissing:
                console.error("there is no token");
                break;
            case WebSocketErrorMessages.unexpectedError:
                console.error("unexpected Error", str);
                break;
            default:
                console.error("Stomp Error :", str.headers.message, str);
                break;
        }

        subscription?.unsubscribe();
        subscription = undefined;
        subscriptionToUpdates?.unsubscribe();
        subscriptionToUpdates = undefined;

        // If there is an Error disconnect from websocket, if end user types we will connect again.
        // This might not be necessary. Maybe when there's an error onDisconnect or onWebsocketClose already called.
        chatDisconnectedEvent();
    },
    debug: (str) => {
        debug("WebSocket client debug:", str);
    },
});
//</editor-fold>

//<editor-fold desc="activateConnection">
/*
Async activateConnection function takes destination (destination to subscribe) , brokerUrl (websocker Url), token (get after calling creating a chat or resuming a chat) , endUserName.
Creates Connection to Websocket through Stomp , subscribes to destination and starts listening.
Every websocket message processed and sends internal events to react application.
*/
const activateConnection = async (chat: SubscribeableChatResponseForEndUser, gate: Gate) => {
    client.beforeConnect = () => {
        client.activate();
    };
    client.brokerURL = gate.brokerUrl;
    client.connectHeaders = {
        token: gate.token,
    };
    client.onConnect = () => {
        websocketConnectionReadyEvent();
        ensureWsSubscriptions({ chat, destination: gate.destination });
    };

    client.activate();
};
//</editor-fold>

//<editor-fold desc="incomingMessageHandler">
const incomingMessageHandler = (message: IMessage) => {
    //const receiptId = message.headers["receipt"];
    const senderId = message.headers["sender-id"];
    const msgGrispiId = message.headers[MESSAGE_ID_HEADER];
    const parsedMessage = JSON.parse(message.body);
    parsedMessage.senderId = parseInt(senderId, 10);
    parsedMessage.id = msgGrispiId; //override database id with msgGrispiId as db id is useless for us
    delete parsedMessage.msgGrispiId;

    debug("connection incomingMessageHandler", parsedMessage);

    // FIXME: Resolve this.
    // if (isMessageSentByMe(parsedMessage)) {
    //     return;
    // }

    if (parsedMessage.code) {
        if (parsedMessage.code === SERVER_MESSAGE_CODE.CHAT_SESSION_CLOSED) {
            terminateWsConnection();
            chatDisconnectedEvent();
            window.dispatchEvent(new CustomEvent(internalEventTypeMap.CHAT_SESSION_CLOSED));
            return;
        }
    } else {
        // incoming regular message from an agent
        window.dispatchEvent(
            new CustomEvent(internalEventTypeMap.INCOMING_MESSAGE, {
                detail: parsedMessage,
            })
        );
        message.ack({
            [MESSAGE_ID_HEADER]: parsedMessage.id,
            //TODO GRISPI-1219 send chatSessionId for agent to differentiate chat sessions (currently grispi-ui parses destination to extract chatSessionId)
        });
    }
};
//</editor-fold>

//<editor-fold desc="incomingUpdateMessageHandler">
const incomingUpdateMessageHandler = (message: IMessage) => {
    const parsedMessage = JSON.parse(message.body);
    debug("incoming from", UPDATES_QUEUE_DESTINATION, parsedMessage);
    if (parsedMessage.code === SERVER_MESSAGE_CODE.INVALID_CHAT_SESSION) {
        subscription?.unsubscribe();
        subscription = undefined;
        chatDisconnectedEvent();
    } else if (parsedMessage.code === SERVER_MESSAGE_CODE.INVALID_MESSAGE) {
        myMessageInvalidEvent("0");
        console.error("INVALID_MESSAGE", parsedMessage, message);
    } else if (parsedMessage.code === SERVER_MESSAGE_CODE.MESSAGE_RECEIVED) {
        myMessageReceivedEvent(parsedMessage.msgGrispiId);
    } else if (parsedMessage.code === SERVER_MESSAGE_CODE.MESSAGE_SEEN) {
        myMessageSeenEvent(parsedMessage.msgGrispiId);
    } else if (parsedMessage.code === SERVER_MESSAGE_CODE.NOT_AUTHORIZED) {
        subscription?.unsubscribe();
        subscription = undefined;
        chatDisconnectedEvent();
    }
};
//</editor-fold>

//<editor-fold desc="ensureWsSubscriptions">
/**
 * Ensures ws subscription to 2 channels (chat channel & updates channel).
 * If any or both of them are not subscribed then this function resubscribe to relevant channels.
 * Note that this function is a low leve ws function and does nothing about resuming chat.
 * @param destination chat channel destination. (no need for updates channel destination as it's a fixed string)
 * @param endUserName
 */
const ensureWsSubscriptions = ({
    chat,
    destination,
}: {
    chat: SubscribeableChatResponseForEndUser;
    destination: string;
}) => {
    if (!subscription) {
        debug("Subscribed to chatSession waiting for messages");
        subscription = client.subscribe(destination, incomingMessageHandler, {
            ack: "client-individual",
        });
    }

    if (!subscriptionToUpdates) {
        subscriptionToUpdates = client.subscribe(
            UPDATES_QUEUE_DESTINATION,
            incomingUpdateMessageHandler
        );
    }

    window.dispatchEvent(
        new CustomEvent(internalEventTypeMap.SUBSCRIBED_TO_CHAT, {
            detail: { chat },
        })
    );
};
//</editor-fold>

//<editor-fold desc="sendMessageOverWs">
function sendMessageOverWs(message: WsMessage, destination: string): void {
    if (!message) {
        console.error("sendMessageOverWs", 'mandatory "message" parameter is missing!');
        return;
    }

    if (!destination) {
        console.error("sendMessageOverWs", 'mandatory "destination" parameter is missing!');
        return;
    }

    // FIXME check connection, subscription. if closed, call resume chat

    debug("Sending message...", message);

    const receiptId = message.receiptId!;

    client.watchForReceipt(receiptId, (frame) => {
        debug("Incoming receipt", { receiptId });
        // Having a receiptId means that our message is received by the server

        // Implementation note:
        // here receiptId === msgGrispiId
        myMessageSentEvent(frame.headers["receipt-id"]);
    });

    client.publish({
        destination,
        headers: { receipt: receiptId },
        body: JSON.stringify(message),
    });
}
//</editor-fold>

//<editor-fold desc="sendSeen">
function sendSeen(messageId: string, chat: SubscribeableChatResponseForEndUser) {
    if (!client?.connected) {
        return;
    }
    client.publish({
        destination: destinationPaths(chat.chatSessionId).chatMessageSeen(),
        headers: {},
        body: JSON.stringify({ seenAt: Date.now(), msgGrispiId: messageId }),
    });
}
//</editor-fold>

//<editor-fold desc="subscribeChat">
const subscribeChat = async (chat: SubscribeableChatResponseForEndUser) => {
    const destination = destinationPaths(chat.chatSessionId).exchange();

    try {
        await terminateWsConnection();

        const gate = {
            token: chat.token,
            brokerUrl: getBrokerUrl(),
            destination,
        };

        debug("Creating websocket connection and subscribing to chatSession", { gate });

        await activateConnection(chat, gate);

        return gate;
    } catch (err) {
        console.error(err);
    }
};
//</editor-fold>
function getMediaFileMetaData(file: UploadFilesResponse) {
    const { fileName, mimeType, publicUrl, size } = file;
    const metaData: MediaFileMeta = {
        fileName,
        mimeType,
        size,
        url: publicUrl,
    };
    return JSON.stringify(metaData);
}
const sendMediaMessage = (
    uploadedFile: UploadFilesResponse,
    chat: SubscribeableChatResponseForEndUser
) => {
    const text = getMediaFileMetaData(uploadedFile);

    return sendMessage(
        {
            contentType: uploadedFile.mimeType,
            id: CURRENT_USER_TEMP_MESSAGE_ID,
            sender: chat.name,
            sentAt: Date.now(),
            text,
        } as WsMessage,
        chat
    );
};

const sendMessage = (message: WsMessage, chat: SubscribeableChatResponseForEndUser) => {
    if (!chat?.chatSessionId) {
        console.error("chatSessionId is not set!");
        alert("Error 0");
        return;
    }

    const destination = destinationPaths(chat.chatSessionId).chatMessage();

    message.receiptId = uuidv4();

    sendMessageOverWs(message, destination);
};

const endChatSession = (chat: Pick<SubscribeableChatResponseForEndUser, "chatSessionId">) => {
    if (subscription) {
        client.publish({
            destination: destinationPaths(chat.chatSessionId).endSession(),
            headers: {},
            body: chat.chatSessionId,
        });
    }
};

/**
 * We need to terminate and reconnect to ws everytime chatSessionId (subsequently token) is changed.
 * Because we can only set the user in backend in CONNECT phase. When we set the user in SUBSCRIBE phase it's only visible
 * to a specific destination. For example if we set a new user in SUBSCRIBE to exchange /exchange/blabla/blabla.123
 * the new user is not visible when handling /exchange/blabla/blabla.123/seen destination
 */
function terminateWsConnection(): Promise<void> {
    subscription?.unsubscribe();
    subscription = undefined;

    subscriptionToUpdates?.unsubscribe();
    subscriptionToUpdates = undefined;

    return client.deactivate();
}

export { endChatSession, sendMediaMessage, sendMessage, sendSeen, subscribeChat };
