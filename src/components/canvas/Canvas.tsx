"use client";

import React from "react";
import DraggableElement from "./DraggableElement";
import { CanvasElement } from "./types";
import { Resizable } from "re-resizable";

interface CanvasProps {
    elements: CanvasElement[];
    selectedElementId: string | null;
    onSelectElement: (id: string) => void;
    onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
}

const Canvas: React.FC<CanvasProps> = ({
    elements,
    selectedElementId,
    onSelectElement,
    onUpdateElement,
}) => {
    return (
        <div className="relative h-full w-full space-y-2 p-4">
            {elements.map((el) => {
                const isSelected = el.id === selectedElementId;
                const position = {
                    x: el.styles?.left || 0,
                    y: el.styles?.top || 0,
                };

                return (
                    <DraggableElement
                        key={el.id}
                        position={position}
                        onPositionChange={(newPos) => {
                            onUpdateElement(el.id, {
                                styles: {
                                    ...el.styles,
                                    left: newPos.x,
                                    top: newPos.y,
                                },
                            });
                        }}
                    >
                        {el.type === "text" ? (
                            <div
                                style={{
                                    position: 'absolute', // Add this
                                    left: el.styles?.left ?? 0, // Add this
                                    top: el.styles?.top ?? 0, // Add this
                                    fontSize: el.styles?.fontSize ?? "16px",
                                    color: el.styles?.color ?? "#000000",
                                    textAlign: el.styles?.alignment ?? "left",
                                    border: isSelected ? "2px solid #3B82F6" : "1px solid transparent",
                                    padding: "8px",
                                    cursor: "pointer",
                                    width: 'fit-content' // Ensure text doesn't overflow
                                }}
                                onClick={() => onSelectElement(el.id)}
                                dangerouslySetInnerHTML={{ __html: el.content ?? "" }}
                            />
                        ) : el.type === "image" ? (
                            <Resizable
                                size={{
                                    width: el.styles?.width ?? 200,
                                    height: el.styles?.height ?? 150,
                                }}
                                onResizeStop={(e, direction, ref) => {
                                    const newWidth = ref.offsetWidth;
                                    const newHeight = ref.offsetHeight;
                                    onUpdateElement(el.id, {
                                        styles: { ...el.styles, width: newWidth, height: newHeight },
                                    });
                                }}
                                className={`relative ${isSelected ? "border-2 border-blue-500" : "border-transparent"}`}
                            >
                                <img
                                    src={el.url}
                                    alt="Canvas Image"
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => onSelectElement(el.id)}
                                />
                            </Resizable>
                        ) : null}
                    </DraggableElement>
                );
            })}
        </div>
    );
};

export default Canvas;