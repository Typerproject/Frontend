declare module 'pdfjs-dist/webpack' {
    import { PDFDocumentProxy, PDFPageProxy, PDFPromise } from 'pdfjs-dist/types/src/display/api';
  
    export function getDocument(src: string | Uint8Array): PDFPromise<PDFDocumentProxy>;
  
    export interface PDFDocumentProxy {
      numPages: number;
      getPage(pageNumber: number): Promise<PDFPageProxy>;
    }
  
    export interface PDFPageProxy {
      getViewport(params: { scale: number }): PDFPageViewport;
      render(params: PDFRenderParams): PDFRenderTask;
    }
  
    export interface PDFPageViewport {
      width: number;
      height: number;
    }
  
    export interface PDFRenderParams {
      canvasContext: CanvasRenderingContext2D | null;
      viewport: PDFPageViewport;
    }
  
    export interface PDFRenderTask {
      promise: Promise<void>;
    }
  }
  