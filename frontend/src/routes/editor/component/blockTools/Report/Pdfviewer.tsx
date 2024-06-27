import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from "react-bootstrap";
import * as pdfjsLib from 'pdfjs-dist';

import pdfJSWorkerURL from 'pdfjs-dist/build/pdf.worker?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfJSWorkerURL;

interface PdfViewerProps {
  url: string;
  pageNumber?: number;
  onRenderComplete?: (canvas: HTMLCanvasElement) => void;
  onCapture?: (imageDataUrl: string) => void;
  onExit: () => void;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ url, pageNumber = 1, onRenderComplete, onCapture, onExit }) => {
  const [show, setShow] = useState<boolean>(true);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNum, setPageNumber] = useState<number>(pageNumber);
  const [scale, setScale] = useState<number>(1.2);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startPoint, setStartPoint] = useState<{ x: number, y: number } | null>(null);
  const [endPoint, setEndPoint] = useState<{ x: number, y: number } | null>(null);
  const [selection, setSelection] = useState<{ x: number, y: number, width: number, height: number } | null>(null);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        setNumPages(pdf.numPages);
        renderPage(pdf, pageNum, scale);
      } catch (error) {
        onExit();
        console.error('Error loading PDF:', error);
      }
    };

    fetchPdf();
  }, [url, pageNum, scale]);

  const renderPage = async (pdf: pdfjsLib.PDFDocumentProxy, pageNumber: number, scale: number) => {
    try {
      const page = await pdf.getPage(pageNumber);
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
      onExit();
      console.error('Error rendering page:', error);
    }
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setIsDragging(true);
      setStartPoint({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging || !startPoint) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const currentX = event.clientX - rect.left;
      const currentY = event.clientY - rect.top;

      setEndPoint({ x: currentX, y: currentY });

      const width = Math.abs(currentX - startPoint.x);
      const height = Math.abs(currentY - startPoint.y);
      const x = Math.min(currentX, startPoint.x);
      const y = Math.min(currentY, startPoint.y);

      setSelection({ x, y, width, height });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setStartPoint(null);
    setEndPoint(null);
  };

  const handleCapture = async () => {
    const canvas = canvasRef.current;
    if (canvas && onCapture && selection) {
      const context = canvas.getContext('2d');
      if (context) {
        const { x, y, width, height } = selection;
        const rect = canvas.getBoundingClientRect();

        const sx = x * (canvas.width / rect.width);
        const sy = y * (canvas.height / rect.height);
        const sw = width * (canvas.width / rect.width);
        const sh = height * (canvas.height / rect.height);

        const imageData = context.getImageData(sx, sy, sw, sh);
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = sw;
        tempCanvas.height = sh;
        const tempContext = tempCanvas.getContext('2d');
        if (tempContext) {
          tempContext.putImageData(imageData, 0, 0);
          const imageDataUrl = tempCanvas.toDataURL('image/png');
          onCapture(imageDataUrl);
          setShow(false);
        }
      }
    }
  };

  const goToPrevPage = () => {
    setPageNumber((prevPage) => Math.max(prevPage - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prevPage) => (numPages ? Math.min(prevPage + 1, numPages) : prevPage + 1));
  };

  const handleClose = () => {
    setShow(false);
    onExit();
  };

  return (
    <Modal show={show} onHide={handleClose} >
      <Modal.Header closeButton>
      </Modal.Header>
      <Modal.Body>
        <div style={{ position: 'relative', width: '100%', height: '80vh' }}>
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ width: '100%', height: '100%' }}
          ></canvas>
          {selection && (
            <div
              style={{
                position: 'absolute',
                border: '2px dashed #000',
                left: selection.x,
                top: selection.y,
                width: selection.width,
                height: selection.height,
                pointerEvents: 'none',
              }}
            ></div>
          )}
        </div>
        <div
          className="absolute top-1/2 left-0 transform -translate-y-1/2 cursor-pointer bg-black text-white p-2 rounded-full z-10"
          onClick={goToPrevPage}
         >
          &lt;
        </div>
        <div
          className="absolute top-1/2 right-0 transform -translate-y-1/2 cursor-pointer bg-black text-white p-2 rounded-full z-10"
          onClick={goToNextPage}
          >
          &gt;
        </div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-black text-white py-1 px-3 rounded-md">
          Page {pageNum} of {numPages}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleCapture} disabled={!selection}>
          Capture
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PdfViewer;