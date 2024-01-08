import { Toolbar } from "@/components/toolbar";
import { Canvas } from "../_components/canvas";
import { ToolbarMenu } from "@/components/toolbar-menu";

export default function Home() {
    return (
        <>
            <Toolbar />
            <ToolbarMenu />
            <Canvas />
        </>
    );
}
