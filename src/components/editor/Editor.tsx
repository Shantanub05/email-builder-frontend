"use client";

import React, { useState, useEffect, FC } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const QuillEditor = dynamic(() => import("react-quill-new"), { ssr: false });

interface EditorProps {
    value?: string;
    onContentChange: (value: string) => void;
    styles?: {
        fontSize: string;
        color: string;
    };
}

const quillModules = {
    toolbar: {
        container: [
            [{ font: [] }],
            ["bold", "italic", "underline", "strike"],
            ["clean"],
            [{ color: [] }, { background: [] }],
        ],
    },
};

const quillFormats = [
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "align",
];

const Editor: FC<EditorProps> = ({ value, onContentChange, styles }) => {
    const [content, setContent] = useState<string>(value ?? "");

    useEffect(() => {
        setContent(value ?? "");
    }, [value]);

    const handleChange = (val: string) => {
        const sanitized = val.replace(
            /style="[^"]*text-align:\s*(center|right|justify|left);?[^"]*"/gi,
            ""
        );
        console.log("Editor: Content changed. Sanitized content:", sanitized);
        setContent(sanitized);
        onContentChange(sanitized);
    };

    return (
        <div className="h-full w-full space-y-2">
            <p className="text-xs text-gray-500">
                <strong>Note:</strong> Shift + Enter will add a line break.
            </p>
            {QuillEditor && (
                <QuillEditor
                    value={content}
                    onChange={handleChange}
                    modules={quillModules}
                    formats={quillFormats}
                    className="custom-editor"
                    style={{
                        fontSize: styles?.fontSize ?? "16px",
                        color: styles?.color ?? "#000000",
                    }}
                />
            )}
        </div>
    );
};

export default Editor;
