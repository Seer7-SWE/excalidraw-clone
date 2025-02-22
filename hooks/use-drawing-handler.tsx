import { useCallback } from "react";
import { useCanvasState } from "./use-canvas-state";
import { useTools } from "./use-tools";

export const useDrawingHandlers = () => {
    const { elements, dispatch } = useCanvasState();
    const { toolHandler } = useTools();

    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            toolHandler.handleMouseDown(e);
        },
        [toolHandler]
    );

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            toolHandler.handleMouseMove(e);
        },
        [toolHandler]
    );

    const handleMouseUp = useCallback(
        (e: React.MouseEvent) => {
            toolHandler.handleMouseUp(e);
        },
        [toolHandler]
    );

    return {
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleStartResizing: toolHandler.handleResizeStart,
    };
};
