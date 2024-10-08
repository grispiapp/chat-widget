import { LoadingIcon } from "@components/icons";

export const LoadingSpinner = () => {
    return (
        <div className="cb-absolute cb-inset-0 cb-z-10 cb-flex cb-items-center cb-justify-center cb-bg-background/50">
            <LoadingIcon className="cb-h-6 cb-w-6 cb-text-primary" />
        </div>
    );
};
