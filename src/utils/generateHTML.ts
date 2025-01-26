import { CanvasElement } from "@/components/canvas/types";

export function generateHTMLFromCanvas(
  canvasElements: CanvasElement[]
): string {
  return canvasElements
    .map((el) => {
      const style = [
        `position: absolute`,
        `left: ${el.styles?.left ?? 0}px`,
        `top: ${el.styles?.top ?? 0}px`,
        ...(el.type === 'text'
          ? [
              `font-size: ${el.styles?.fontSize ?? '16px'}`,
              `color: ${el.styles?.color ?? '#000000'}`,
              `text-align: ${el.styles?.alignment ?? 'left'}`,
            ]
          : [
              `width: ${el.styles?.width ?? 200}px`,
              `height: ${el.styles?.height ?? 150}px`,
            ]),
      ].join('; ');

      if (el.type === 'text') {
        return `<div style="${style}">${el.content || ''}</div>`;
      } else if (el.type === 'image') {
        return `<img src="${el.url}" style="${style}" />`;
      }
      return '';
    })
    .join('\n');
}
