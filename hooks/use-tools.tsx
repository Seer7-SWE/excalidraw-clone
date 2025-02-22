import { CursorStateType, ToolType } from "@/types";
import { useState } from "react";

export const useTools = () => {
    const [activeTool, setActiveTool] = useState<ToolType>("select");
    const [cursor, setCursor] = useState<CursorStateType>("default");

    const toolToCursorConfig: Record<ToolType, CursorStateType> = {
        select: "default",
        pan: "grab",
        text: "text",
        line: "crosshair",
        rectangle: "crosshair",
        circle: "crosshair",
        arrow: "crosshair",
        draw: "crosshair",
        erase: "not-allowed",
    };

    const selectTool = (tool: ToolType) => {
        setActiveTool(tool);
        setCursor(toolToCursorConfig[tool]);
    };

    return { activeTool, cursor, selectTool };
};
