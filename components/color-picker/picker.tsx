"use client";

import { useRecoilState } from "recoil";
import { ColorItem } from "../color-item";
import { strokeColorState } from "@/state";
import { Separator } from "../separator";

const colors = ["#1e1e1e", "#e03131", "#2f9e44", "#1971c2", "#f08c00"];

export const Picker = () => {
    const [strokeColor, setStrokeColor] = useRecoilState(strokeColorState);

    const onClick = (colorValue: string) => {
        setStrokeColor(colorValue);
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
                    active={color === strokeColor}
                />
            ))}

            <Separator className={"w-[1px] h-6"} />
            {/* Selected color */}
            <ColorItem color={strokeColor} size="lg" />
        </div>
    );
};
