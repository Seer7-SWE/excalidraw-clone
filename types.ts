import { Drawable } from "roughjs/bin/core";

export type CursorStateType = "default" | "crosshair" | "not-allowed" | "grab" | "grabbing";
export type StrokeWidthType = "thin" | "bold" | "extrabold";
export type StrokeStyleType = "solid" | "dashed" | "dotted";

export type ToolType = "select" | "draw" | "rectangle" | "circle" | "erase" | "pan" | "line";

export type ShapesType = "rectangle" | "circle" | "square" | "line" | "pencil";
export type Point = { x: number; y: number; pressure?: number };

export type DrawnElementType = {
    id: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    roughElement: Drawable | undefined;
    shape: ShapesType;
    points?: Point[];

    isSelected?: boolean;
    offsetX?: number;
    offsetY?: number;
    strokeOptions?: Record<string, any>;
};
