"use client";

import {
    useSidebar,
    SidebarHeader,
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";

interface CustomSidebarProps {
    onLoadTemplate: (id: string) => void;
    templates: { _id: string; name: string }[];
}

export default function CustomSidebar({ onLoadTemplate, templates }: CustomSidebarProps) {
    const { open } = useSidebar();
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

    useEffect(() => {
        if (templates.length > 0 && !selectedTemplateId) {
            setSelectedTemplateId(templates[0]._id);
            onLoadTemplate(templates[0]._id);
        }
    }, [templates, selectedTemplateId, onLoadTemplate]);

    return (
        <div className={`transition-all duration-300 border-r border-gray-200 bg-white shadow overflow-hidden ${open ? "w-64" : "w-0"}`}>
            {open && (
                <>
                    <SidebarHeader className="border-b border-gray-200 px-4 py-3">
                        <h2 className="text-sm font-semibold">Templates</h2>
                    </SidebarHeader>
                    <SidebarContent className="p-2 space-y-2 overflow-y-auto max-h-screen">
                        <SidebarMenu>
                            {templates.length > 0 ? (
                                templates.map((template) => (
                                    <SidebarMenuItem key={template._id}>
                                        <SidebarMenuButton
                                            className={`rounded-md ${selectedTemplateId === template._id ? "bg-blue-500 text-white" : "bg-transparent text-gray-700"}`}
                                            onClick={() => {
                                                onLoadTemplate(template._id);
                                                setSelectedTemplateId(template._id);
                                            }}
                                        >
                                            {template.name}
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 px-4">Loading Templates</p>
                            )}
                        </SidebarMenu>
                    </SidebarContent>
                </>
            )}
        </div>
    );
}
