import { DrawnElementType, Position, XYWH } from "@/types";
import { memo, useCallback, useMemo } from "react";

type SelectionBoxProps = {
    selectedElementId: number;
    drawnElements: DrawnElementType[];
    panOffset: { x: number; y: number };
    resizeHandler: (event: React.MouseEvent, position: Position) => void;
    resize: (event: React.MouseEvent) => void;
};

function boundingBox(layers: DrawnElementType, panOffset: { x: number; y: number }): XYWH | null {
    if (!layers) return null;

    let left = layers.x1;
    let right = layers.x2;
    let top = layers.y1;
    let bottom = layers.y2;

    return {
        x: left - 5 + panOffset.x,
        y: top - 5 + panOffset.y,
        width: right - left + 10,
        height: bottom - top + 10,
    };
}

export const SelectionBox = memo(
    ({ selectedElementId, drawnElements, panOffset, resizeHandler, resize }: SelectionBoxProps) => {
        const selectedItem = drawnElements[selectedElementId];

        let bounds = useMemo(() => boundingBox(selectedItem, panOffset), [selectedItem, panOffset]);

        if (!bounds) return null;

        return (
            <>
                <div
                    className="bg-transparent absolute z-50 outline-blue-500 outline outline-1 pointer-events-none"
                    style={{
                        top: bounds.y,
                        left: bounds.x,
                        width: bounds.width,
                        height: bounds.height,
                    }}
                />

                {/* TODO: MAKE THEM WORK !!!! */}
                {/* Resize handlers  */}
                {/* Top Left */}
                <div
                    className="bg-white w-2 h-2 absolute z-50 outline-blue-500 outline outline-1 "
                    style={{
                        top: bounds.y - 4,
                        left: bounds.x - 4,
                        cursor: "nwse-resize",
                    }}
                    onMouseDown={(e: React.MouseEvent) => {
                        resizeHandler(e, "tl");
                        e.stopPropagation();
                    }}
                    onMouseMove={resize}
                />

                {/* Top right */}
                <div
                    className="bg-white w-2 h-2 absolute z-50 outline-blue-500 outline outline-1 "
                    style={{
                        top: bounds.y - 4,
                        left: bounds.x + bounds.width - 4,
                        cursor: "nesw-resize",
                    }}
                    onMouseDown={(e: React.MouseEvent) => {
                        resizeHandler(e, "tr");
                        e.stopPropagation();
                    }}
                    onMouseMove={resize}
                />

                {/* Bottom Left */}
                <div
                    className="bg-white w-2 h-2 absolute z-50 outline-blue-500 outline outline-1 "
                    style={{
                        top: bounds.y + bounds.height - 4,
                        left: bounds.x - 4,
                        cursor: "nesw-resize",
                    }}
                    onMouseDown={(e: React.MouseEvent) => {
                        resizeHandler(e, "bl");
                        e.stopPropagation();
                    }}
                    onMouseMove={resize}
                />

                {/* Bottom Right */}
                <div
                    className="bg-white w-2 h-2 absolute z-50 outline-blue-500 outline outline-1 "
                    style={{
                        top: bounds.y + bounds.height - 4,
                        left: bounds.x + bounds.width - 4,
                        cursor: "nwse-resize",
                    }}
                    onMouseDown={(e: React.MouseEvent) => {
                        resizeHandler(e, "br");
                        e.stopPropagation();
                    }}
                    onMouseMove={resize}
                />

                {/* Top Mid */}
                <div
                    className="bg-white w-2 h-2 absolute z-50 outline-blue-500 outline outline-1 "
                    style={{
                        top: bounds.y - 4,
                        left: bounds.x + bounds.width / 2 - 4,
                        cursor: "ns-resize",
                    }}
                />

                {/* Left Mid */}
                <div
                    className="bg-white w-2 h-2 absolute z-50 outline-blue-500 outline outline-1 "
                    style={{
                        top: bounds.y + bounds.height / 2 - 4,
                        left: bounds.x - 4,
                        cursor: "ew-resize",
                    }}
                />

                {/* Right Mid */}
                <div
                    className="bg-white w-2 h-2 absolute z-50 outline-blue-500 outline outline-1 "
                    style={{
                        top: bounds.y + bounds.height / 2 - 4,
                        left: bounds.x + bounds.width - 4,
                        cursor: "ew-resize",
                    }}
                />

                {/* Bottom Mid */}
                <div
                    className="bg-white w-2 h-2 absolute z-50 outline-blue-500 outline outline-1 "
                    style={{
                        top: bounds.y + bounds.height - 4,
                        left: bounds.x + bounds.width / 2 - 4,
                        cursor: "ns-resize",
                    }}
                />
            </>
        );
    }
);

SelectionBox.displayName = "SelectionBox";
