"use client";

import { Toolbar } from "@/components/toolbar";
import { ToolbarMenu } from "@/components/toolbar-menu";
import { Canvas } from "./canvas";

export const CanvasWrapper = () => {
    return (
        <div className="w-full h-full relative">
            <Toolbar />
            <ToolbarMenu />
            <Canvas />
        </div>
    );
};
