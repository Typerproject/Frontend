import React, { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

import pdfJSWorkerURL from "pdfjs-dist/build/pdf.worker?url";
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfJSWorkerURL;

interface PdfViewerProps {
  url: string;
  pageNumber?: number;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ url, pageNumber = 1 }) => {
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
      const scale = 1;
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

          console.log('Rendering page:', pageNumber);
          await page.render(renderContext).promise;
          console.log('Page rendered');
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
    <div>
      <canvas ref={canvasRef}></canvas>
      <div>
        <button onClick={goToPrevPage} disabled={pageNum <= 1}>
          Previous
        </button>
        <button onClick={goToNextPage} disabled={numPages !== null && pageNum >= numPages}>
          Next
        </button>
      </div>
      <p>
        Page {pageNum} of {numPages}
      </p>
    </div>
  );
};

export default PdfViewer;
