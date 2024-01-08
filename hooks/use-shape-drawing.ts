"use client";

import {
    StrokeStyleState,
    backgroundColorState,
    strokeColorState,
    strokeWidthState,
} from "@/state";
import { ShapesType } from "@/types";

import { useState } from "react";
import { useRecoilState } from "recoil";
import { RoughCanvas } from "roughjs/bin/canvas";
import { Drawable, ResolvedOptions } from "roughjs/bin/core";

interface ShapeReturnType {
    id: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    roughElement: Drawable | undefined;
    shape: ShapesType;
    isSelected?: boolean;
}

const strokeWidthMap: Record<string, number> = {
    thin: 1,
    bold: 4,
    extrabold: 8,
};

const strokeStyleMap: Record<string, number[]> = {
    solid: [0, 0],
    dashed: [10, 10],
    dotted: [3, 3],
};

export const useShapeDrawing = (roughCanvas: RoughCanvas | null) => {
    const [isDrawingShapes, setIsDrawingShapes] = useState<boolean>(false);

    const [strokeColor, _] = useRecoilState(strokeColorState);
    const [strokeWidth, __] = useRecoilState(strokeWidthState);
    const [strokeStyle, _____] = useRecoilState(StrokeStyleState);
    const [fillColor, ____] = useRecoilState(backgroundColorState);

    const drawRectangle = (
        id: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        options?: ResolvedOptions,
        isSelected?: boolean
    ): ShapeReturnType => {
        const borderRadius = 1;

        const roughElement = roughCanvas?.generator.path(
            `M${x1 + borderRadius} ${y1} 
        Q${x1} ${y1}, ${x1} ${y1 + borderRadius} 
        L${x1} ${y2 - borderRadius} 
        Q${x1} ${y2}, ${x1 + borderRadius} ${y2} 
        L${x2 - borderRadius} ${y2} 
        Q${x2} ${y2}, ${x2} ${y2 - borderRadius} 
        L${x2} ${y1 + borderRadius} 
        Q${x2} ${y1}, ${x2 - borderRadius} ${y1} 
        Z`,

            {
                stroke: strokeColor,
                strokeWidth: strokeWidthMap[strokeWidth],
                roughness: 0,
                fill: fillColor === "#ebebeb" ? "" : fillColor,
                strokeLineDash: strokeStyleMap[strokeStyle],

                ...options, // Override default options with provided options
            }
        );

        return { id, x1, y1, x2, y2, roughElement, shape: "rectangle", isSelected };
    };

    const drawLine = (
        id: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        options?: ResolvedOptions,
        isSelected?: boolean
    ): ShapeReturnType => {
        const roughElement = roughCanvas?.generator.line(x1, y1, x2, y2, {
            stroke: strokeColor,
            strokeLineDash: strokeStyleMap[strokeStyle],
            strokeWidth: strokeWidthMap[strokeWidth],
            roughness: 0,
            ...options,
        });

        return { id, x1, y1, x2, y2, roughElement, shape: "line", isSelected };
    };

    const drawCircle = (
        id: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        options?: ResolvedOptions,
        isSelected?: boolean
    ): ShapeReturnType => {
        const width = x2 - x1;
        const height = y2 - y1;
        const roughElement = roughCanvas?.generator.ellipse(
            x1 + width / 2,
            y1 + height / 2,
            width,
            height,
            {
                stroke: strokeColor,
                strokeLineDash: strokeStyleMap[strokeStyle],
                strokeWidth: strokeWidthMap[strokeWidth],
                roughness: 0,
                fill: fillColor === "#ebebeb" ? "" : fillColor,
                ...options,
            }
        );

        return { id, x1, y1, x2, y2, roughElement, shape: "circle", isSelected };
    };

    const startDrawingShapes = (
        id: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        shape: ShapesType
    ) => {
        setIsDrawingShapes(true);

        switch (shape) {
            case "rectangle":
                return drawRectangle(id, x1, y1, x2, y2);

            case "circle":
                return drawCircle(id, x1, y1, x2, y2);

            case "line":
                return drawLine(id, x1, y1, x2, y2);

            default:
                break;
        }
    };

    const drawShapes = (
        id: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        shapeType: ShapesType,
        options?: ResolvedOptions,
        isSelected?: boolean
    ) => {
        switch (shapeType) {
            case "rectangle":
                return drawRectangle(id, x1, y1, x2, y2, options, isSelected);
            case "circle":
                return drawCircle(id, x1, y1, x2, y2, options, isSelected);

            case "line":
                return drawLine(id, x1, y1, x2, y2, options, isSelected);

            default:
                return null;
        }
    };

    const stopDrawingShapes = () => {
        setIsDrawingShapes(false);
    };

    return { startDrawingShapes, drawShapes, stopDrawingShapes, isDrawingShapes };
};
