"use client";

import React, { useState } from "react";
import { CanvasElement } from "@/components/canvas/types";
import Editor from "@/components/editor/Editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, Trash2 } from "lucide-react";

interface EditTextElementProps {
    element: CanvasElement;
    onUpdate: (fields: Partial<CanvasElement>) => void;
    onDelete: (id: string) => void;
}

const EditTextElement: React.FC<EditTextElementProps> = ({ element, onUpdate, onDelete }) => {
    const [alignment, setAlignment] = useState<"left" | "center" | "right" | "justify">(
        element.styles?.alignment ?? "left"
    );

    const handleContentChange = (value: string) => {
        console.log("EditTextElement: Content updated for element", element.id);
        onUpdate({ content: value });
    };

    const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("EditTextElement: Font size changed to", e.target.value + "px");
        onUpdate({
            styles: {
                ...element.styles,
                fontSize: `${e.target.value}px`,
            },
        });
    };

    const updateAlignment = (newAlignment: "left" | "center" | "right" | "justify") => {
        console.log("EditTextElement: Alignment changed to", newAlignment);
        setAlignment(newAlignment);
        onUpdate({
            styles: {
                ...element.styles,
                alignment: newAlignment,
            },
        });
    };

    const handleDelete = () => {
        console.log("EditTextElement: Deleting element", element.id);
        onDelete(element.id);
    };

    return (
        <div className="space-y-4 p-4 bg-white shadow-md rounded-lg border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-md font-semibold text-gray-800">Edit Text Element</h3>
                <Button
                    onClick={handleDelete}
                    className="w-10 h-10 flex items-center justify-center border rounded-full bg-red-600 text-white hover:bg-red-700 transition-all shadow-md"
                    title="Delete Element"
                >
                    <Trash2 size={16} />
                </Button>
            </div>

            {/* Text Editor */}
            <Editor
                key={element.id}
                value={element.content}
                onContentChange={handleContentChange}
                styles={{
                    fontSize: element.styles?.fontSize ?? "16px",
                    color: element.styles?.color ?? "#000000",
                }}
            />

            {/* Font Size Input */}
            <div>
                <Label className="text-sm font-medium text-gray-600">Font Size (px)</Label>
                <Input
                    type="number"
                    min={8}
                    max={72}
                    value={parseInt(element.styles?.fontSize || "16", 10) || 16}
                    onChange={handleFontSizeChange}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Alignment Buttons */}
            <div className="flex items-center space-x-2 bg-gray-100 p-3 rounded-full shadow-sm">
                <Button
                    onClick={() => updateAlignment("left")}
                    className={`w-10 h-10 flex items-center justify-center text-gray-800 hover:bg-blue-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${alignment === "left" ? "bg-blue-600 text-white" : ""
                        }`}
                    title="Align Left"
                >
                    <AlignLeft size={16} />
                </Button>
                <Button
                    onClick={() => updateAlignment("center")}
                    className={`w-10 h-10 flex items-center justify-center text-gray-800 hover:bg-blue-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${alignment === "center" ? "bg-blue-600 text-white" : ""
                        }`}
                    title="Align Center"
                >
                    <AlignCenter size={16} />
                </Button>
                <Button
                    onClick={() => updateAlignment("right")}
                    className={`w-10 h-10 flex items-center justify-center text-gray-800 hover:bg-blue-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${alignment === "right" ? "bg-blue-600 text-white" : ""
                        }`}
                    title="Align Right"
                >
                    <AlignRight size={16} />
                </Button>
                <Button
                    onClick={() => updateAlignment("justify")}
                    className={`w-10 h-10 flex items-center justify-center text-gray-800 hover:bg-blue-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${alignment === "justify" ? "bg-blue-600 text-white" : ""
                        }`}
                    title="Justify"
                >
                    <AlignJustify size={16} />
                </Button>
            </div>
        </div>
    );
};

export default EditTextElement;
