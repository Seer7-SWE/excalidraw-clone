"use client";

import { Toolbar } from "@/components/toolbar";
import { ToolbarMenu } from "@/components/toolbar-menu";
import { Canvas } from "./canvas";
// import { generateUUID } from "@/lib/utils";
// import { useParams, useRouter } from "next/navigation";

export const CanvasWrapper = () => {
    // const router = useRouter();

    // TODO reimplement
    // const startCollab = () => {
    //     const uuid = generateUUID();
    //     router.push(`?roomId=${uuid}`, {
    //         shallow: true,
    //     });
    // };

    return (
        <div className="w-full h-full relative">
            <Toolbar />
            <ToolbarMenu />
            <Canvas />
        </div>
    );
};
