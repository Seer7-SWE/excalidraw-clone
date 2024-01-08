import { Picker } from "./picker";
import { ToolbarMenuItemWrapper } from "../toolbar-menu/toolbar-menu-item-wrapper";

export const ColorPicker = () => {
    return (
        <ToolbarMenuItemWrapper title="Stroke">
            <Picker />
        </ToolbarMenuItemWrapper>
    );
};
