import { Drawable } from "roughjs/bin/core";

export type CursorStateType =
    | "default"
    | "crosshair"
    | "not-allowed"
    | "grab"
    | "grabbing"
    | "text";
export type StrokeWidthType = "thin" | "bold" | "extrabold";
export type StrokeStyleType = "solid" | "dashed" | "dotted";

export type ToolType =
    | "select"
    | "draw"
    | "rectangle"
    | "circle"
    | "erase"
    | "pan"
    | "line"
    | "text"
    | "arrow";

export type ShapesType = "rectangle" | "circle" | "square" | "line" | "pencil" | "text" | "arrow";
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
    textValue?: string;

    isSelected?: boolean;
    offsetX?: number;
    offsetY?: number;
    strokeOptions?: Record<string, any>;

    textAlign?: TextAlignType;
    fontSize?: FontSizeType;
    fontFamily?: FontFamilyType;
};

export type FontSizeType = 18 | 20 | 24 | 26;
export type FontFamilyType =
    | "__Epilogue_063c31, __Epilogue_Fallback_063c31"
    | "__Montserrat_cce811, __Montserrat_Fallback_cce811"
    | "__Roboto_Mono_829659, __Roboto_Mono_Fallback_829659";
export type TextAlignType = "left" | "center" | "right";

export type XYWH = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export type Position = "tl" | "tr" | "bl" | "br" | "tm" | "lm" | "rm" | "bm";
export type Coordinates = {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
};

export type PositionStatus = "inside" | "outside" | "boundary";
export type ElementAtPosition =
    | { positionStatus: "inside" | "boundary"; element: DrawnElementType }
    | { positionStatus: "outside"; element: null };

export type ToolCursorState = {
    tool: ShapesType | "select" | "erase";
    cursor: string;
};
