"use client";

import { Minus } from "lucide-react";
import { WidthItem } from "../width-item";
import { useRecoilState } from "recoil";
import { strokeWidthState } from "@/state";
import { StrokeWidthType } from "@/types";

export const WidthPicker = () => {
    const [strokeWidth, setStrokeWidth] = useRecoilState(strokeWidthState);

    const widths = [
        {
            value: "thin" as StrokeWidthType,
            icon: <Minus strokeWidth={1} className="w-4 h-4" />,
            active: strokeWidth === "thin",
        },
        {
            value: "bold" as StrokeWidthType,
            icon: <Minus strokeWidth={3} className="w-4 h-4" />,
            active: strokeWidth === "bold",
        },
        {
            value: "extrabold" as StrokeWidthType,
            icon: <Minus strokeWidth={5} className="w-4 h-4" />,
            active: strokeWidth === "extrabold",
        },
    ];

    const onClick = (widthValue: StrokeWidthType) => {
        setStrokeWidth(widthValue);
    };

    return (
        <div className="flex items-center gap-2 py-1">
            {widths.map((width) => (
                <WidthItem key={width.value} data={width} onClick={onClick} />
            ))}
        </div>
    );
};
