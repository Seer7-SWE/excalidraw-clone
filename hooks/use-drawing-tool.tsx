"use client";

import { ShapeType } from "@/types";
import { useCanvasState } from "./use-canvas-state";
import { drawOnCanvas } from "@/lib/utils";

export const useDrawingTool = (shapeType: ShapeType) => {
    const { dispatch, elements, getScaledCoordinates } = useCanvasState();

    const handleMouseDown = (e: React.MouseEvent) => {
        const { x, y } = getScaledCoordinates(e.clientX, e.clientY);
        const newElement = drawOnCanvas(elements.length, x, y);
        dispatch({ type: "ADD_ELEMENT", element: newElement });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const { x, y } = getScaledCoordinates(e.clientX, e.clientY);
        const lastElement = elements[elements.length - 1];
        dispatch({ type: "UPDATE_ELEMENT", id: lastElement.id, updates: { x2: x, y2: y } });
    };

    return { handleMouseDown, handleMouseMove };
};
