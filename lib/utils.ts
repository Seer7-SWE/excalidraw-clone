import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

import { ElementAtPosition, PositionStatusType } from "@/app/_components/canvas";
import { Coordinates, DrawnElementType, Position } from "@/types";
import { RoughCanvas } from "roughjs/bin/canvas";
import getStroke from "perfect-freehand";

export const getSvgPathFromStroke = (stroke: number[][]) => {
    if (!stroke.length) return "";

    const d = stroke.reduce(
        (acc, [x0, y0], i, arr) => {
            const [x1, y1] = arr[(i + 1) % arr.length];
            acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
            return acc;
        },
        ["M", ...stroke[0], "Q"]
    );

    d.push("Z");
    return d.join(" ");
};

export const isWithInElement = (
    x: number,
    y: number,
    element: DrawnElementType,
    context: CanvasRenderingContext2D | null = null
): PositionStatusType => {
    let { shape, x1, x2, y1, y2 } = element;
    const tolerance = 10;

    const textTolerance = 5;

    // Ensure x1/y1 is the top-left corner and x2/y2 is the bottom-right
    if (x1 > x2) [x1, x2] = [x2, x1];
    if (y1 > y2) [y1, y2] = [y2, y1];

    switch (shape) {
        case "line":
        case "arrow":
            const m = (y2 - y1) / (x2 - x1);
            const c = y1 - m * x1;
            const dist = Math.abs(y - (m * x + c));
            return dist < tolerance ? "boundary" : "outside";

        case "rectangle":
            const isInside =
                x > x1 + tolerance &&
                x < x2 - tolerance &&
                y > y1 + tolerance &&
                y < y2 - tolerance;
            const isNearBoundary =
                x >= x1 - tolerance &&
                x <= x2 + tolerance &&
                y >= y1 - tolerance &&
                y <= y2 + tolerance;
            return isInside ? "inside" : isNearBoundary ? "boundary" : "outside";

        case "circle":
            const centerX = (x1 + x2) / 2;
            const centerY = (y1 + y2) / 2;
            const radiusX = Math.abs(x2 - x1) / 2;
            const radiusY = Math.abs(y2 - y1) / 2;
            const ellipseValue =
                Math.pow(x - centerX, 2) / Math.pow(radiusX, 2) +
                Math.pow(y - centerY, 2) / Math.pow(radiusY, 2);
            const outerEllipseValue =
                Math.pow(x - centerX, 2) / Math.pow(radiusX + tolerance, 2) +
                Math.pow(y - centerY, 2) / Math.pow(radiusY + tolerance, 2);
            return outerEllipseValue <= 1 ? (ellipseValue > 1 ? "boundary" : "inside") : "outside";

        case "pencil":
            if (!element.points) return "outside";

            const isOnPath = element.points.some((point, index) => {
                if (!element.points) return "outside";

                if (index === element.points.length - 1) return false;
                const nextPoint = element.points[index + 1];
                const a = { x: point.x, y: point.y };
                const b = { x: nextPoint.x, y: nextPoint.y };
                const c = { x, y };
                const offset =
                    Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2)) -
                    (Math.sqrt(Math.pow(c.x - a.x, 2) + Math.pow(c.y - a.y, 2)) +
                        Math.sqrt(Math.pow(b.x - c.x, 2) + Math.pow(b.y - c.y, 2)));
                return Math.abs(offset) < 15;
            });
            return isOnPath ? "boundary" : "outside";

        case "text":
            if (!element.textValue) return "outside";

            const textWidth = context?.measureText(element.textValue).width;
            const textHeight = (element?.fontSize || 24) * 1.2;

            return x >= x1 - textTolerance &&
                x <= x2 + (textWidth || 0) + textTolerance &&
                y >= y1 - textTolerance &&
                y <= y2 + textHeight + textTolerance
                ? "boundary"
                : "outside";

        default:
            return "outside";
    }
};

export const getElementAtPosition = (
    x: number,
    y: number,
    elements: DrawnElementType[],
    context: CanvasRenderingContext2D | null
): ElementAtPosition => {
    for (let element of elements) {
        const positionStatus = isWithInElement(x, y, element, context);

        if (positionStatus !== "outside") {
            return { positionStatus, element };
        }
    }
    return { positionStatus: "outside", element: null };
};

export const eraseElement = (toErase: DrawnElementType, from: DrawnElementType[]) => {
    const { id: toEraseId } = toErase;
    return from.filter(({ id }) => id !== toEraseId);
};

export const getCoordinates = (
    event: any,
    panOffset: { x: number; y: number },
    scale: number,
    scaleOffset: { x: number; y: number }
) => {
    const clientX = (event.clientX - panOffset.x * scale + scaleOffset.x) / scale;
    const clientY = (event.clientY - panOffset.y * scale + scaleOffset.y) / scale;

    return { clientX, clientY };
};

export const adjustElementCoordinates = (element: DrawnElementType) => {
    const { shape, x1, y1, x2, y2 } = element;
    if (shape === "rectangle") {
        const minX = Math.min(x1, x2);
        const maxX = Math.max(x1, x2);
        const minY = Math.min(y1, y2);
        const maxY = Math.max(y1, y2);
        return { x1: minX, y1: minY, x2: maxX, y2: maxY };
    } else {
        if (x1 < x2 || (x1 === x2 && y1 < y2)) {
            return { x1, y1, x2, y2 };
        } else {
            return { x1: x2, y1: y2, x2: x1, y2: y1 };
        }
    }
};

export const onResize = (
    position: Position,
    clientX: number,
    clientY: number,
    coords: Coordinates
): Coordinates => {
    const { x1, y1, x2, y2 } = coords;

    switch (position) {
        case "tl":
            return { x1: clientX, y1: clientY, x2, y2 };
        case "tr":
            return { x1, y1: clientY, x2: clientX, y2 };
        case "bl":
            return { x1: clientX, y1, x2, y2: clientY };
        case "br":
            return { x1, y1, x2: clientX, y2: clientY };
        case "tm":
            return { x1, y1: clientY, x2, y2 };
        case "lm":
            return { x1: clientX, y1, x2, y2 };
        case "rm":
            return { x1, y1, x2: clientX, y2 };
        case "bm":
            return { x1, y1, x2, y2: clientY };

        default:
            return coords;
    }
};

export const generateUUID = () => {
    // Public Domain/MIT
    var d = new Date().getTime(); //Timestamp
    var d2 =
        (typeof performance !== "undefined" && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = Math.random() * 16; //random number between 0 and 16
        if (d > 0) {
            //Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {
            //Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
};

export const drawOnCanvas = (
    element: DrawnElementType,
    roughCanvas: RoughCanvas,
    context: CanvasRenderingContext2D
) => {
    switch (element.shape) {
        case "circle":
        case "line":
        case "rectangle":
        case "square":
        case "arrow":
            if (element.roughElement !== undefined) {
                roughCanvas.draw(element.roughElement);
            }

            break;

        case "pencil":
            if (element.points) {
                const stroke = getSvgPathFromStroke(
                    getStroke(element.points, element.strokeOptions)
                );

                context.fillStyle = element?.strokeOptions?.color || "";
                context.fill(new Path2D(stroke));
            }

            break;
        case "text":
            if (element.textValue) {
                const fontSize = element.fontSize ? element.fontSize : 18;
                context.textBaseline = "top";
                context.textAlign = element.textAlign || "left";
                context.font = `${fontSize}px ${element.fontFamily}`;

                // TODO: Make this accurate

                // Split the text into lines
                // const lines = element.textValue.split("\n");

                // // // Draw each line separately
                // for (let i = 0; i < lines.length; i++) {
                //     context.fillText(lines[i], element.x1 - 1.5, element.y1 + 5.7 + i * fontSize);
                // }

                context.fillText(element.textValue, element.x1 - 1.5, element.y1 + 5.7);
            }

            break;

        default:
            console.log("element before Error:", element);
            throw new Error(`Shape not recognized ${element.shape}`);
    }
};
