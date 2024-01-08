"use client";

import { cn } from "@/lib/utils";

interface ColorItemProps {
    color: string;
    onClick?: (value: string) => void;
    size: "sm" | "lg";
    active?: boolean;
}

export const ColorItem = ({ color, onClick, size = "sm", active }: ColorItemProps) => {
    return (
        <button
            onClick={onClick ? () => onClick(color) : undefined}
            style={{ backgroundColor: color }}
            className={cn(
                "rounded-sm transition duration-150 relative",
                size === "sm" ? "w-5 h-5" : "w-7 h-7",
                active !== undefined ? (active ? "color-item-active" : "color-item") : ""
            )}
        />
    );
};
