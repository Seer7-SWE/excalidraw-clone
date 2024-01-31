import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Hint } from "../ui/hint";

interface ToolbarButtonProps {
    onClick: () => void;
    icon: JSX.Element;
    active: boolean;
    label: string;
}
export const ToolbarButton = ({ onClick, icon, active, label }: ToolbarButtonProps) => {
    return (
        <Hint label={label} side="bottom" align="center" sideOffset={10}>
            <Button
                className={cn(
                    active ? "bg-black/20 hover:bg-black/20 " : "",
                    "active:border active:border-black"
                )}
                variant={"ghost"}
                size={"tool"}
                onClick={onClick}
            >
                {icon}
            </Button>
        </Hint>
    );
};
