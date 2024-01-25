import { LoadingIcon } from "@components/icons";

export const LoadingSpinner = () => {
    return (
        <div className="cbz-10 cb-absolute cb-inset-0 cb-flex cb-items-center cb-justify-center cb-bg-background/50">
            <LoadingIcon className=" cb-h-6 cb-w-6 cb-animate-spin cb-text-primary" />
        </div>
    );
};
