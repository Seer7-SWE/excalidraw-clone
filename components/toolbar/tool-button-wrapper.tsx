"use client";

import { useRecoilState } from "recoil";
import { toolCursorState } from "@/state";
import { ToolbarButton } from "./toolbar-button";
import { CursorStateType, ToolType } from "@/types";

interface ToolButtonWrapperProps {
    tool: ToolType;
    icon: JSX.Element;
    cursorStyle: CursorStateType;
}

export const ToolButtonWrapper = ({ tool, icon, cursorStyle }: ToolButtonWrapperProps) => {
    const [toolCursor, setToolCursor] = useRecoilState(toolCursorState);

    const onClick = () => {
        setToolCursor({ tool, cursor: cursorStyle });
    };

    return (
        <ToolbarButton
            active={toolCursor.tool === tool}
            onClick={onClick}
            icon={icon}
            label={tool}
        />
    );
};
