import React from 'react';
import ReactDOM from 'react-dom/client';
import AnalystReportModal from './ReportModal';
import PdfViewer from './Pdfviewer';

interface IState {
  showModal: boolean;
}

export class ReportBlock {

  public wrapper: HTMLDivElement | null = null;
  public div: HTMLDivElement | null = null;
  public state: IState


  setWrapper(wrapper: HTMLDivElement) {
    this.wrapper = wrapper;
  }
  constructor() {
    this.wrapper = null;
    this.div = null;
    this.state = {
      showModal: false
    };
    
  }

  static get toolbox() {
    return {
      title: "AnalystReport",
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
    };
  }

  render() {
    this.wrapper = document.createElement("div");

    ReactDOM.createRoot(this.wrapper).render(
      <AnalystReportModal createIframe={this.createIframe}/>
    );

  
    return this.wrapper;

    
  }

  createIframe = (url:string) => {
    const proxyUrl = `/analyst${url.split('https://consensus.hankyung.com')[1]}`;
    
  
    if (this.wrapper) {
      ReactDOM.createRoot(this.wrapper).render(
        <PdfViewer url={proxyUrl} />
        
      );
    } else {
      console.error('Wrapper element is not set.');
    }

  };



  save(blockContent:string) {
    return {
      // data: this.data.name
    };
  }
}