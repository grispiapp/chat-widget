import { type Inputs, type MutableRef, useLayoutEffect } from "preact/hooks";

type UseChatScroll = (
  options: {
    contentScrollRef: MutableRef<HTMLDivElement>;
    contentRef: MutableRef<HTMLDivElement>;
  },
  inputs: Inputs
) => void;

export const useChatScroll: UseChatScroll = (
  { contentScrollRef, contentRef },
  inputs
) => {
  useLayoutEffect(() => {
    const rect = contentRef.current?.getBoundingClientRect();
    if (!rect) return;

    const { height } = rect;

    contentScrollRef.current?.scrollTo({
      top: height,
      behavior: "smooth",
    });
  }, inputs);
};
