import {
    MousePointer,
    Pencil,
    Eraser,
    RectangleHorizontal,
    Circle,
    Hand,
    Minus,
    Text,
    Type,
    ArrowRight,
    MoveRight,
} from "lucide-react";
import { ToolButtonWrapper } from "./tool-button-wrapper";
import { CursorStateType, ToolType } from "@/types";

export const Toolbar = () => {
    const toolbarItemStyle = "w-4 h-4";

    const toolBarItems = [
        {
            tool: "pan",
            icon: <Hand className={toolbarItemStyle} />,
            cursorStyle: "grab",
        },
        {
            tool: "select",
            icon: <MousePointer className={toolbarItemStyle} />,
            cursorStyle: "default",
        },
        {
            tool: "draw",
            icon: <Pencil className={toolbarItemStyle} />,
            cursorStyle: "crosshair",
        },
        {
            tool: "rectangle",
            icon: <RectangleHorizontal className={toolbarItemStyle} />,
            cursorStyle: "crosshair",
        },
        {
            tool: "circle",
            icon: <Circle className={toolbarItemStyle} />,
            cursorStyle: "crosshair",
        },
        {
            tool: "line",
            icon: <Minus className={toolbarItemStyle} />,
            cursorStyle: "crosshair",
        },
        {
            tool: "erase",
            icon: <Eraser className={toolbarItemStyle} />,
            cursorStyle: "not-allowed",
        },
        {
            tool: "text",
            icon: <Type className={toolbarItemStyle} />,
            cursorStyle: "text",
        },
        {
            tool: "arrow",
            icon: <MoveRight className={toolbarItemStyle} />,
            cursorStyle: "crosshair",
        },
    ];

    return (
        // w-[455px] md:w-[550px]
        <div className="flex gap-1 z-50 select-none bg-white cursor-default w-fit p-1 shadow-spread rounded-md  absolute top-8 left-1/2 -translate-x-1/2">
            {toolBarItems.map((item, idx) => (
                <ToolButtonWrapper
                    key={idx}
                    tool={item.tool as ToolType}
                    cursorStyle={item.cursorStyle as CursorStateType}
                    icon={item.icon}
                />
            ))}
        </div>
    );
};
