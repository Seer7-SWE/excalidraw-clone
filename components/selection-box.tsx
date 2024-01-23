import { DrawnElementType, XYWH } from "@/types";
import { Pangolin } from "next/font/google";
import { memo, useCallback, useMemo } from "react";

type SelectionBoxProps = {
    selectedElementId: number;
    drawnElements: DrawnElementType[];
    panOffset: { x: number; y: number };
};

function boundingBox(layers: DrawnElementType): XYWH | null {
    if (!layers) return null;

    let left = layers.x1;
    let right = layers.x2;
    let top = layers.y1;
    let bottom = layers.y2;

    return {
        x: left - 5,
        y: top - 5,
        width: right - left + 10,
        height: bottom - top + 10,
    };
}

export const SelectionBox = memo(
    ({ selectedElementId, drawnElements, panOffset }: SelectionBoxProps) => {
        const selectedItem = drawnElements[selectedElementId];

        let bounds = useMemo(() => boundingBox(selectedItem), [selectedItem]);

        if (!bounds) return null;

        bounds.x = bounds.x + panOffset.x / 2;
        bounds.y = bounds.y + panOffset.y / 2;

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
                    className="bg-white w-2 h-2 absolute z-50 outline-blue-500 outline outline-1 pointer-events-none"
                    style={{
                        top: bounds.y - 4,
                        left: bounds.x - 4,
                        // cursor:
                    }}
                />

                {/* Top right */}
                <div
                    className="bg-white w-2 h-2 absolute z-50 outline-blue-500 outline outline-1 pointer-events-none"
                    style={{
                        top: bounds.y - 4,
                        left: bounds.x + bounds.width - 4,
                    }}
                />

                {/* Bottom Left */}
                <div
                    className="bg-white w-2 h-2 absolute z-50 outline-blue-500 outline outline-1 pointer-events-none"
                    style={{
                        top: bounds.y + bounds.height - 4,
                        left: bounds.x,
                    }}
                />

                {/* Bottom Right */}
                <div
                    className="bg-white w-2 h-2 absolute z-50 outline-blue-500 outline outline-1 pointer-events-none"
                    style={{
                        top: bounds.y + bounds.height - 4,
                        left: bounds.x + bounds.width - 4,
                    }}
                />

                {/* Top Mid */}
                <div
                    className="bg-white w-2 h-2 absolute z-50 outline-blue-500 outline outline-1 pointer-events-none"
                    style={{
                        top: bounds.y - 4,
                        left: bounds.x + bounds.width / 2 - 4,
                    }}
                />

                {/* Left Mid */}
                <div
                    className="bg-white w-2 h-2 absolute z-50 outline-blue-500 outline outline-1 pointer-events-none"
                    style={{
                        top: bounds.y + bounds.height / 2 - 4,
                        left: bounds.x - 4,
                    }}
                />

                {/* Right Mid */}
                <div
                    className="bg-white w-2 h-2 absolute z-50 outline-blue-500 outline outline-1 pointer-events-none"
                    style={{
                        top: bounds.y + bounds.height / 2 - 4,
                        left: bounds.x + bounds.width - 4,
                    }}
                />

                {/* Bottom Mid */}
                <div
                    className="bg-white w-2 h-2 absolute z-50 outline-blue-500 outline outline-1 pointer-events-none"
                    style={{
                        top: bounds.y + bounds.height - 4,
                        left: bounds.x + bounds.width / 2 - 4,
                    }}
                />
            </>
        );
    }
);

SelectionBox.displayName = "SelectionBox";
