// src/hooks/useTemplateManagement.ts
import { useState, useEffect } from 'react';
import { CanvasElement } from '@/components/canvas/types';
import { parseHTMLToCanvas } from '@/utils/htmlParser';
import { uploadImage } from '@/utils/imageUploader';

interface Template {
  _id: string;
  name: string;
}

export function useTemplateManagement() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templateName, setTemplateName] = useState<string>('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    try {
      const response = await fetch(
        'http://localhost:3001/template/getEmailTemplates'
      );
      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }
      const data: Template[] = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  }

  async function loadTemplate(
    templateId: string,
    setCanvasElements: React.Dispatch<React.SetStateAction<CanvasElement[]>>
  ) {
    try {
      const response = await fetch(
        `http://localhost:3001/template/getEmailTemplate/${templateId}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch template');
      }
      const template = await response.json();

      setTemplateName(template.name);
      setCanvasElements(parseHTMLToCanvas(template.htmlContent));
    } catch (error) {
      console.error('Error loading template:', error);
    }
  }

  async function saveTemplate(
    canvasElements: CanvasElement[],
    generateHTMLFromCanvas: (elements: CanvasElement[]) => string
  ) {
    if (!templateName) {
      alert('Please enter a template name.');
      return;
    }

    let htmlContent = generateHTMLFromCanvas(canvasElements);

    // Upload images
    const imageElements = canvasElements.filter(
      (el) => el.type === 'image' && el.url?.startsWith('blob:')
    );
    const uploadPromises = imageElements.map(async (el) => {
      if (!el.file) return null;
      const base64Image = await uploadImage(el.file);
      return base64Image ? { oldUrl: el.url!, newUrl: base64Image } : null;
    });

    const uploadedImages = (await Promise.all(uploadPromises)).filter(
      Boolean
    ) as { oldUrl: string; newUrl: string }[];

    // Replace blob URLs with Base64
    uploadedImages.forEach(({ oldUrl, newUrl }) => {
      htmlContent = htmlContent.replace(oldUrl, newUrl);
    });

    try {
      const response = await fetch(
        `http://localhost:3001/template/uploadEmailTemplate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: templateName,
            htmlContent,
            variables: {},
            elements: canvasElements,
            base64Image:
              uploadedImages.length > 0 ? uploadedImages[0].newUrl : null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save template');
      }

      const newTemplate: Template = await response.json();
      alert('Template saved successfully!');
      setTemplates((prev) => [...prev, newTemplate]);
      setTemplateName('');
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Error saving template. Please try again.');
    }
  }

  return {
    templates,
    templateName,
    setTemplateName,
    fetchTemplates,
    loadTemplate,
    saveTemplate,
  };
}
