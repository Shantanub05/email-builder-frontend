"use client";

import { useState, useEffect, ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import CustomSidebar from "@/components/sidebar/CustomSidebar";
import TopBar from "@/components/topbar/TopBar";
import Canvas from "@/components/canvas/Canvas";
import EditSelectedElement from "@/components/element-editor/EditSelectedElement";
import { Card } from "./card";
import { CanvasElement } from "@/components/canvas/types";
import { downloadTemplate } from "@/utils/downloadTemplate"; 


interface Template {
    _id: string;
    name: string;
}

interface LayoutContainerProps {
    children?: ReactNode;
}

export default function LayoutContainer({ children }: LayoutContainerProps) {
    // State for canvas and selected element.
    const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const selectedElement = canvasElements.find((el) => el.id === selectedId) || null;

    // State for template list (which will be passed to the sidebar) and template name.
    const [templates, setTemplates] = useState<Template[]>([]);
    const [templateName, setTemplateName] = useState<string>("");
    function generateHTMLFromCanvas(): string {
        return canvasElements
            .map((el) => {
                if (el.type === "text") {
                    return `<p style="position: absolute; 
                              left: ${el.styles?.left ?? 0}px; 
                              top: ${el.styles?.top ?? 0}px; 
                              font-size: ${el.styles?.fontSize ?? "16px"}; 
                              color: ${el.styles?.color ?? "#000000"}; 
                              text-align: ${el.styles?.alignment ?? "left"};">
                        ${el.content || ""}
                    </p>`;
                } else if (el.type === "image") {
                    return `<img src="${el.url}" 
                         alt="Canvas Image" 
                         style="position: absolute; 
                                left: ${el.styles?.left ?? 0}px; 
                                top: ${el.styles?.top ?? 0}px; 
                                width: ${el.styles?.width ?? 200}px; 
                                height: ${el.styles?.height ?? 150}px; 
                                max-width: 100%; 
                                display: block;" />`;
                }
                return "";
            })
            .join("");
    }



    const handleDownloadTemplate = () => {
        if (!templateName) {
            alert("Please enter a template name before downloading.");
            return;
        }

        const htmlContent = generateHTMLFromCanvas();
        downloadTemplate(templateName, htmlContent);
    };

    // On mount, fetch the list of templates once.
    useEffect(() => {
        fetchTemplates();
    }, []);

    async function fetchTemplates() {
        try {
            const response = await fetch("http://localhost:3001/template/getEmailTemplates");
            if (!response.ok) {
                throw new Error("Failed to fetch templates");
            }
            const data: Template[] = await response.json();
            setTemplates(data);

            // **Load the first template by default if available**
            if (data.length > 0) {
                loadTemplate(data[0]._id);
            }
        } catch (error) {
            console.error("Error fetching templates:", error);
        }
    }


    // Load a single template into the canvas.
    async function loadTemplate(templateId: string) {
        try {
            const response = await fetch(`http://localhost:3001/template/getEmailTemplate/${templateId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch template");
            }
            const template = await response.json();

            // Set the template name and canvas elements
            setTemplateName(template.name);
            setCanvasElements(parseHTMLToCanvas(template.htmlContent));

            // **Set the selected ID to highlight in the sidebar**
            setSelectedId(templateId);
        } catch (error) {
            console.error("Error loading template:", error);
        }
    }



    // Convert an HTML string into CanvasElement[].
    function parseHTMLToCanvas(html: string): CanvasElement[] {
        const div = document.createElement("div");
        div.innerHTML = html;
        const elements: CanvasElement[] = [];
        div.childNodes.forEach((node, index) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as HTMLElement;
                const styles = element.style;
                if (element.tagName === "IMG") {
                    elements.push({
                        id: `img-${index}`,
                        type: "image",
                        url: element.getAttribute("src") ?? "",
                        styles: {
                            left: parseInt(styles.left) || 0,
                            top: parseInt(styles.top) || 0,
                            width: parseInt(styles.width) || 200,
                            height: parseInt(styles.height) || 150,
                        },
                    });
                } else {
                    elements.push({
                        id: `text-${index}`,
                        type: "text",
                        content: element.innerHTML,
                        styles: {
                            left: parseInt(styles.left) || 0,
                            top: parseInt(styles.top) || 0,
                            fontSize: styles.fontSize ?? "16px",
                            color: styles.color ?? "#000000",
                        },
                    });
                }
            }
        });
        return elements;
    }


    // Canvas interactions.
    const handleAddText = () => {
        const id = crypto.randomUUID();
        setCanvasElements((prev) => [
            ...prev,
            {
                id,
                type: "text",
                content: "<p>New Text</p>",
                styles: { fontSize: "16px", color: "#000000" },
            },
        ]);
        setSelectedId(id);
    };

    const handleAddImage = () => {
        const id = crypto.randomUUID();
        setCanvasElements((prev) => [
            ...prev,
            { id, type: "image", url: "https://picsum.photos/200", styles: {} },
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




    const uploadImage = async (file: File): Promise<string | null> => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(`http://localhost:3001/uploadImage`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            return data.base64 || null; // ✅ Use Base64 instead of URL
        } catch (error) {
            console.error("Error uploading image:", error);
            return null;
        }
    };


    // Save the template to the backend using the user-provided template name.
    const handleSaveTemplate = async () => {
    if (!templateName) {
        alert("Please enter a template name.");
        return;
    }

    let htmlContent = generateHTMLFromCanvas();

    // 🔍 Find all images using blob URLs and upload them
    const imageElements = canvasElements.filter(el => el.type === "image" && el.url?.startsWith("blob:"));

    if (imageElements.length > 0) {
        console.log(`Uploading ${imageElements.length} images...`);
    }

    // Upload images and replace blob URLs with Base64
    const uploadPromises = imageElements.map(async (el) => {
        if (!el.file) return null;

        const base64Image = await uploadImage(el.file);
        return base64Image ? { oldUrl: el.url!, newUrl: base64Image } : null;
    });

    const uploadedImages = (await Promise.all(uploadPromises)).filter(Boolean) as { oldUrl: string; newUrl: string }[];

    // Replace blob URLs with Base64
    uploadedImages.forEach(({ oldUrl, newUrl }) => {
        htmlContent = htmlContent.replace(oldUrl, newUrl);
    });

    console.log("Final HTML Content after replacing image URLs:", htmlContent);

    // 📨 Save template with updated HTML & styles
    try {
        const response = await fetch(`http://localhost:3001/template/uploadEmailTemplate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: templateName,
                htmlContent,
                variables: {},
                elements: canvasElements, // ✅ Save full element data including positions
                base64Image: uploadedImages.length > 0 ? uploadedImages[0].newUrl : null
            })
        });

        if (!response.ok) {
            throw new Error("Failed to save template");
        }

        const newTemplate: Template = await response.json();
        console.log("Template saved successfully:", newTemplate);
        alert("Template saved successfully!");

        // Update the templates list
        setTemplates((prev) => [...prev, newTemplate]);

        // **Retain the template name instead of clearing it**
        // setTemplateName(""); // Remove this line

        // **Optionally, set the current template as the newly saved one**
        // If you have a state to track the current template ID, set it here
        // For example:
        // setCurrentTemplateId(newTemplate._id);

        // **Alternatively, reload the templates and load the new one**
        fetchTemplates().then(() => {
            loadTemplate(newTemplate._id);
        });

    } catch (error) {
        console.error("Error saving template:", error);
        alert("Error saving template. Please try again.");
    }
};





    const handleResetTemplate = () => {
        setCanvasElements([]);
        setSelectedId(null);
    };

    return (
        <SidebarProvider defaultOpen={true}>
            <div className="h-screen w-screen flex bg-gray-50 overflow-hidden">
                {/* Sidebar Section with updated template list and refresh capability */}
                <CustomSidebar onLoadTemplate={loadTemplate} templates={templates} />

                {/* Main Page Content */}
                <main>{children}</main>

                {/* Right Section */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* A simple input to allow user to set a template name */}
                    <div className="p-2 flex items-center gap-2">
                        <input
                            type="text"
                            value={templateName}
                            onChange={(e) => setTemplateName(e.target.value)}
                            placeholder="Enter template name"
                            className="w-64 px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            <Card
                                className="text-card-foreground w-full border border-gray-200 rounded-lg shadow bg-white"
                                style={{ minHeight: "100%", height: "auto", overflow: "visible" }} // ✅ Fix height handling
                            >
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
