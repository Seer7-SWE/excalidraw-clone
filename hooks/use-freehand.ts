"use client";

import { strokeColorState, strokeWidthState } from "@/state";
import { DrawnElementType, Point } from "@/types";
import getStroke from "perfect-freehand";
import { useRecoilState } from "recoil";

import { useState } from "react";

export type FreeHandPoints = [x: number, y: number];

const sizeMap: Record<string, number> = {
    thin: 2,
    bold: 5,
    extrabold: 7,
};

export const useFreehand = () => {
    const [strokeWidth, _] = useRecoilState(strokeWidthState);
    const [strokeColor, __] = useRecoilState(strokeColorState);

    const [isDrawing, setIsDrawing] = useState<boolean>(false);

    const drawFreehand = (id: number, mouseX: number, mouseY: number): DrawnElementType => {
        const strokeOptions = {
            size: sizeMap[strokeWidth],
            color: strokeColor,
            thinning: -0.99,
        };

        return {
            id,
            shape: "pencil",
            points: [{ x: mouseX, y: mouseY }],
            roughElement: undefined,
            x1: mouseX,
            x2: mouseX,
            y1: mouseY,
            y2: mouseY,
            strokeOptions,
        };
    };

    const startFreehandDrawing = () => {
        setIsDrawing(true);
    };

    const stopFreehandDrawing = () => {
        setIsDrawing(false);
    };

    return { drawFreehand, isDrawing, startFreehandDrawing, stopFreehandDrawing };
};
