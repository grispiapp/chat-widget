import GrispiLogo from "@resources/images/grispi.svg";

export const PoweredBy = () => {
    return (
        <div className="cb-px-2 cb-pb-2 cb-text-center">
            <a
                href="https://grispi.com?utm_source=newsletter&utm_medium=poweredby&utm_campaign=widget&utm_id=chat-widget"
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="cb-flex cb-items-center cb-justify-center cb-gap-1 cb-text-xs cb-text-muted-foreground"
            >
                <div className="cb-flex cb-items-center cb-gap-1">
                    Powered by <img className="cb-w-10" src={GrispiLogo} alt="Grispi Logo" />
                </div>
            </a>
        </div>
    );
};
