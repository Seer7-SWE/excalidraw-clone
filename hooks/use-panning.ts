import { MutableRefObject, useState } from "react";

export const usePanning = (canvasRef: MutableRefObject<HTMLCanvasElement | null>) => {
    const [panning, setPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });
    const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

    const startPanning = (event: React.MouseEvent) => {
        setPanning(true);

        console.log("started panning at ", event.clientX, event.clientY);
        setPanStart({ x: event.clientX, y: event.clientY });
        console.log("started panning");
    };

    const doPan = (event: React.MouseEvent) => {
        if (!panning) return;

        setPanOffset((prev) => ({
            x: prev.x + event.clientX - panStart.x,
            y: prev.y + event.clientY - panStart.y,
        }));

        setPanStart({ x: event.clientX, y: event.clientY });
    };

    const stopPanning = () => {
        console.log("stopped panning");
        setPanning(false);
    };

    return { panning, startPanning, stopPanning, doPan, panOffset };
};
