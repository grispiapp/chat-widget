import { internalEventTypeMap } from "./config";
import { debug } from "./utils";

const IDLE_DURATION = 3 * 1000; // 10 seconds

export const VisitorIdle = {
    lastActiveTime: Date.now(),

    start: () => {
        window.addEventListener("load", VisitorIdle.resetTimer);
        window.addEventListener("mousemove", VisitorIdle.resetTimer);
        window.addEventListener("mousedown", VisitorIdle.resetTimer); // catches touchscreen presses as well
        window.addEventListener("touchstart", VisitorIdle.resetTimer); // catches touchscreen swipes as well
        window.addEventListener("touchmove", VisitorIdle.resetTimer); // required by some devices
        window.addEventListener("click", VisitorIdle.resetTimer); // catches touchpad clicks as well
        window.addEventListener("keydown", VisitorIdle.resetTimer);
        window.addEventListener("scroll", VisitorIdle.resetTimer, true); // improved; see comments
    },

    callback: () => {
        debug("Ensure websocket connected...");
        window.dispatchEvent(new CustomEvent(internalEventTypeMap.ENSURE_WS_SUBSCRIPTION));
    },

    resetTimer: () => {
        const currentTime = Date.now();

        if (currentTime - VisitorIdle.lastActiveTime >= IDLE_DURATION) {
            VisitorIdle.callback();
        }

        VisitorIdle.lastActiveTime = currentTime;
    },
};
