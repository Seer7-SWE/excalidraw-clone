import type { Metadata } from "next";
import { Inter, Montserrat, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

const montserrat = Montserrat({ subsets: ["latin"] });
const robotoMono = Roboto_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Excalidraw clone",
    description: "Excalidraw clone",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body
                className={cn(
                    "relative",
                    inter.className,
                    montserrat.className,
                    robotoMono.className
                )}
            >
                {children}
            </body>
        </html>
    );
}
