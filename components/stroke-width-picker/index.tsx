import { ToolbarMenuItemWrapper } from "../toolbar-menu/toolbar-menu-item-wrapper";
import { WidthPicker } from "./width-picker";

export const StrokeWidthPicker = () => {
    return (
        <ToolbarMenuItemWrapper title="Stroke width">
            <WidthPicker />
        </ToolbarMenuItemWrapper>
    );
};
