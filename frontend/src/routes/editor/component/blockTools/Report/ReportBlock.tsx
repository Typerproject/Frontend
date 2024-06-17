
import ReactDOM from 'react-dom/client';
import AnalystReportModal from './ReportModal';
import PdfViewer from './Pdfviewer';

interface IState {
  showModal: boolean;
}

interface ReportBlockData {
  data: IReportData;
}



export interface IReportData {
  url: string;
}


export class ReportBlock {

  data: IReportData | null;
  wrapper: HTMLDivElement | null ;
  div: HTMLDivElement | null;
  state: IState;


  setWrapper(wrapper: HTMLDivElement) {
    this.wrapper = wrapper;
  }

  constructor({data}:ReportBlockData) {
    this.data = data || null;
    this.wrapper = null;
    this.div = null;
    this.state = {
      showModal: false
    };
    
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
    this.wrapper = document.createElement("div");

    if (this.data && Object.keys(this.data).length > 0){
        this.createIframe(this.data.url);
    }
    else{
    ReactDOM.createRoot(this.wrapper).render(
      <AnalystReportModal createIframe={this.createIframe}/>
    );
    
  }

  
    return this.wrapper;

    
  }

  createIframe = (url:string) => {
    const proxyUrl = `/analyst${url.split('https://consensus.hankyung.com')[1]}`;
    
  
    if (this.wrapper) {
      ReactDOM.createRoot(this.wrapper).render(
        <PdfViewer url={proxyUrl} />
        
      );
      this.data={url};
    } else {
      console.error('Wrapper element is not set.');
    }

  };


  save(blockContent:string) {
    console.log(this.data)
    return this.data;
  }
}