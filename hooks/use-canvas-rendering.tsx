"use client";

import { drawOnCanvas } from "@/lib/utils";
import { CanvasElement, Coordinates, DrawnElementType } from "@/types";
import { RefObject, useLayoutEffect, useState } from "react";
import { RoughCanvas } from "roughjs/bin/canvas";
import rough from "roughjs";

export const useCanvasRendering = (
    canvasRef: RefObject<HTMLCanvasElement>,
    elements: CanvasElement[],
    scale: number,
    panOffset: Coordinates
) => {
    const [roughCanvas, setRoughCanvas] = useState<RoughCanvas | null>(null);

    useLayoutEffect(() => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d");

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let roughCanv = rough.canvas(canvas);
        setRoughCanvas(roughCanv);

        if (!ctx) return;

        const render = () => {
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Apply transformations
            ctx.translate(panOffset.x, panOffset.y);
            ctx.scale(scale, scale);

            // Draw elements
            elements.forEach((element) => drawOnCanvas(element, roughCanv, ctx));

            ctx.restore();
        };

        const animationId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animationId);
    }, [elements, scale, panOffset]);
};
