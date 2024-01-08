import {
    MousePointer,
    Pencil,
    Eraser,
    RectangleHorizontal,
    Circle,
    Hand,
    Minus,
} from "lucide-react";
import { ToolButtonWrapper } from "./tool-button-wrapper";

export const Toolbar = () => {
    return (
        // w-[455px] md:w-[550px]
        <div className="flex gap-1 z-10 select-none bg-white cursor-default w-fit p-1 shadow-spread rounded-md  absolute top-8 left-1/2 -translate-x-1/2">
            <ToolButtonWrapper tool="pan" icon={<Hand className="w-4 h-4 " />} cursorStyle="grab" />

            <ToolButtonWrapper
                tool="select"
                icon={<MousePointer className="w-4 h-4 " />}
                cursorStyle="default"
            />

            <ToolButtonWrapper
                tool="draw"
                icon={<Pencil className="w-4 h-4 " />}
                cursorStyle="crosshair"
            />

            <ToolButtonWrapper
                tool="rectangle"
                icon={<RectangleHorizontal className="w-4 h-4 " />}
                cursorStyle="crosshair"
            />

            <ToolButtonWrapper
                tool="circle"
                icon={<Circle className="w-4 h-4 " />}
                cursorStyle="crosshair"
            />

            <ToolButtonWrapper
                tool="line"
                icon={<Minus className="w-4 h-4 " />}
                cursorStyle="crosshair"
            />

            <ToolButtonWrapper
                tool="erase"
                icon={<Eraser className="w-4 h-4 " />}
                cursorStyle="not-allowed"
            />
        </div>
    );
};
