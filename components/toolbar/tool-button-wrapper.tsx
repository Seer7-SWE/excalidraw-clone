"use client";

import { useRecoilState } from "recoil";
import { toolState, cursorState } from "@/state";
import { ToolbarButton } from "./toolbar-button";
import { CursorStateType, ToolType } from "@/types";

interface ToolButtonWrapperProps {
    tool: ToolType;
    icon: JSX.Element;
    cursorStyle: CursorStateType;
}

export const ToolButtonWrapper = ({ tool, icon, cursorStyle }: ToolButtonWrapperProps) => {
    const [selectedTool, setSelectedTool] = useRecoilState(toolState);
    const [, setCursor] = useRecoilState(cursorState);

    const onClick = () => {
        setSelectedTool(tool);
        setCursor(cursorStyle);
    };

    return <ToolbarButton active={selectedTool === tool} onClick={onClick} icon={icon} />;
};
