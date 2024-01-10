"use client";

import { DrawnElementType } from "@/types";
import { useState } from "react";

export const useUndoRedo = (initialState: DrawnElementType[]) => {
    const [history, setHistory] = useState<DrawnElementType[][]>([initialState]);
    const [index, setIndex] = useState<number>(0);

    const push = (newState: DrawnElementType[], overwrite: boolean = false) => {
        if (overwrite) {
            const historyCopy = [...history];
            historyCopy[index] = newState;
            setHistory(historyCopy);
        } else {
            setHistory([...history.slice(0, index + 1), newState]);
            setIndex(index + 1);
        }
    };

    const undo = () => {
        if (index > 0) {
            setIndex(index - 1);
        }
    };

    const redo = () => {
        if (index < history.length - 1) {
            setIndex(index + 1);
        }
    };

    const canUndo = index > 0;
    const canRedo = index < history.length - 1;

    return { redo, undo, push, state: history[index], canUndo, canRedo };
};
