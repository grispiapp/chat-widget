import { blank, filled } from "@lib/utils";
import { createContext } from "preact";
import { type ReactNode } from "preact/compat";
import { useContext, useState, type Dispatch } from "preact/hooks";

export type ModalType =
    | {
          title?: string;
          content: ReactNode | string;
          type: "confirm";
          confirmFn: () => void;
          dismissFn?: () => void;
      }
    | {
          type: "image";
          src: string;
          dismissFn?: () => void;
      };

interface ModalContextType {
    modal: ModalType;
    setModal: Dispatch<ModalType>;
}

const ModalContext = createContext<ModalContextType>({
    modal: null,
    setModal: () => {},
});

export const ModalContextProvider = ({ children }) => {
    const [modal, setModal] = useState<ModalType>(null);

    const handleSetModal = (modal: ModalType | null) => {
        if (blank(modal)) {
            setModal(null);
            return;
        }

        setModal({
            ...modal,
            dismissFn: () => (filled(modal.dismissFn) ? modal.dismissFn() : setModal(null)),
        });
    };

    return (
        <ModalContext.Provider value={{ modal, setModal: handleSetModal }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    return useContext(ModalContext);
};

export default ModalContext;
