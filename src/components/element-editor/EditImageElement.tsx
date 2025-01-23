"use client";

import React, { useState } from "react";
import { CanvasElement } from "@/components/canvas/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Upload } from "lucide-react";

interface EditImageElementProps {
    element: CanvasElement;
    onUpdate: (fields: Partial<CanvasElement>) => void;
    onDelete: (id: string) => void;
}

const EditImageElement: React.FC<EditImageElementProps> = ({ element, onUpdate, onDelete }) => {
    const [width, setWidth] = useState(element.styles?.width ?? 200);
    const [height, setHeight] = useState(element.styles?.height ?? 150);

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onUpdate({ url: e.target.value });
    };

    const handleDelete = () => {
        onDelete(element.id);
    };

    const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const blobUrl = URL.createObjectURL(file);
        onUpdate({
            url: blobUrl,
            file,
            styles: {
                ...element.styles,
            },
        } as Partial<CanvasElement>);
    };

    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newWidth = parseInt(e.target.value, 10) || 100;
        setWidth(newWidth);
        onUpdate({ styles: { ...element.styles, width: newWidth } });
    };

    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newHeight = parseInt(e.target.value, 10) || 100;
        setHeight(newHeight);
        onUpdate({ styles: { ...element.styles, height: newHeight } });
    };

    return (
        <div className="space-y-6 p-6 bg-white shadow-md rounded-lg border border-gray-200">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-700">Edit Image</h3>
                <Button
                    onClick={handleDelete}
                    className="w-10 h-10 flex items-center justify-center border rounded-full bg-red-600 text-white hover:bg-red-700 transition-all shadow-md"
                    title="Delete Element"
                >
                    <Trash2 size={18} />
                </Button>
            </div>

            {/* Size Inputs */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label className="text-sm font-medium text-gray-600">Width (px)</Label>
                    <Input
                        type="number"
                        value={width}
                        onChange={handleWidthChange}
                        className="rounded-full border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <Label className="text-sm font-medium text-gray-600">Height (px)</Label>
                    <Input
                        type="number"
                        value={height}
                        onChange={handleHeightChange}
                        className="rounded-full border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Image URL Input */}
            <div>
                <Label className="text-sm font-medium text-gray-600">Image URL</Label>
                <Input
                    type="text"
                    value={element.url ?? ""}
                    onChange={handleUrlChange}
                    className="rounded-full border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            {/* Image Upload Section */}
            <div className="mt-4 border-dashed border-2 border-gray-300 p-5 rounded-lg text-center cursor-pointer hover:bg-gray-100 transition-all">
                <label className="block text-gray-500 text-sm font-medium cursor-pointer">
                    <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                    <p className="text-sm">Drag & drop an image file here, or click to upload.</p>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                    />
                </label>
            </div>
        </div>
    );
};

export default EditImageElement;
