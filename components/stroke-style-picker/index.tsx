import { ToolbarMenuItemWrapper } from "../toolbar-menu/toolbar-menu-item-wrapper";
import { StylePicker } from "./style-picker";

export const StrokeStylePicker = () => {
    return (
        <ToolbarMenuItemWrapper title="Stroke style">
            <StylePicker />
        </ToolbarMenuItemWrapper>
    );
};
