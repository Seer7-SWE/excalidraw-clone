"use client";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";

interface HintProps {
    children: React.ReactNode;
    label: string;
    side?: "top" | "bottom" | "left" | "right";
    align?: "start" | "center" | "end";
    sideOffset?: number;
    alignOffset?: number;
}

export const Hint = ({ children, label, side, align, alignOffset, sideOffset }: HintProps) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <TooltipProvider>
            <Tooltip delayDuration={700}>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent
                    className="shadow-md"
                    side={side}
                    align={align}
                    sideOffset={sideOffset}
                    alignOffset={alignOffset}
                >
                    <p className="font-medium text-xs">{label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
