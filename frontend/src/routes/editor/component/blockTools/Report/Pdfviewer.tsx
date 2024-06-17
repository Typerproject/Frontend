import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

import pdfJSWorkerURL from 'pdfjs-dist/build/pdf.worker?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfJSWorkerURL;

interface PdfViewerProps {
  url: string;
  pageNumber?: number;
  onRenderComplete?: (canvas: HTMLCanvasElement) => void;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ url, pageNumber = 1, onRenderComplete }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNum, setPageNumber] = useState<number>(pageNumber);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        setNumPages(pdf.numPages);
        renderPage(pdf, pageNum);
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };

    fetchPdf();
  }, [url, pageNum]);

  const renderPage = async (pdf: pdfjsLib.PDFDocumentProxy, pageNumber: number) => {
    try {
      const page = await pdf.getPage(pageNumber);
      const scale = 1.2; // 고화질로 설정하기 위해 스케일을 높임
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext('2d');
        if (context) {
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          const renderContext = {
            canvasContext: context,
            viewport,
          };

          await page.render(renderContext).promise;

          if (onRenderComplete) {
            onRenderComplete(canvas);
          }
        }
      }
    } catch (error) {
      console.error('Error rendering page:', error);
    }
  };

  const goToPrevPage = () => {
    setPageNumber((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prevPage) => (numPages ? Math.min(prevPage + 1, numPages) : prevPage + 1));
  };

  return (
    <div className="flex flex-col items-center justify-center mx-auto">
      <canvas className="w-50 h-auto" ref={canvasRef}></canvas>
      <div className="flex space-x-4 mt-4">
        <button 
          onClick={goToPrevPage} 
          disabled={pageNum <= 1} 
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          이전
        </button>
        <button 
          onClick={goToNextPage} 
          disabled={numPages !== null && pageNum >= numPages} 
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          다음
        </button>
      </div>
      <p className="mt-2">
        Page {pageNum} of {numPages}
      </p>
    </div>
  );
};

export default PdfViewer;