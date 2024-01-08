"use client";

import { Minus } from "lucide-react";
import { WidthItem } from "../width-item";
import { useRecoilState } from "recoil";
import { StrokeStyleState } from "@/state";
import { StrokeStyleType } from "@/types";

export const StylePicker = () => {
    const [strokeStyle, setStrokeStyle] = useRecoilState(StrokeStyleState);

    const styles = [
        {
            value: "solid" as StrokeStyleType,
            icon: <Minus strokeWidth={1} className="w-4 h-4" />,
            active: strokeStyle === "solid",
        },
        {
            value: "dashed" as StrokeStyleType,
            icon: (
                <svg
                    aria-hidden="true"
                    focusable="false"
                    role="img"
                    viewBox="0 0 24 24"
                    className="w-4 h-4"
                    fill="none"
                    strokeWidth="2"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <g strokeWidth="2">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M5 12h2"></path>
                        <path d="M17 12h2"></path>
                        <path d="M11 12h2"></path>
                    </g>
                </svg>
            ),
            active: strokeStyle === "dashed",
        },
        {
            value: "dotted" as StrokeStyleType,
            icon: (
                <svg
                    aria-hidden="true"
                    focusable="false"
                    role="img"
                    viewBox="0 0 24 24"
                    className="w-4 h-4"
                    fill="none"
                    strokeWidth="2"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <g strokeWidth="2">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M4 12v.01"></path>
                        <path d="M8 12v.01"></path>
                        <path d="M12 12v.01"></path>
                        <path d="M16 12v.01"></path>
                        <path d="M20 12v.01"></path>
                    </g>
                </svg>
            ),
            active: strokeStyle === "dotted",
        },
    ];

    const onClick = (styleValue: StrokeStyleType) => {
        setStrokeStyle(styleValue);
    };

    return (
        <div className="flex items-center gap-2 py-1">
            {styles.map((style) => (
                <WidthItem<StrokeStyleType> key={style.value} data={style} onClick={onClick} />
            ))}
        </div>
    );
};
