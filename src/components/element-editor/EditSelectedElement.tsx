"use client";

import React from "react";
import { CanvasElement } from "@/components/canvas/types";
import EditTextElement from "./EditTextElement";
import EditImageElement from "./EditImageElement";

interface EditSelectedElementProps {
    element?: CanvasElement;
    onUpdate: (fields: Partial<CanvasElement>) => void;
    onDelete: (id: string) => void;
}

const EditSelectedElement: React.FC<EditSelectedElementProps> = ({ element, onUpdate, onDelete }) => {
    if (!element) {
        console.log("EditSelectedElement: No element selected.");
        return <div className="p-4 text-gray-500">Select an element to edit.</div>;
    }

    if (element.type === "text") {
        return <EditTextElement element={element} onUpdate={onUpdate} onDelete={onDelete} />;
    } else if (element.type === "image") {
        return <EditImageElement element={element} onUpdate={onUpdate} onDelete={onDelete} />;
    }

    return <div>Unknown element type.</div>;
};

export default EditSelectedElement;
