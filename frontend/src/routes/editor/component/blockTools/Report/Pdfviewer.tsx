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
}

const PdfViewer: React.FC<PdfViewerProps> = ({ url, pageNumber = 1, onRenderComplete, onCapture }) => {
  const [show, setShow] = useState<boolean>(true);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNum, setPageNumber] = useState<number>(pageNumber);
  const [scale, setScale] = useState<number>(1.2); // scale을 상태로 저장
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
      console.error('Error rendering page:', error);
    }
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    const rect = event.currentTarget.getBoundingClientRect();
    setStartPoint({ x: (event.clientX - rect.left) / scale, y: (event.clientY - rect.top) / scale });
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging || !startPoint) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const currentX = (event.clientX - rect.left) / scale;
    const currentY = (event.clientY - rect.top) / scale;

    setEndPoint({ x: currentX, y: currentY });

    const width = Math.abs(currentX - startPoint.x);
    const height = Math.abs(currentY - startPoint.y);
    const x = Math.min(currentX, startPoint.x);
    const y = Math.min(currentY, startPoint.y);

    setSelection({ x, y, width, height });
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
        const imageData = context.getImageData(x * 1.83, y * 1.83, width * 3, height * 3);
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width * 1.9;
        tempCanvas.height = height * 1.9;
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

  const handleClose = () => setShow(false);

  return (
    <div className="relative flex flex-col items-center justify-center mx-auto">
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>드래그 하고 영역선택한 뒤 밑에 캡처를 눌러주세요!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ position: 'relative' }}>
            <canvas
              className="w-100 h-100"
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            ></canvas>
            {selection && (
              <div
                style={{
                  position: 'absolute',
                  border: '2px dashed #000',
                  left: selection.x * scale,
                  top: selection.y * scale,
                  width: selection.width * scale,
                  height: selection.height * scale,
                  pointerEvents: 'none',
                }}
              ></div>
            )}
          </div>
          <div className="absolute top-50 left-0 p-2 bg-gray-800 text-white rounded-full cursor-pointer" onClick={goToPrevPage}>
            &lt;
          </div>
          <div className="absolute top-50 right-0 p-2 bg-gray-800 text-white rounded-full cursor-pointer" onClick={goToNextPage}>
            &gt;
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 p-2 bg-gray-800 text-white rounded">
            Page {pageNum} of {numPages}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCapture} disabled={!selection}>
            Capture
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PdfViewer;
