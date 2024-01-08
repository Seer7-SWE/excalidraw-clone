import { ToolbarMenuItemWrapper } from "../toolbar-menu/toolbar-menu-item-wrapper";
import { BgPicker } from "./picker";

export const BackgroundPicker = () => {
    return (
        <ToolbarMenuItemWrapper title="Background">
            <BgPicker />
        </ToolbarMenuItemWrapper>
    );
};
