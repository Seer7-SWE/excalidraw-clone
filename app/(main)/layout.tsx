"use client";

import React from "react";
import { RecoilRoot } from "recoil";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <RecoilRoot>
            <div id="main" className="w-full h-full relative overflow-hidden">
                {children}
            </div>
        </RecoilRoot>
    );
};

export default MainLayout;
