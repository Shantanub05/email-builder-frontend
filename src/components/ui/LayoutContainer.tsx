// src/app/layout.tsx
"use client";

import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import CustomSidebar from "@/components/sidebar/CustomSidebar";
import TopBar from "@/components/topbar/TopBar";
import Canvas from "@/components/canvas/Canvas";
import EditSelectedElement from "@/components/element-editor/EditSelectedElement";
import { Card } from "@/components/ui/card";
import { CanvasElement } from "@/components/canvas/types";
import { useTemplateManagement } from "@/hooks/useTemplateManagement";
import { generateHTMLFromCanvas } from '@/utils/generateHTML'
import { downloadTemplate } from "@/utils/downloadTemplate";

interface LayoutContainerProps {
    children?: React.ReactNode;
}

export default function LayoutContainer({ children }: LayoutContainerProps) {
    const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const {
        templates,
        templateName,
        setTemplateName,
        loadTemplate: loadTemplateFromHook,
        saveTemplate
    } = useTemplateManagement();

    const selectedElement = canvasElements.find((el) => el.id === selectedId) || null;

    const handleAddText = () => {
        const id = crypto.randomUUID();
        setCanvasElements((prev) => [
            ...prev,
            {
                id,
                type: "text",
                content: "<p>New Text</p>",
                styles: {
                    left: 0,  // Add required position
                    top: 0,   // Add required position
                    fontSize: "16px",
                    color: "#000000",
                    alignment: "left"  // Add default alignment
                },
            },
        ]);
        setSelectedId(id);
    };

    const handleAddImage = () => {
        const id = crypto.randomUUID();
        setCanvasElements((prev) => [
            ...prev,
            {
                id,
                type: "image",
                url: "https://picsum.photos/200",
                styles: {
                    left: 0,     // Required
                    top: 0,      // Required
                    width: 200,  // Default width
                    height: 150  // Default height
                }
            },
        ]);
        setSelectedId(id);
    };

    const handleUpdateElement = (id: string, updates: Partial<CanvasElement>) => {
        setCanvasElements((prev) =>
            prev.map((el) => (el.id === id ? { ...el, ...updates } : el))
        );
    };

    const handleDeleteElement = (id: string) => {
        setCanvasElements((prev) => prev.filter((el) => el.id !== id));
        if (selectedId === id) setSelectedId(null);
    };

    const handleDownloadTemplate = () => {
        if (!templateName) {
            alert("Please enter a template name before downloading.");
            return;
        }

        const htmlContent = generateHTMLFromCanvas(canvasElements);
        downloadTemplate(templateName, htmlContent);
    };

    const handleLoadTemplate = (templateId: string) => {
        loadTemplateFromHook(templateId, setCanvasElements);
    };

    const handleSaveTemplate = () => {
        saveTemplate(canvasElements, generateHTMLFromCanvas);
    };

    const handleResetTemplate = () => {
        setCanvasElements([]);
        setSelectedId(null);
    };

    return (
        <SidebarProvider defaultOpen={true}>
            <div className="h-screen w-screen flex bg-gray-50 overflow-hidden">
                <CustomSidebar
                    onLoadTemplate={handleLoadTemplate}
                    templates={templates}
                />

                <main>{children}</main>

                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-2 flex items-center gap-2">
                        <input
                            type="text"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            placeholder="Enter template name"
                            className="border p-1 rounded"
                        />
                    </div>

                    <div className="p-2">
                        <Card className="border border-gray-200 rounded-lg shadow-sm">
                            <TopBar
                                onAddText={handleAddText}
                                onAddImage={handleAddImage}
                                onSaveTemplate={handleSaveTemplate}
                                onResetTemplate={handleResetTemplate}
                                onDownloadTemplate={handleDownloadTemplate}
                            />
                        </Card>
                    </div>

                    <div className="flex-1 flex gap-2 px-2 pb-2 overflow-hidden">
                        <div className="flex-1 overflow-auto">
                            <Card className="w-full h-full p-4 border border-gray-200 rounded-lg shadow bg-white">
                                <Canvas
                                    elements={canvasElements}
                                    selectedElementId={selectedId}
                                    onSelectElement={(id) => setSelectedId(id)}
                                    onUpdateElement={handleUpdateElement}
                                />
                            </Card>
                        </div>
                        <div className="w-[300px] flex flex-col gap-2 overflow-auto">
                            <Card className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white flex-1">
                                {selectedElement ? (
                                    <EditSelectedElement
                                        element={selectedElement}
                                        onUpdate={(fields) => handleUpdateElement(selectedElement.id, fields)}
                                        onDelete={handleDeleteElement}
                                    />
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        Add an element or select an element on the canvas.
                                        Select a template from the menu.
                                    </p>
                                )}
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}