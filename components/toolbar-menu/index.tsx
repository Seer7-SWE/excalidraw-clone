"use client";

import { useRecoilState } from "recoil";
import { ColorPicker } from "../color-picker";
import { StrokeWidthPicker } from "../stroke-width-picker";
import { toolCursorState, toolState } from "@/state";
import { BackgroundPicker } from "../background-picker";
import { StrokeStylePicker } from "../stroke-style-picker";
import { FontTool } from "../font-tool";

export const ToolbarMenu = () => {
    const [toolCursor, _] = useRecoilState(toolCursorState);

    const renderEl: JSX.Element | null =
        toolCursor.tool !== "pan" && toolCursor.tool !== "select" ? (
            <div className="w-[202px] select-none h-fit z-50 bg-white cursor-default rounded-md shadow-spread p-3 space-y-4 absolute top-28 left-5">
                <ColorPicker />
                {/* @ts-ignore */}
                {(toolCursor.tool === "rectangle" || toolCursor.tool === "circle") && (
                    <BackgroundPicker />
                )}
                {toolCursor.tool !== "text" && (
                    <>
                        <StrokeWidthPicker />
                        <StrokeStylePicker />
                    </>
                )}
                {toolCursor.tool === "text" && <FontTool />}
            </div>
        ) : null;

    return renderEl;
};
