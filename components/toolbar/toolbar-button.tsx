import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface ToolbarButtonProps {
    onClick: () => void;
    icon: JSX.Element;
    active: boolean;
}
export const ToolbarButton = ({ onClick, icon, active }: ToolbarButtonProps) => {
    return (
        <Button
            className={cn(active ? "bg-black/20 hover:bg-black/20" : "")}
            variant={"ghost"}
            size={"tool"}
            onClick={onClick}
        >
            {icon}
        </Button>
    );
};
