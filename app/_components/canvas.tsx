"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";

import { ResolvedOptions } from "roughjs/bin/core";
import { RoughCanvas } from "roughjs/bin/canvas";
import getStroke from "perfect-freehand";
import rough from "roughjs";

import { usePanning } from "@/hooks/use-panning";
import { useShapeDrawing } from "@/hooks/use-shape-drawing";
import { useFreehand } from "@/hooks/use-freehand";

import { getSvgPathFromStroke, getElementAtPosition, eraseElement, getCoordinates } from "@/utils";
import { DrawnElementType, ShapesType } from "@/types";
import { cursorState, strokeWidthState, toolState } from "@/state";
import { Button } from "@/components/ui/button";
import { Redo2, Undo2, ZoomIn, ZoomOut } from "lucide-react";
import { useUndoRedo } from "@/hooks/use-undo-redo";
import { useZoom } from "@/hooks/use-zoom";

export type PositionStatusType = "inside" | "outside" | "boundary";

export type ElementAtPosition =
    | { positionStatus: "inside" | "boundary"; element: DrawnElementType }
    | { positionStatus: "outside"; element: null };

// const highlightSelectedItem = (
//     selectedItem: DrawnElementType,
//     roughCanvas: RoughCanvas,
//     // previouslySelectedItem?: DrawnElementType,
//     allItems: DrawnElementType[]
// ) => {
//     // if (previouslySelectedItem) {
//     //     const { x1: prevX1, y1: prevY1, x2: prevX2, y2: prevY2 } = previouslySelectedItem;
//     //     context.clearRect(prevX1 - 5, prevY1 - 5, prevX2 - prevX1 + 10, prevY2 - prevY1 + 10);
//     // }
//     const { x1, y1, x2, y2 } = selectedItem;

//     const newX1 = x1 - 10;
//     const newY1 = y1 - 10;
//     const newX2 = x2 - 10;
//     const newY2 = y2 - 10;

//     const rect = roughCanvas.generator.rectangle(newX1, newY1, newX2, newY2, {
//         stroke: "#000",
//         strokeWidth: 3,
//     });

//     const highlightedItem: DrawnElementType = {
//         id: allItems.length,
//         x1: newX1,
//         y1: newY1,
//         x2: newX2,
//         y2: newY2,
//         roughElement: rect,
//         shape: "rectangle",
//         isSelected: true,
//     };

//     allItems.push(highlightedItem);
//     return allItems;
// };

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
        default:
            throw new Error(`Shape not recognised ${element.shape}`);
    }
};

export const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const prevSelectedItem = useRef<DrawnElementType | null>(null);

    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
    const [roughCanvas, setRoughCanvas] = useState<RoughCanvas | null>(null);

    // const [drawnElements, setDrawnElements] = useState<DrawnElementType[]>([]);
    const [selectedItem, setSelectedItem] = useState<DrawnElementType | null>(null);

    const [selectedTool, setSelectedTool] = useRecoilState(toolState);
    const [strokeWidth, ___] = useRecoilState(strokeWidthState);
    const [cursorStyle, _] = useRecoilState(cursorState);

    const { panning, doPan, startPanning, stopPanning, panOffset } = usePanning(canvasRef);
    const { startDrawingShapes, stopDrawingShapes, drawShapes, isDrawingShapes } =
        useShapeDrawing(roughCanvas);

    const { drawFreehand, isDrawing, startFreehandDrawing, stopFreehandDrawing } = useFreehand();

    const { undo, redo, push, state: drawnElements, canUndo, canRedo } = useUndoRedo([]);
    const { zoomIn, zoomOut, scale, scaleOffset, setScaleOffset, resetZoom } = useZoom();

    const updateElementPosition = (
        id: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        shape: ShapesType,
        options?: ResolvedOptions
    ) => {
        const updatedShape = drawShapes(id, x1, y1, x2, y2, shape, options);

        const drawnElementsCopy = [...drawnElements];
        if (updatedShape) {
            drawnElementsCopy[id] = updatedShape;
            // setDrawnElements(drawnElementsCopy);
            push(drawnElementsCopy, true);
        }
    };

    const handleShapeDraw = (shapeType: ShapesType, event: React.MouseEvent) => {
        const { clientX, clientY } = getCoordinates(event, panOffset, scale, scaleOffset);
        const newId = drawnElements.length;

        const shape = startDrawingShapes(newId, clientX, clientY, clientX, clientY, shapeType);
        if (shape) {
            // setDrawnElements((prev) => [...prev, shape]);
            push([...drawnElements, shape]);
        }
    };

    const handleMouseDown = {
        pan: startPanning,
        select: (event: React.MouseEvent) => {
            const { clientX, clientY } = getCoordinates(event, panOffset, scale, scaleOffset);

            const { positionStatus, element } = getElementAtPosition(
                clientX,
                clientY,
                drawnElements
            );

            console.log({ positionStatus, element });

            if (positionStatus === "boundary" && roughCanvas) {
                // Select the item
                const offsetX = clientX - element.x1;
                const offsetY = clientY - element.y1;

                // Implement this
                // const newItems = highlightSelectedItem(element, roughCanvas, drawnElements);
                // setDrawnElements(newItems);

                setSelectedItem({ ...element, offsetX, offsetY });
                prevSelectedItem.current = element;
                push(drawnElements);
            }
        },
        draw: (event: React.MouseEvent) => {
            const { clientX, clientY } = getCoordinates(event, panOffset, scale, scaleOffset);
            const newId = drawnElements.length;

            const pencilDraw = drawFreehand(newId, clientX, clientY);

            const pencilDrawnElement: DrawnElementType = {
                ...pencilDraw,
                roughElement: undefined,
                x1: clientX,
                x2: clientX,
                y1: clientY,
                y2: clientY,
            };

            startFreehandDrawing();
            // setDrawnElements((prev) => [...prev, pencilDrawnElement]);
            push([...drawnElements, pencilDrawnElement]);
        },
        erase: (event: React.MouseEvent) => {
            const { clientX, clientY } = getCoordinates(event, panOffset, scale, scaleOffset);

            const elementToErase = getElementAtPosition(clientX, clientY, drawnElements);
            if (elementToErase.positionStatus === "boundary") {
                const updatedDrawnElements = eraseElement(elementToErase.element, drawnElements);
                // setDrawnElements(updatedDrawnElements);
                push(updatedDrawnElements);
            }
        },
        rectangle: (event: React.MouseEvent) => handleShapeDraw("rectangle", event),
        circle: (event: React.MouseEvent) => handleShapeDraw("circle", event),
        line: (event: React.MouseEvent) => handleShapeDraw("line", event),
    };

    const onMouseDown = (event: React.MouseEvent) => {
        event.preventDefault();
        handleMouseDown[selectedTool](event);
    };

    const onMouseUp = (event: React.MouseEvent) => {
        if (cursorStyle === "grab") {
            stopPanning();
        } else if (isDrawing) {
            stopFreehandDrawing();
        } else if (isDrawingShapes) {
            stopDrawingShapes();
        } else if (selectedTool === "select" && selectedItem) {
            setSelectedItem(null);
        }
    };

    const onMouseMove = (event: React.MouseEvent) => {
        // Make it like onMouseDown
        const { clientX, clientY } = getCoordinates(event, panOffset, scale, scaleOffset);
        if (drawnElements.length < 0) return;

        if (isDrawing) {
            const index = drawnElements.length - 1;
            const { points } = drawnElements[index];

            if (!points) return;

            const updatedShape: DrawnElementType = {
                ...drawnElements[index],
                points: [...points, { x: clientX, y: clientY }],
            };

            const drawnElementsCopy = [...drawnElements];
            if (updatedShape) {
                drawnElementsCopy[index] = updatedShape;
                // setDrawnElements(drawnElementsCopy);
                push(drawnElementsCopy, true);
            }
        } else if (panning) {
            doPan(event);
        } else if (isDrawingShapes) {
            const index = drawnElements.length - 1;
            const { x1, y1, shape } = drawnElements[index];
            const updatedShape = drawShapes(index, x1, y1, clientX, clientY, shape);

            const drawnElementsCopy = [...drawnElements];
            if (updatedShape) {
                drawnElementsCopy[index] = updatedShape;
                // setDrawnElements(drawnElementsCopy);
                push(drawnElementsCopy, true);
            }
        } else if (selectedTool === "select" && selectedItem) {
            //  Moving an already drawn element
            const {
                id,
                x2,
                y2,
                shape,
                x1,
                y1,
                offsetX = 0,
                offsetY = 0,
                roughElement,
            } = selectedItem;

            const width = x2 - x1;
            const height = y2 - y1;

            const newX1 = clientX - offsetX;
            const newY1 = clientY - offsetY;

            updateElementPosition(
                id,
                newX1,
                newY1,
                newX1 + width,
                newY1 + height,
                shape,
                roughElement?.options
            );
        }
    };

    const onUndo = () => {
        undo();
    };

    const onRedo = () => {
        redo();
    };

    useLayoutEffect(() => {
        const canv = document.getElementById("canvas") as HTMLCanvasElement;
        const ctx = canv.getContext("2d");

        let roughCanv = rough.canvas(canv);
        setRoughCanvas(roughCanv);

        if (ctx) {
            ctx.clearRect(0, 0, canv.width, canv.height);

            const scaledWidth = canv.width * scale;
            const scaledHeight = canv.height * scale;

            const scaledOffsetX = (scaledWidth - canv.width) / 2;
            const scaledOffsetY = (scaledHeight - canv.height) / 2;
            setScaleOffset({ x: scaledOffsetX, y: scaledOffsetY });

            ctx.save();
            ctx.translate(panOffset.x * scale - scaledOffsetX, panOffset.y * scale - scaledOffsetY);
            ctx.scale(scale, scale);

            drawnElements.forEach((element) => {
                drawOnCanvas(element, roughCanv, ctx);
            });

            ctx.restore();
        }
    }, [panOffset.x, panOffset.y, drawnElements, strokeWidth, scale, setScaleOffset]);

    useEffect(() => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;

            setContext(canvas.getContext("2d"));
        }

        const resizeListener = () => {
            if (canvasRef.current && context) {
                let tempCanvasImage = canvasRef.current.toDataURL();

                const canvas = canvasRef.current;
                let oldWidth = canvas.width;
                let oldHeight = canvas.height;
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;

                let img = new Image();
                img.src = tempCanvasImage;
                img.onload = function () {
                    context.save();
                    context.scale(canvas.width / oldWidth, canvas.height / oldHeight);
                    context.drawImage(img, 0, 0);
                    context.restore();
                };
            }
        };

        window.addEventListener("resize", resizeListener);

        return () => {
            window.removeEventListener("resize", resizeListener);
        };
    }, [context]);

    useEffect(() => {
        document.body.setAttribute("cursor-style", cursorStyle);
    }, [cursorStyle]);

    return (
        <>
            <canvas
                id="canvas"
                ref={canvasRef}
                className="w-full h-full bg-white absolute z-[1]"
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
                width={window.innerWidth}
                height={window.innerHeight}
            />

            <div className="absolute z-50 bottom-4 left-4 space-x-4 flex items-center">
                <div className="flex items-center space-x-2">
                    <Button
                        onClick={zoomIn}
                        className="bg-neutral-200"
                        size="sm"
                        variant={"outline"}
                    >
                        <ZoomIn className="w-4 h-4" />
                    </Button>
                    <p className="text-sm cursor-pointer" onClick={resetZoom}>
                        {new Intl.NumberFormat("en-GB", { style: "percent" }).format(scale)}
                    </p>
                    <Button
                        onClick={zoomOut}
                        className="bg-neutral-200"
                        size="sm"
                        variant={"outline"}
                    >
                        <ZoomOut className="w-4 h-4" />
                    </Button>
                </div>

                <div>
                    <Button
                        disabled={!canUndo}
                        onClick={onUndo}
                        className="bg-neutral-200"
                        size="sm"
                        variant={"outline"}
                    >
                        <Undo2 className="w-4 h-4" />
                    </Button>
                    <Button
                        disabled={!canRedo}
                        onClick={onRedo}
                        className="bg-neutral-200"
                        size="sm"
                        variant={"outline"}
                    >
                        <Redo2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </>
    );
};
