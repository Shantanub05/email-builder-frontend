export interface CanvasElement {
  id: string;
  type: 'text' | 'image';
  content?: string;
  url?: string;
  styles: {
    left: number; // Changed to required
    top: number; // Changed to required
    width?: number;
    height?: number;
    fontSize?: string;
    color?: string;
    alignment?: 'left' | 'center' | 'right' | 'justify';
  };
  file?: File;
}
