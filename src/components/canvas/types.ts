export interface CanvasElement {
  id: string;
  type: 'text' | 'image';
  content?: string;
  url?: string;
  styles: {
    left?: number;
    top?: number;
    width?: number;
    height?: number;
    fontSize?: string;
    color?: string;
    alignment?: 'left' | 'center' | 'right' | 'justify';
  };
  file?: File; // ✅ Allow storing uploaded files
}
