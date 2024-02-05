import { internalEventTypeMap } from "./config";
import { debug } from "./utils";

const IDLE_DURATION = 10 * 1000; // 10 seconds

export const VisitorIdle = {
    timeout: null,
    since: Date.now(),

    start: () => {
        window.addEventListener("load", VisitorIdle.cycle);
        window.addEventListener("mousemove", VisitorIdle.cycle);
        window.addEventListener("mousedown", VisitorIdle.cycle); // catches touchscreen presses as well
        window.addEventListener("touchstart", VisitorIdle.cycle); // catches touchscreen swipes as well
        window.addEventListener("touchmove", VisitorIdle.cycle); // required by some devices
        window.addEventListener("click", VisitorIdle.cycle); // catches touchpad clicks as well
        window.addEventListener("keydown", VisitorIdle.cycle);
        window.addEventListener("scroll", VisitorIdle.cycle, true); // improved; see comments
    },

    callback: () => {
        debug("Ensure websocket connected...");
        window.dispatchEvent(new CustomEvent(internalEventTypeMap.ENSURE_WS_SUBSCRIPTION));
    },

    cycle: () => {
        clearTimeout(VisitorIdle.timeout);
        VisitorIdle.since = Date.now();
        VisitorIdle.timeout = setTimeout(VisitorIdle.callback, IDLE_DURATION);
    },
};
