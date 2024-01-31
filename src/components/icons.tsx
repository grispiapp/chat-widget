import { cn } from "@lib/utils";
import { type FC } from "preact/compat";
import { type JSX } from "preact/jsx-runtime";

export type IconType = FC<JSX.SVGAttributes<SVGElement>>;

export const CloseIcon: IconType = (props) => {
    return (
        <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z" />
        </svg>
    );
};

export const SendIcon: IconType = (props) => {
    return (
        <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="m21.426 11.095-17-8A.999.999 0 0 0 3.03 4.242L4.969 12 3.03 19.758a.998.998 0 0 0 1.396 1.147l17-8a1 1 0 0 0 0-1.81zM5.481 18.197l.839-3.357L12 12 6.32 9.16l-.839-3.357L18.651 12l-13.17 6.197z" />
        </svg>
    );
};

export const MinimizeIcon: IconType = (props) => {
    return (
        <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path fill="none" d="M0 0h24v24H0V0z" />
            <path d="M6 19h12v2H6v-2z" />
        </svg>
    );
};

export const LoadingIcon: IconType = (props) => {
    return (
        <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 1024 1024"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
            className={cn(props.className, "cb-animate-spin")}
        >
            <path d="M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z" />
        </svg>
    );
};

export const FileIcon: IconType = (props) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" {...props}>
            <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m5.5 1.5v2a1 1 0 0 0 1 1h2z" />
        </svg>
    );
};

export const ConnectionIcon: IconType = (props) => {
    return (
        <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            version="1.1"
            viewBox="0 0 20 16"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M10 9c1.654 0 3.154 0.673 4.241 1.759l-1.414 1.414c-0.724-0.724-1.724-1.173-2.827-1.173s-2.103 0.449-2.827 1.173l-1.414-1.414c1.086-1.086 2.586-1.759 4.241-1.759zM2.929 7.929c1.889-1.889 4.4-2.929 7.071-2.929s5.182 1.040 7.071 2.929l-1.414 1.414c-1.511-1.511-3.52-2.343-5.657-2.343s-4.146 0.832-5.657 2.343l-1.414-1.414zM15.45 2.101c1.667 0.705 3.164 1.715 4.45 3v0l-1.414 1.414c-2.267-2.266-5.28-3.515-8.485-3.515s-6.219 1.248-8.485 3.515l-1.414-1.414c1.285-1.285 2.783-2.295 4.45-3 1.727-0.73 3.56-1.101 5.45-1.101s3.723 0.37 5.45 1.101zM9 14c0-0.552 0.448-1 1-1s1 0.448 1 1c0 0.552-0.448 1-1 1s-1-0.448-1-1z" />
        </svg>
    );
};

export const CheckIcon: IconType = (props) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" {...props}>
            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
        </svg>
    );
};

export const CheckAllIcon: IconType = (props) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" {...props}>
            <path d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992zm-.92 5.14.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486z" />
        </svg>
    );
};

export const ChatSmileFillIcon: IconType = (props) => {
    return (
        <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path d="M7.29117 20.8242L2 22L3.17581 16.7088C2.42544 15.3056 2 13.7025 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C10.2975 22 8.6944 21.5746 7.29117 20.8242ZM7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12H15C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12H7Z" />
        </svg>
    );
};

export const FileUploadIcon: IconType = (props) => {
    return (
        <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2zM7 9l1.41 1.41L11 7.83V16h2V7.83l2.59 2.58L17 9l-5-5-5 5z" />
        </svg>
    );
};

export const GrispiIcon: IconType = (props) => {
    return (
        <svg viewBox="0 0 630 917" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <path
                d="M315 761.201C246.5 761.201 178 742.901 119.8 705.301L37.5996 837.701C120.9 889.101 216.8 916.401 314.9 916.401C413 916.401 508.9 889.001 592.2 837.701L510 705.301C452 743.001 384.6 761.201 315 761.201Z"
                fill="currentColor"
            />
            <path
                d="M0 315C0 489.6 140.4 630 315 630C488.5 630 630 489.6 630 315C630 248.8 609.5 187.2 574.1 137C574.1 135.9 630 0 630 0H315C141.5 0 0 140.3 0 315ZM469.1 312.7C469.1 398.3 400.6 466.8 315 466.8C230.5 466.8 160.9 398.3 160.9 312.7C160.9 228.2 229.4 158.6 315 158.6C399.5 158.6 469.1 227.1 469.1 312.7Z"
                fill="currentColor"
            />
        </svg>
    );
};

export const RatingIcons = {
    1: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
            <circle class="gl-emote-bg" fill="currentColor" cx="12" cy="12" r="10" />
            <path
                fill="#393939"
                d="M12 14.6c1.48 0 2.9.38 4.15 1.1a.8.8 0 01-.79 1.39 6.76 6.76 0 00-6.72 0 .8.8 0 11-.8-1.4A8.36 8.36 0 0112 14.6zm4.6-6.25a1.62 1.62 0 01.58 1.51 1.6 1.6 0 11-2.92-1.13c.2-.04.25-.05.45-.08.21-.04.76-.11 1.12-.18.37-.07.46-.08.77-.12zm-9.2 0c.31.04.4.05.77.12.36.07.9.14 1.12.18.2.03.24.04.45.08a1.6 1.6 0 11-2.34-.38z"
            />
        </svg>
    ),
    2: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
            <circle class="gl-emote-bg" fill="currentColor" cx="12" cy="12" r="10" />
            <path
                fill="#393939"
                d="M12 14.8c1.48 0 3.08.28 3.97.75a.8.8 0 11-.74 1.41A8.28 8.28 0 0012 16.4a9.7 9.7 0 00-3.33.61.8.8 0 11-.54-1.5c1.35-.48 2.56-.71 3.87-.71zM15.7 8c.25.31.28.34.51.64.24.3.25.3.43.52.18.23.27.33.56.7A1.6 1.6 0 1115.7 8zM8.32 8a1.6 1.6 0 011.21 2.73 1.6 1.6 0 01-2.7-.87c.28-.37.37-.47.55-.7.18-.22.2-.23.43-.52.23-.3.26-.33.51-.64z"
            />
        </svg>
    ),
    3: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
            <circle class="gl-emote-bg" fill="currentColor" cx="12" cy="12" r="10" />
            <path
                fill="#393939"
                d="M15.33 15.2a.8.8 0 01.7.66.85.85 0 01-.68.94h-6.2c-.24 0-.67-.26-.76-.7-.1-.38.17-.81.6-.9zm.35-7.2a1.6 1.6 0 011.5 1.86A1.6 1.6 0 1115.68 8zM8.32 8a1.6 1.6 0 011.21 2.73A1.6 1.6 0 118.33 8z"
            />
        </svg>
    ),
    4: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
            <circle class="gl-emote-bg" fill="currentColor" cx="12" cy="12" r="10" />
            <path
                fill="#393939"
                d="M15.45 15.06a.8.8 0 11.8 1.38 8.36 8.36 0 01-8.5 0 .8.8 0 11.8-1.38 6.76 6.76 0 006.9 0zM15.68 8a1.6 1.6 0 011.5 1.86A1.6 1.6 0 1115.68 8zM8.32 8a1.6 1.6 0 011.21 2.73A1.6 1.6 0 118.33 8z"
            />
        </svg>
    ),
    5: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
            <circle class="gl-emote-bg" fill="currentColor" cx="12" cy="12" r="10" />
            <path
                fill="#393939"
                d="M16.8 14.4c.32 0 .59.2.72.45.12.25.11.56-.08.82a6.78 6.78 0 01-10.88 0 .78.78 0 01-.05-.87c.14-.23.37-.4.7-.4zM15.67 8a1.6 1.6 0 011.5 1.86A1.6 1.6 0 1115.68 8zM8.32 8a1.6 1.6 0 011.21 2.73A1.6 1.6 0 118.33 8z"
            />
        </svg>
    ),
};
