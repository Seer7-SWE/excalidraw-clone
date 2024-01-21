"use client";

import { Redo2, Undo2 } from "lucide-react";
import { Button } from "./ui/button";

interface UndoRedoProps {
    canUndo: boolean;
    canRedo: boolean;
    onUndo: () => void;
    onRedo: () => void;
}

export const UndoRedo = ({ canUndo, canRedo, onUndo, onRedo }: UndoRedoProps) => {
    return (
        <div>
            <Button
                disabled={!canUndo}
                onClick={onUndo}
                className="bg-neutral-200"
                size="sm"
                variant={"outline"}
            >
                <Undo2 className="w-4 h-4" />
            </Button>
            <Button
                disabled={!canRedo}
                onClick={onRedo}
                className="bg-neutral-200"
                size="sm"
                variant={"outline"}
            >
                <Redo2 className="w-4 h-4" />
            </Button>
        </div>
    );
};
