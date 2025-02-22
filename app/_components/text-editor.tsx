import { Coordinates, Position } from "@/types";
import { forwardRef } from "react";

interface TextEditorProps {
    isVisible: boolean;
    position: Coordinates;
    onBlur: () => void;
    onEdit: (value: string) => void;
}

export const CanvasTextEditor = forwardRef<HTMLTextAreaElement, TextEditorProps>(
    ({ isVisible, position, onBlur, onEdit }, ref) => {
        const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
            onEdit(e.target.value);
        };

        return isVisible ? (
            <textarea
                ref={ref}
                className="canvas-text-editor"
                style={{
                    position: "fixed",
                    left: position.x,
                    top: position.y,
                    resize: "none",
                    overflow: "hidden",
                }}
                onBlur={onBlur}
                onChange={handleInput}
            />
        ) : null;
    }
);

CanvasTextEditor.displayName = "CanvasTextEditor";
