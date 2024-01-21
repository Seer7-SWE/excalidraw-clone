"use client";

import { WidthItem } from "@/components/width-item";
import { fontFamilyState } from "@/state";
import { FontFamilyType } from "@/types";
import { CaseUpper, Code, Pencil } from "lucide-react";
import { useRecoilState } from "recoil";

export const FontFamilyPicker = () => {
    const [fontFamily, setFontFamily] = useRecoilState<FontFamilyType>(fontFamilyState);

    const styles = [
        {
            value: "__Epilogue_063c31, __Epilogue_Fallback_063c31" as FontFamilyType,
            icon: <Pencil className="w-4 h-4" />,
            active: fontFamily === "__Epilogue_063c31, __Epilogue_Fallback_063c31",
        },
        {
            value: "__Montserrat_cce811, __Montserrat_Fallback_cce811" as FontFamilyType,
            icon: <CaseUpper className="w-4 h-4" />,
            active: fontFamily === "__Montserrat_cce811, __Montserrat_Fallback_cce811",
        },
        {
            value: "__Roboto_Mono_829659, __Roboto_Mono_Fallback_829659" as FontFamilyType,
            icon: <Code className="w-4 h-4" />,
            active: fontFamily === "__Roboto_Mono_829659, __Roboto_Mono_Fallback_829659",
        },
    ];

    const onClick = (family: FontFamilyType) => {
        setFontFamily(family);
    };

    return (
        <div className="flex items-center gap-2 py-1">
            {styles.map((style) => (
                <WidthItem<FontFamilyType> key={style.value} data={style} onClick={onClick} />
            ))}
        </div>
    );
};
