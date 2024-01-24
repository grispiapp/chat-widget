import { FC } from "preact/compat";
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
      <path d="M405 136.798L375.202 107 256 226.202 136.798 107 107 136.798 226.202 256 107 375.202 136.798 405 256 285.798 375.202 405 405 375.202 285.798 256z"></path>
    </svg>
  );
};

export const RefreshIcon: IconType = (props) => {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      stroke-width="0"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M256 388c-72.597 0-132-59.405-132-132 0-72.601 59.403-132 132-132 36.3 0 69.299 15.4 92.406 39.601L278 234h154V80l-51.698 51.702C348.406 99.798 304.406 80 256 80c-96.797 0-176 79.203-176 176s78.094 176 176 176c81.045 0 148.287-54.134 169.401-128H378.85c-18.745 49.561-67.138 84-122.85 84z"></path>
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
      <path d="m21.426 11.095-17-8A.999.999 0 0 0 3.03 4.242L4.969 12 3.03 19.758a.998.998 0 0 0 1.396 1.147l17-8a1 1 0 0 0 0-1.81zM5.481 18.197l.839-3.357L12 12 6.32 9.16l-.839-3.357L18.651 12l-13.17 6.197z"></path>
    </svg>
  );
};
