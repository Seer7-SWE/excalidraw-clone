"use client";

import { useCanvasState } from "./use-canvas-state";

export const useSelectionTool = () => {
    const { dispatch, getScaledCoordinates } = useCanvasState();

    const handleMouseDown = (e: React.MouseEvent) => {
        const { x, y } = getScaledCoordinates(e.clientX, e.clientY);
        // Hit detection logic
        dispatch({ type: "SELECT_ELEMENT", id: detectedElementId });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!selectedElement) return;
        const { x, y } = getScaledCoordinates(e.clientX, e.clientY);
        dispatch({ type: "UPDATE_ELEMENT", id: selectedElement.id, updates: { x1: x, y1: y } });
    };

    return { handleMouseDown, handleMouseMove };
};
