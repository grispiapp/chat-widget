import { t } from "@/lang";
import { RatingIcons } from "@components/icons";
import { cn, getFirst } from "@lib/utils";
import { type FC } from "preact/compat";
import { useState } from "preact/hooks";
import { type JSX } from "preact/jsx-runtime";

export type RatingValue = 1 | 2 | 3 | 4 | 5;

const RATING_COMPONENTS = {
    1: {
        component: RatingIcons[1],
        className: {
            default: "cb-text-[#dcdce6]",
            hover: "cb-text-[#FFA98D]",
        },
    },
    2: {
        component: RatingIcons[2],
        className: {
            default: "cb-text-[#dcdce6]",
            hover: "cb-text-[#FFC385]",
        },
    },
    3: {
        component: RatingIcons[3],
        className: {
            default: "cb-text-[#dcdce6]",
            hover: "cb-text-[#FFD885]",
        },
    },
    4: {
        component: RatingIcons[4],
        className: {
            default: "cb-text-[#dcdce6]",
            hover: "cb-text-[#FFD885]",
        },
    },
    5: {
        component: RatingIcons[5],
        className: {
            default: "cb-text-[#dcdce6]",
            hover: "cb-text-[#FFD885]",
        },
    },
};

interface RatingProps {
    value: RatingValue;
    onChange: (value: RatingValue) => void;
}

export const Rating: FC<RatingProps> = ({ value, onChange }) => {
    const [hoverState, setHoverState] = useState<RatingValue>(null);

    const handleMouseEnter = (e: JSX.TargetedMouseEvent<SVGElement>) => {
        setHoverState(Number(e.currentTarget.dataset.value) as RatingValue);
    };

    const handleMouseLeave = () => {
        setHoverState(null);
    };

    return (
        <div className="cb-flex cb-items-center cb-gap-3">
            <div className="cb-flex cb-items-center cb-gap-1">
                {Object.values(RATING_COMPONENTS).map((item, i) => (
                    <item.component
                        key={i}
                        onClick={() => onChange((i + 1) as RatingValue)}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        className={cn(
                            "cb-h-8 cb-w-8 cb-cursor-pointer cb-rounded-full cb-transition-all",
                            item.className.default,
                            {
                                "cb-scale-125": value === i + 1,
                                [item.className.hover]:
                                    hoverState > i || (value > i && hoverState === null),
                            }
                        )}
                        data-value={i + 1}
                    />
                ))}
            </div>
            <span className="cb-font-medium">
                {t(`ratingStates.${getFirst(hoverState, value)}`)}
            </span>
        </div>
    );
};
