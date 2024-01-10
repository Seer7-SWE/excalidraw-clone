"use client";
import { useState } from "react";

export const useZoom = () => {
    const [scale, setScale] = useState<number>(1);
    const [scaleOffset, setScaleOffset] = useState({ x: 0, y: 0 });

    const zoomIn = () => {
        if (scale < 2) {
            setScale((prev) => prev + 0.1);
        }
    };

    const zoomOut = () => {
        if (scale > 0.5) {
            setScale((prev) => prev - 0.1);
        }
    };

    const resetZoom = () => {
        setScale(1);
    };

    return { zoomIn, zoomOut, scale, scaleOffset, setScaleOffset, resetZoom };
};
