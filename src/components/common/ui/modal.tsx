import { t } from "@/lang";
import { CloseIcon } from "@components/icons";
import { type ModalType } from "@context/modal-context";
import { type FC, type JSX } from "preact/compat";
import { Button } from "./button";

interface ModalProps {
    modal: ModalType;
}

interface ModalDialogProps extends JSX.HTMLAttributes<HTMLDivElement> {}

interface ModalHeaderProps extends JSX.HTMLAttributes<HTMLDivElement> {
    onDismiss: () => void;
}

interface ModalContentProps extends JSX.HTMLAttributes<HTMLDivElement> {}

interface ModalFooterProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export const Modal: FC<ModalProps> = ({ modal }) => {
    return (
        <div className="cb-absolute cb-inset-0 cb-z-30 cb-flex cb-items-center cb-justify-center cb-rounded-xl cb-bg-foreground/30">
            <ModalDialog>
                <ModalHeader title={modal.title} onDismiss={modal.dismissFn} />
                <ModalContent>{modal.text}</ModalContent>
                <ModalFooter>
                    <Button onClick={modal.dismissFn} variant="secondary">
                        {t("modal.buttons.no")}
                    </Button>
                    <Button onClick={modal.confirmFn} variant="danger">
                        {t("modal.buttons.yes")}
                    </Button>
                </ModalFooter>
            </ModalDialog>
        </div>
    );
};

export const ModalDialog: FC<ModalDialogProps> = ({ children }) => {
    return <div className="cb-w-3/4 cb-rounded-xl cb-bg-background">{children}</div>;
};

export const ModalHeader: FC<ModalHeaderProps> = ({ title, onDismiss }) => {
    return (
        <div className="cb-flex cb-items-center cb-justify-between cb-gap-3 cb-py-1 cb-pe-1 cb-ps-3">
            <h3 className="cb-font-medium">{title}</h3>
            <Button onClick={onDismiss} variant="link" icon={CloseIcon} />
        </div>
    );
};

export const ModalContent: FC<ModalContentProps> = ({ children }) => {
    return <div className="cb-px-3 cb-pb-3">{children}</div>;
};

export const ModalFooter: FC<ModalFooterProps> = ({ children }) => {
    return (
        <div className="cb-flex cb-items-center cb-justify-end cb-gap-1 cb-border-t cb-px-3 cb-py-2">
            {children}
        </div>
    );
};
