"use client";

import { canvasReducer, State } from "@/reducer/canvas-reducer";
import { CanvasElement, Coordinates } from "@/types";
import { useCallback, useMemo, useReducer, useRef, useState } from "react";

const initialState: State = {
    elements: [],
    selectedElementId: null,
    scale: 1,
    panOffset: { x: 0, y: 0 },
    isWriting: false,
    textareaPosition: { x: 0, y: 0 },
    resizing: {
        isResizing: false,
        corner: null,
    },
};

export const useCanvasState = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [state, dispatch] = useReducer(canvasReducer, initialState);

    // const [elements, setElements] = useState<CanvasElement[]>([]);
    // const [selectedElement, setSelectedElement] = useState<CanvasElement | null>(null);
    // const [scale, setScale] = useState(1);
    // const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

    const scaledOffset = useMemo(
        () => ({
            x:
                (canvasRef.current?.clientWidth ||
                    1 * state.scale - (canvasRef.current?.clientHeight || 1)) / 2,
            y:
                ((canvasRef.current?.clientWidth || 1) * state.scale -
                    (canvasRef.current?.clientHeight || 1)) /
                2,
        }),
        [state.scale]
    );

    const getScaledCoordinates = useCallback(
        (clientX: number, clientY: number): Coordinates => {
            const rect = canvasRef.current?.getBoundingClientRect();
            return {
                x: (clientX - (rect?.left || 0) - state.panOffset.x) / state.scale,
                y: (clientY - (rect?.top || 0) - state.panOffset.y) / state.scale,
            };
        },
        [state.panOffset.x, state.panOffset.y, state.scale]
    );

    return {
        ...state,
        scaledOffset,
        getScaledCoordinates,
        dispatch,
    };
};
