"use client";

import { ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "./ui/button";

interface ZoomProps {
    scale: number;
    zoomIn: () => void;
    zoomOut: () => void;
    resetZoom: () => void;
}

export const Zoom = ({ scale, zoomIn, zoomOut, resetZoom }: ZoomProps) => {
    return (
        <div className="flex items-center space-x-2">
            <Button onClick={zoomIn} className="bg-neutral-200" size="sm" variant={"outline"}>
                <ZoomIn className="w-4 h-4" />
            </Button>
            <p className="text-sm cursor-pointer" onClick={resetZoom}>
                {new Intl.NumberFormat("en-GB", { style: "percent" }).format(scale)}
            </p>
            <Button onClick={zoomOut} className="bg-neutral-200" size="sm" variant={"outline"}>
                <ZoomOut className="w-4 h-4" />
            </Button>
        </div>
    );
};
