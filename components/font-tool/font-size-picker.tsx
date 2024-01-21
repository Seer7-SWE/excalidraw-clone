"use client";

import { WidthItem } from "@/components/width-item";
import { fontSizeState } from "@/state";
import { FontSizeType } from "@/types";
import { useRecoilState } from "recoil";

export const FontSizePicker = () => {
    const [fontSize, setFontSize] = useRecoilState(fontSizeState);

    const styles = [
        {
            value: 18 as FontSizeType,
            icon: "S",
            active: fontSize === 18,
        },
        {
            value: 20 as FontSizeType,
            icon: "M",
            active: fontSize === 20,
        },

        {
            value: 24 as FontSizeType,
            icon: "L",
            active: fontSize === 24,
        },
        {
            value: 26 as FontSizeType,
            icon: "XL",
            active: fontSize === 26,
        },
    ];

    const onClick = (sizeValue: FontSizeType) => {
        setFontSize(sizeValue);
    };

    return (
        <div className="flex items-center gap-2 py-1">
            {styles.map((style) => (
                <WidthItem<FontSizeType> key={style.value} data={style} onClick={onClick} />
            ))}
        </div>
    );
};
