import ReactDOM from 'react-dom/client';
import AnalystReportModal from './ReportModal';
import PdfViewer from './Pdfviewer';
import { API } from "@editorjs/editorjs/types/index";

interface IState {
  showModal: boolean;
}

interface ReportBlockData {
  data: IReportData;
  api: API;
}

export interface IReportData {
  imageDataUrl: string;
}

export class ReportBlock {
  data: IReportData | null;
  wrapper: HTMLDivElement | null;
  div: HTMLDivElement | null;
  state: IState;
  api: API;

  setWrapper(wrapper: HTMLDivElement) {
    this.wrapper = wrapper;
  }

  constructor({ data, api }: ReportBlockData) {
    this.data = data || null;
    this.wrapper = null;
    this.div = null;
    this.state = {
      showModal: false
    };
    this.api = api;
  }

  static get toolbox() {
    return {
      title: "애널리스트 리포트",
      icon: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17 19h4m-7 1H6a3 3 0 0 1 0-6h11a3 3 0 0 0-3 3m7-3V6a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v8m12 3v4"
      />
    </svg>`
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  render() {
    const current = this.api.blocks.getCurrentBlockIndex();
    this.wrapper = document.createElement("div");

    if (this.data && Object.keys(this.data).length > 0) {
      const img = document.createElement('img');
      img.src = this.data.imageDataUrl;
      img.alt = 'Captured Image';
      img.style.width = '500px';
      this.wrapper.appendChild(img);
    } else {
      ReactDOM.createRoot(this.wrapper).render(
        <AnalystReportModal createIframe={this.createIframe}
          onExit={() => {
            this.api.blocks.delete(current);
          }} />
      );
    }

    return this.wrapper;
  }

  createIframe = (url: string) => {
    const proxyUrl = `/analyst${url.split('https://consensus.hankyung.com')[1]}`;

    const handleCapture = (imageDataUrl: string) => {
      const img = document.createElement('img');
      img.src = imageDataUrl;
      img.alt = 'Captured Image';
      img.style.width = '500px';
      this.data = { imageDataUrl};
      if (this.wrapper) {
        this.wrapper.appendChild(img);
      }
    };

    if (this.wrapper) {
      const current = this.api.blocks.getCurrentBlockIndex();
      ReactDOM.createRoot(this.wrapper).render(
        <PdfViewer url={proxyUrl} onCapture={handleCapture} onExit={() => {
          this.api.blocks.delete(current);
        }} />
      );
       
    } else {
      console.error('Wrapper element is not set.');
    }
  };

  save(blockContent: string) {
    return this.data;
  }
}