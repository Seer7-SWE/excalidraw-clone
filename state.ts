"use client";

import { atom } from "recoil";

// Types
import { CursorStateType, StrokeStyleType, StrokeWidthType, ToolType } from "./types";

export const backgroundColorState = atom({
    key: "backgroundColor",
    default: "#ebebeb",
});

export const strokeColorState = atom({
    key: "strokeColorState",
    default: "#1e1e1e",
});

export const strokeWidthState = atom<StrokeWidthType>({
    key: "strokeWidthState",
    default: "thin",
});

export const StrokeStyleState = atom<StrokeStyleType>({
    key: "strokeStyleState",
    default: "solid",
});

export const toolState = atom<ToolType>({
    key: "toolState",
    default: "select",
});

export const cursorState = atom<CursorStateType>({
    key: "cursorState",
    default: "default",
});
