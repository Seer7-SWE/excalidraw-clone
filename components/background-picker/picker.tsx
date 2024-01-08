"use client";

import { useRecoilState } from "recoil";
// import { ColorItem } from "./color-item";
import { ColorItem } from "../color-item";
import { backgroundColorState, strokeColorState } from "@/state";
import { Separator } from "../separator";

const colors = ["#ebebeb", "#ffc9c9", "#b2f2bb", "#a5d8ff", "#ffec99"];

export const BgPicker = () => {
    const [bgColor, setBgColor] = useRecoilState(backgroundColorState);

    const onClick = (colorValue: string) => {
        setBgColor(colorValue);
    };

    return (
        <div className="flex items-center justify-evenly py-1">
            {/* Color selection */}
            {colors.map((color, idx) => (
                <ColorItem
                    key={idx}
                    color={color}
                    onClick={onClick}
                    size="sm"
                    active={color === bgColor}
                />
            ))}

            <Separator className={"w-[1px] h-6"} />
            {/* Selected color */}
            <ColorItem color={bgColor} size="lg" />
        </div>
    );
};
