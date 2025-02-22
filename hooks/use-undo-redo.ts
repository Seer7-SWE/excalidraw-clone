"use client";

import { CanvasElement } from "@/types";
import { useEffect, useState } from "react";

export const useUndoRedo = (initialState: CanvasElement[]) => {
    const [history, setHistory] = useState<CanvasElement[][]>(() => {
        // Might change this to useEffect
        const localData =
            typeof window !== "undefined" && window.localStorage
                ? localStorage.getItem("history")
                : null;
        return localData ? [JSON.parse(localData)] : [initialState];
    });

    const [index, setIndex] = useState<number>(0);

    useEffect(() => {
        if (localStorage) {
            localStorage.setItem("history", JSON.stringify(history[index]));
        }
    }, [history, index]);

    const push = (newState: CanvasElement[], overwrite: boolean = false) => {
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
