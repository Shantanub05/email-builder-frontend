"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Menu, Download } from "lucide-react";

interface TopBarProps {
    onAddText?: () => void;
    onAddImage?: () => void;
    onSaveTemplate?: () => void;
    onResetTemplate?: () => void;
    onDownloadTemplate?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
    onAddText,
    onAddImage,
    onSaveTemplate,
    onResetTemplate,
    onDownloadTemplate,
}) => {
    const { toggleSidebar } = useSidebar();

    return (
        <div className="flex items-center justify-between p-2">
            <div className="flex items-center space-x-2">
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-gray-200"
                    onClick={toggleSidebar}
                >
                    <Menu className="h-5 w-5" />
                </Button>
                {onAddText && (
                    <Button
                        onClick={onAddText}
                        className="ml-2 bg-gray-200 hover:bg-gray-300 rounded-full text-sm"
                    >
                        + Text
                    </Button>
                )}
                {onAddImage && (
                    <Button
                        onClick={onAddImage}
                        className="ml-2 bg-gray-200 hover:bg-gray-300 rounded-full text-sm"
                    >
                        + Image
                    </Button>
                )}
            </div>

            <div className="flex items-center space-x-2">
                {onSaveTemplate && (
                    <Button
                        onClick={onSaveTemplate}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full text-sm"
                    >
                        Save Template
                    </Button>
                )}

                {onDownloadTemplate && (
                    <Button
                        onClick={onDownloadTemplate}
                        className="bg-gray-200 hover:bg-gray-300 text-black px-3 py-1 rounded-full text-sm flex items-center"
                    >
                        <Download className="mr-1 h-4 w-4" /> Download
                    </Button>
                )}

                {onResetTemplate && (
                    <Button
                        onClick={onResetTemplate}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-sm"
                    >
                        Reset
                    </Button>
                )}
            </div>
        </div>
    );
};

export default TopBar;
