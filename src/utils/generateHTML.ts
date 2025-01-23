import { CanvasElement } from '@/components/canvas/types';

export function generateHTMLFromCanvas(
  canvasElements: CanvasElement[]
): string {
  return canvasElements
    .map((el) => {
      if (el.type === 'text') {
        return `<p style="position: absolute; left: ${
          el.styles?.left ?? 0
        }px; top: ${el.styles?.top ?? 0}px; font-size: ${
          el.styles?.fontSize ?? '16px'
        }; color: ${el.styles?.color ?? '#000000'};">${el.content || ''}</p>`;
      } else if (el.type === 'image') {
        return `<img src="${el.url}" style="position: absolute; left: ${
          el.styles?.left ?? 0
        }px; top: ${el.styles?.top ?? 0}px; width: ${
          el.styles?.width ?? 200
        }px; height: ${el.styles?.height ?? 150}px;" />`;
      }
      return '';
    })
    .join('');
}
