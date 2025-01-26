import { CanvasElement } from '@/components/canvas/types';

export function parseHTMLToCanvas(html: string): CanvasElement[] {
  const div = document.createElement('div');
  div.innerHTML = html;
  const elements: CanvasElement[] = [];

  div.childNodes.forEach((node, index) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;
      const styles = element.style;

      if (element.tagName === 'IMG') {
        elements.push({
          id: `img-${index}`,
          type: 'image',
          url: element.getAttribute('src') ?? '',
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
          type: 'text',
          content: element.innerHTML,
          styles: {
            left: parseInt(styles.left) || 0,
            top: parseInt(styles.top) || 0,
            fontSize: styles.fontSize ?? '16px',
            color: styles.color ?? '#000000',
          },
        });
      }
    }
  });

  return elements;
}
