import { cn } from "@/lib/utils";

export const Separator = ({ className }: { className: string }) => {
    return <div className={cn("bg-gray-300 mx-1", className)} />;
};
