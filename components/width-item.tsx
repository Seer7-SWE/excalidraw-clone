"use client";

import { StrokeStyleType, StrokeWidthType } from "@/types";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface WidthItemProps<ValueType> {
    data: {
        value: ValueType;
        icon: JSX.Element;
        active: boolean;
    };
    onClick: (value: ValueType) => void;
}

export const WidthItem = <ValueType,>({ data, onClick }: WidthItemProps<ValueType>) => {
    return (
        <Button
            className={cn(data.active ? " bg-black/20 text-black" : "")}
            onClick={() => onClick(data.value)}
            variant={"menuItem"}
            size={"xs"}
        >
            {data.icon}
        </Button>
    );
};
