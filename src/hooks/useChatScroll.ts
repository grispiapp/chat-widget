import { useLayoutEffect, type MutableRef } from "preact/hooks";

type UseChatScrollOptions = {
    contentScrollRef: MutableRef<HTMLDivElement>;
    contentRef: MutableRef<HTMLDivElement>;
};

export const useChatScroll = ({ contentScrollRef, contentRef }: UseChatScrollOptions) => {
    useLayoutEffect(() => {
        const rect = contentRef.current?.getBoundingClientRect();
        if (!rect) return;

        const { height } = rect;

        contentScrollRef.current?.scrollTo({
            top: height,
            behavior: "smooth",
        });
    }, [contentRef, contentScrollRef]);
};
