"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { selector, useRecoilState } from "recoil";

import { ResolvedOptions } from "roughjs/bin/core";
import { RoughCanvas } from "roughjs/bin/canvas";
import getStroke from "perfect-freehand";
import rough from "roughjs";

import { usePanning } from "@/hooks/use-panning";
import { useShapeDrawing } from "@/hooks/use-shape-drawing";
import { useFreehand } from "@/hooks/use-freehand";

import { getSvgPathFromStroke, getElementAtPosition, eraseElement, getCoordinates } from "@/utils";
import { DrawnElementType, ShapesType } from "@/types";
import {
    cursorState,
    fontFamilyState,
    fontSizeState,
    strokeWidthState,
    textAlignState,
    toolState,
} from "@/state";
import { useUndoRedo } from "@/hooks/use-undo-redo";
import { useZoom } from "@/hooks/use-zoom";
import { Zoom } from "@/components/zoom";
import { UndoRedo } from "@/components/undo-redo";
import { cn } from "@/lib/utils";
import { SelectionBox } from "@/components/selection-box";

export type PositionStatusType = "inside" | "outside" | "boundary";

export type ElementAtPosition =
    | { positionStatus: "inside" | "boundary"; element: DrawnElementType }
    | { positionStatus: "outside"; element: null };

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

                // // Draw each line separately
                // for (let i = 0; i < lines.length; i++) {
                //     context.fillText(lines[i], element.x1 - 1.5, element.y1 + 5.7 + i * fontSize);
                // }

                context.fillText(element.textValue, element.x1 - 1.5, element.y1 + 5.7);
            }

            break;

        default:
            throw new Error(`Shape not recognised ${element.shape}`);
    }
};

export const Canvas = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const prevSelectedItem = useRef<DrawnElementType | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
    const [roughCanvas, setRoughCanvas] = useState<RoughCanvas | null>(null);
    const [selectedItem, setSelectedItem] = useState<
        (DrawnElementType & { offsetsX?: number[]; offsetsY?: number[] }) | null
    >(null);

    const [scale, setScale] = useState(1);
    const [scaleOffset, setScaleOffset] = useState({ x: 0, y: 0 });

    const [isWriting, setIsWriting] = useState<boolean>(false);
    const [textareaPosition, setTextareaPosition] = useState<{ x: number; y: number }>({
        x: 0,
        y: 0,
    });

    const [isMouseDown, setIsMouseDown] = useState(false);

    const [selectedTool, setSelectedTool] = useRecoilState(toolState);
    const [strokeWidth, ___] = useRecoilState(strokeWidthState);
    const [cursorStyle, setCursorStyle] = useRecoilState(cursorState);

    const [fontFamily, setFontFam] = useRecoilState(fontFamilyState);
    const [fontSize, setFontSize] = useRecoilState(fontSizeState);

    const { panning, doPan, startPanning, stopPanning, panOffset } = usePanning(canvasRef);
    const { startDrawingShapes, stopDrawingShapes, drawShapes, isDrawingShapes } =
        useShapeDrawing(roughCanvas);

    const { drawFreehand, isDrawing, startFreehandDrawing, stopFreehandDrawing } = useFreehand();

    const { undo, redo, push, state: drawnElements, canUndo, canRedo } = useUndoRedo([]);

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
            push(drawnElementsCopy, true);
        }
    };

    const handleShapeDraw = (shapeType: ShapesType, event: React.MouseEvent) => {
        const { clientX, clientY } = getCoordinates(event, panOffset, scale, scaleOffset);
        const newId = drawnElements.length;

        const shape = startDrawingShapes(newId, clientX, clientY, clientX, clientY, shapeType);
        if (shape) {
            push([...drawnElements, shape]);
        }
    };

    const drawText = () => {
        if (textareaRef.current) {
            const textValue = textareaRef.current.value;

            const { clientX, clientY } = getCoordinates(
                { clientX: textareaPosition.x, clientY: textareaPosition.y },
                panOffset,
                scale,
                scaleOffset
            );

            let textElement: DrawnElementType = {
                id: drawnElements.length,
                x1: clientX,
                y1: clientY,
                x2: clientX,
                y2: clientY,
                shape: "text",
                roughElement: undefined,
                textValue,
                fontSize,
                fontFamily,
            };

            if (prevSelectedItem.current) {
                textElement.id = prevSelectedItem.current.id;
                textElement.x1 = prevSelectedItem.current.x1;
                textElement.y1 = prevSelectedItem.current.y1;
                textElement.x2 = prevSelectedItem.current.x2;
                textElement.y2 = prevSelectedItem.current.y2;

                const drawnElementsCopy = [...drawnElements];
                if (textElement) {
                    drawnElementsCopy[prevSelectedItem.current.id] = textElement;
                    push(drawnElementsCopy);
                }
            } else {
                push([...drawnElements, textElement]);
            }
        }
    };

    const handleBlur = () => {
        drawText();

        setIsWriting(false);
        setTextareaPosition({ x: 0, y: 0 });
    };

    const handleWritingText = (event: React.MouseEvent) => {
        setIsWriting(true);
        // If there is already a textelement where clicking
        const { positionStatus, element } = getElementAtPosition(
            event.clientX,
            event.clientY,
            drawnElements,
            context
        );

        if (positionStatus === "boundary" && element) {
            // select the previous element!!
            prevSelectedItem.current = element;
        } else {
            prevSelectedItem.current = null;
        }

        setTextareaPosition({ x: event.clientX, y: event.clientY });
    };

    const handleMouseDown = {
        pan: startPanning,
        select: (event: React.MouseEvent) => {
            const { clientX, clientY } = getCoordinates(event, panOffset, scale, scaleOffset);

            const { positionStatus, element } = getElementAtPosition(
                clientX,
                clientY,
                drawnElements,
                context
            );

            if (element?.shape === "pencil") {
                if (!element.points) return;

                const offsetsX = element.points.map((point) => clientX - point.x);
                const offsetsY = element.points.map((point) => clientY - point.y);

                setSelectedItem({ ...element, offsetsX, offsetsY });
            } else if (positionStatus === "boundary" && roughCanvas) {
                // Select the item
                const offsetX = clientX - element.x1;
                const offsetY = clientY - element.y1;

                // Implement this
                // const newItems = highlightSelectedItem(element, roughCanvas, drawnElements);
                // setDrawnElements(newItems);

                setSelectedItem({ ...element, offsetX, offsetY });
            } else if (positionStatus === "outside" && !element && selectedItem) {
                setSelectedItem(null);
            }

            prevSelectedItem.current = element;
            push(drawnElements);
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

            const elementToErase = getElementAtPosition(clientX, clientY, drawnElements, context);
            if (elementToErase.positionStatus === "boundary") {
                const updatedDrawnElements = eraseElement(elementToErase.element, drawnElements);
                // setDrawnElements(updatedDrawnElements);
                push(updatedDrawnElements);
            }
        },
        rectangle: (event: React.MouseEvent) => handleShapeDraw("rectangle", event),
        circle: (event: React.MouseEvent) => handleShapeDraw("circle", event),
        line: (event: React.MouseEvent) => handleShapeDraw("line", event),
        text: (event: React.MouseEvent) => handleWritingText(event),
        arrow: (event: React.MouseEvent) => handleShapeDraw("arrow", event),
    };

    const onMouseDown = (event: React.MouseEvent) => {
        setIsMouseDown(true);

        setTimeout(() => {
            // Using settimeout to make blur event fires before this
            event.preventDefault();

            if (isWriting && selectedTool !== "select") return; // If already writing

            handleMouseDown[selectedTool](event);
        }, 0);
    };

    const onMouseUp = (event: React.MouseEvent) => {
        setIsMouseDown(false);

        if (cursorStyle === "grab") {
            stopPanning();
        } else if (isDrawing) {
            stopFreehandDrawing();
        } else if (isDrawingShapes) {
            stopDrawingShapes();

            // Set last drawn shape as selected element
            const lastElement = drawnElements[drawnElements.length - 1];
            setSelectedItem(lastElement);
        }
        // else if (selectedTool === "select" && selectedItem) {
        //     setSelectedItem(null);
        // }
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
        } else if (isMouseDown && selectedItem) {
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
                textValue,
                fontFamily,
                fontSize,
            } = selectedItem;

            if (shape === "pencil") {
                if (!selectedItem.points) return;
                const newPoints = selectedItem.points.map((_, idx) => {
                    if (selectedItem.offsetsX && selectedItem.offsetsY) {
                        return {
                            x: clientX - selectedItem.offsetsX[idx],
                            y: clientY - selectedItem.offsetsY[idx],
                        };
                    }
                    return { x: clientX, y: clientY };
                });

                const drawnElementsCopy = [...drawnElements];
                drawnElementsCopy[selectedItem.id] = {
                    ...drawnElementsCopy[selectedItem.id],
                    points: newPoints,
                };

                push(drawnElementsCopy, true);
            } else if (shape === "text") {
                const updatedTextElement = {
                    ...selectedItem,
                    x1: clientX - offsetX,
                    x2: clientX,
                    y1: clientY - offsetY,
                    y2: clientY,
                };

                const drawnElementsCopy = [...drawnElements];
                drawnElementsCopy[selectedItem.id] = updatedTextElement;
                push(drawnElementsCopy, true);
            } else {
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
        }
    };

    const onUndo = () => {
        undo();
    };

    const onRedo = () => {
        redo();
    };

    const zoomIn = () => {
        if (scale < 2) {
            console.log("zoom in");
            setScale((prev) => prev + 0.1);
        }
    };

    const zoomOut = () => {
        if (scale > 0.5) {
            console.log("zoom out");
            setScale((prev) => prev - 0.1);
        }
    };

    const resetZoom = () => {
        setScale(1);
    };

    useLayoutEffect(() => {
        const canv = document.getElementById("canvas") as HTMLCanvasElement;
        const ctx = canv.getContext("2d");

        canv.width = window.innerWidth;
        canv.height = window.innerHeight;

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

    useEffect(() => {
        if (selectedTool === "text") {
            textareaRef?.current?.focus();
        }

        if (selectedItem) {
            setSelectedItem(null);
        }
    }, [selectedTool]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();

            textareaRef.current.value = prevSelectedItem.current?.textValue || "";
        }
    }, [isWriting]);

    return (
        <>
            <canvas
                id="canvas"
                ref={canvasRef}
                className="w-screen h-screen bg-white absolute z-[1] select-none"
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
            />

            {selectedItem && (
                <SelectionBox
                    selectedElementId={selectedItem.id}
                    drawnElements={drawnElements}
                    panOffset={panOffset}
                />
            )}

            {isWriting ? (
                <textarea
                    ref={textareaRef}
                    className="fixed z-10 bg-transparent outline-none"
                    style={{
                        top: prevSelectedItem?.current?.y1
                            ? prevSelectedItem.current.y1 + 2
                            : textareaPosition.y,
                        left: prevSelectedItem?.current?.x1
                            ? prevSelectedItem.current.x1 - 1
                            : textareaPosition.x,
                        resize: "none",
                        height: "auto",
                        overflow: "hidden",
                        fontSize,
                        fontFamily,
                    }}
                    onBlur={handleBlur}

                    // For infinite expanding effect on textarea
                    // onInput={handleInput}

                    // const handleInput = (e) => {
                    //     e.target.style.height = 'auto';
                    //     e.target.style.height = (e.target.scrollHeight) + 'px';
                    // };
                />
            ) : null}

            <div className="absolute z-50 bottom-4 left-4 space-x-4 flex items-center">
                <Zoom scale={scale} zoomIn={zoomIn} zoomOut={zoomOut} resetZoom={resetZoom} />
                <UndoRedo canRedo={canRedo} canUndo={canUndo} onUndo={onUndo} onRedo={onRedo} />
            </div>
        </>
    );
};
