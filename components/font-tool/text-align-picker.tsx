"use client";

import { WidthItem } from "@/components/width-item";
import { textAlignState } from "@/state";
import { TextAlignType } from "@/types";
import { AlignCenter, AlignLeft, AlignRight } from "lucide-react";
import { useRecoilState } from "recoil";

export const TextAlignPicker = () => {
    const [textAlign, setTextAlign] = useRecoilState(textAlignState);

    const iconStyle = "w-4 h-4";

    const styles = [
        {
            value: "left" as TextAlignType,
            icon: <AlignLeft className={iconStyle} />,
            active: textAlign === "left",
        },
        {
            value: "center" as TextAlignType,
            icon: <AlignCenter className={iconStyle} />,
            active: textAlign === "center",
        },

        {
            value: "right" as TextAlignType,
            icon: <AlignRight className={iconStyle} />,
            active: textAlign === "right",
        },
    ];

    const onClick = (sizeValue: TextAlignType) => {
        setTextAlign(sizeValue);
    };

    return (
        <div className="flex items-center gap-2 py-1">
            {styles.map((style) => (
                <WidthItem<TextAlignType> key={style.value} data={style} onClick={onClick} />
            ))}
        </div>
    );
};
