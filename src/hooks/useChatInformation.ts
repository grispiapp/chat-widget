import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { resumeChat } from "../resumeChatAction";
import { sendClosePopupRequestToParent } from "../utils/talkingToParent";
import {
  endChatSession,
  sendMessage,
  setChatDestinations,
  setChatUserId,
} from "@lib/websocket";
import { queryParams } from "./queryParams";
import { useChatConnectionState } from "./useChatConnectionState";
import {
  SubscribeableChatResponseForEndUser,
  WsMessage,
} from "../types/backend";
import { debug, isDebugMode } from "@lib/utils";
import { InternalEventTypeMap } from "@lib/config";

/**
 * this will be overridden in backend
 */
export const CURRENT_USER_TEMP_MESSAGE_ID = "0";
export const WELCOME_MESSAGE_SENDER_ID = -1;
const WELCOME_MESSAGE_ID = "-1";
const DISPATCH_MESSAGE_SENDER_ID = -2;
const DISPATCH_MESSAGE_ID = "-2";

let initializationBlockNeedsToRun = true;
let popupEverOpened = false;

const generatePopupConfig = (
  show: boolean,
  hideFn: () => void,
  actionFn: () => Promise<any>
): Record<any, any> => {
  return {
    show: true,
    header: "Sohbet kapatılacak",
    headerButtons: [
      {
        type: "transparent",
        color: "black",
        text: "X",
        onClick: hideFn,
      },
    ],
    text: "Sohbeti bitirmek istediğinizden emin misiniz?",
    footerButtons: [
      {
        color: "white",
        backgroundColor: "#d9363e",
        text: "Hayır",
        onClick: hideFn,
      },
      {
        color: "white",
        backgroundColor: "#437e26",
        text: "Evet",
        onClick: () => {
          actionFn().finally(hideFn);
        },
      },
    ],
  };
};

enum SystemMessageStatus {
  NOT_SENT,
  /**
   * welcome message is shown to the user in the UI but not sent to the server yet
   */
  PENDING,
  /**
   * welcome message is sent to the server and no other action is required
   */
  SENT,
}

const useChatInformationInternal = () => {
  const tenantId = window.GrispiChat.options.tenantId;

  const [agentsAvailable, setAgentsAvailable] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [endUserNameForChat, setEndUserNameForChat] = useState<string | null>(
    null
  );
  const [initiated, setInitiated] = useState(false);
  const [lastMessageTime, setLastMessage] = useState<number | null>(null);
  const [popupConfig, setPopupConfig] = useState<Record<any, any>>({
    show: false,
  });
  const [preferences, setPreferences] = useState<PreferencesType | null>(null);
  const [shouldResume, setShouldResume] = useState(false);
  const [showNewChatForm, setShowNewChatForm] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [chatableNow, setChatableNow] = useState(false);

  const dispatchMessageState = useRef<SystemMessageStatus>(
    SystemMessageStatus.NOT_SENT
  );
  const prevChatIdRef = useRef<string | null>(null);
  const welcomeMessage = useRef<WsMessage | null>(null);
  const welcomeMessageState = useRef<SystemMessageStatus>(
    SystemMessageStatus.NOT_SENT
  );
  const { authKey, hostUrl } = queryParams();
  const { subscribedToChat } = useChatConnectionState();

  useEffect(() => {
    setChatableNow(
      !!tenantId &&
        !!chatId &&
        !!chatSessionId &&
        subscribedToChat &&
        !showNewChatForm &&
        !showSurvey
    );
  }, [
    tenantId,
    chatId,
    chatSessionId,
    subscribedToChat,
    showNewChatForm,
    showSurvey,
  ]);

  useEffect(() => {
    if (initiated && initializationBlockNeedsToRun) {
      initializationBlockNeedsToRun = false;
      if (chatId && !showNewChatForm) {
        if (prevChatIdRef.current !== chatId) {
          setShouldResume(true);
        }
        prevChatIdRef.current = chatId;
      } else {
        setShowNewChatForm(true);
        dispatchMessageState.current = SystemMessageStatus.PENDING;
      }
    }
  }, [chatId, initiated, showNewChatForm, prevChatIdRef]);

  const updateState = useCallback(
    (data: SubscribeableChatResponseForEndUser) => {
      if (isDebugMode()) {
        console.table({
          authKey,
          ...data,
          token:
            "..." +
            data.token.substring(data.token.length - 10, data.token.length),
        });
      }

      const chatSessionId = data.chatSessionId;
      const parsedUserId = parseInt(data.userId);

      debug(`http://localhost:8090/debug-chat/dedeler/${chatSessionId}`);

      setChatId(data.chatId);
      setChatSessionId(chatSessionId);
      setInitiated(true);
      setShowNewChatForm(false); // whenever a response from createChat or resumeChat is revived, it's guaranteed that we need to hide the form
      setLastMessage(Date.now());
      setAuthToken(data.token);
      setUserId(parsedUserId);

      setChatUserId(parsedUserId);
      setChatDestinations(
        `/app/chat/${tenantId}/${chatSessionId}`,
        `/app/chat/${tenantId}/${chatSessionId}/close`,
        `/app/chat/${tenantId}/${chatSessionId}/seen`
      );
    },
    [authKey, tenantId]
  );

  const sendWelcomeMessage = useCallback(() => {
    sendMessage(welcomeMessage.current!);
  }, [welcomeMessage]);

  //<editor-fold desc="ensure ws subscription">
  useEffect(() => {
    if (!(chatId && tenantId)) {
      return;
    }

    const ensureChatIsAvailable = () => {
      console.debug("ensureChatIsAvailable is called");
      if (!subscribedToChat) {
        resumeChat(chatId!, tenantId!).then((data) => updateState(data));
      }
    };

    window.addEventListener(
      InternalEventTypeMap.ENSURE_WS_SUBSCRIPTION,
      ensureChatIsAvailable
    );
    return () => {
      window.removeEventListener(
        InternalEventTypeMap.ENSURE_WS_SUBSCRIPTION,
        ensureChatIsAvailable
      );
    };
  }, [chatId, subscribedToChat, tenantId, updateState]);
  //</editor-fold>

  //<editor-fold desc="newChatCreatedHandler">
  useEffect(() => {
    if (!tenantId) {
      return;
    }

    const newChatCreatedHandler = (event: Event) => {
      const data: SubscribeableChatResponseForEndUser = (event as CustomEvent)
        .detail;
      updateState(data);
    };

    window.addEventListener(
      InternalEventTypeMap.NEW_CHAT_CREATED,
      newChatCreatedHandler
    );
    return () => {
      window.removeEventListener(
        InternalEventTypeMap.NEW_CHAT_CREATED,
        newChatCreatedHandler
      );
    };
  }, [tenantId, updateState]);
  //</editor-fold>

  //<editor-fold desc="resumeChat">
  useEffect(() => {
    if (shouldResume) {
      console.log("Resuming", chatId);
      resumeChat(chatId!, tenantId!).then((data) => updateState(data));
    }
  }, [chatId, shouldResume, tenantId, updateState]);
  //</editor-fold>

  return useMemo(() => {
    return {
      agentsAvailable, //chat data.online
      authToken,
      chatableNow,
      chatId,
      chatSessionId,
      endUserNameForChat,
      hostUrl,
      initiated,
      lastMessageTime,
      popupConfig,
      preferences,
      setEndUserNameForChat, //as this is a state setter, react guarantees its identity remains the same so no need to add it to deps list
      showNewChatForm,
      showSurvey,
      tenantId,
      userId,
    };
  }, [
    agentsAvailable, //chat data.online
    authToken,
    chatableNow,
    chatId,
    chatSessionId,
    endUserNameForChat,
    hostUrl,
    initiated,
    lastMessageTime,
    popupConfig,
    preferences,
    showNewChatForm,
    showSurvey,
    tenantId,
    userId,
  ]);
};

const ChatInformationContext = React.createContext<ChatInformation>({
  setEndUserNameForChat(fullName: string): void {},
  agentsAvailable: false,
  authToken: null,
  chatableNow: false,
  chatId: null,
  chatSessionId: null,
  endUserNameForChat: "",
  hostUrl: "",
  initiated: false,
  lastMessageTime: null,
  popupConfig: { show: false },
  preferences: null,
  showNewChatForm: false,
  showSurvey: false,
  tenantId: null,
  userId: null,
});
export const ChatInformationContextProvider = (props: PropsWithChildren) => {
  const value = useChatInformationInternal() as unknown as ChatInformation;
  return (
    <ChatInformationContext.Provider value={value}>
      {props.children}
    </ChatInformationContext.Provider>
  );
};

export const useChatInformation = () => useContext(ChatInformationContext);
