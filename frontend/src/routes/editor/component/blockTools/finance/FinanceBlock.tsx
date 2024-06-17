import React from 'react';
import ReactDOM from 'react-dom/client';
import FinanceModal from './FinanceModal';
import Creatediv from './Creatediv';


interface FinanceBlockData {
  data: IFinanceData;
}


interface DataItem {
  bsns_year: number;
  account_nm: string;
  thstrm_amount: number;
}


export interface IFinanceData {
  data:DataItem[]
  company:string
}


export class FinanceBlock {

  
  data: IFinanceData | null;
  wrapper: HTMLDivElement | null = null;
  div: HTMLDivElement | null = null;

  constructor({data}:FinanceBlockData) {
  
    this.data = data || null;
    this.wrapper = null;
    this.div = null;

    this.creatediv = this.creatediv.bind(this);
  }

  static get toolbox() {
    return {
      title: "재무재표",
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>',
    };
  }

  render() {
    this.wrapper = document.createElement("div");
    
    if (this.data && Object.keys(this.data).length > 0){

      this.creatediv(this.data.data,this.data.company);
    }
    else{
    ReactDOM.createRoot(this.wrapper).render(<FinanceModal creatediv={this.creatediv}/>);
    }
    

    return this.wrapper;
  }

  static get isReadOnlySupported() {
    return true;
  }


  creatediv(data: DataItem[], company: string) {
    if (this.wrapper) {
      ReactDOM.createRoot(this.wrapper).render(<Creatediv data={data} company={company} />)
  
      this.data = { data, company }; // Assigning data directly
    } else {
      console.error('Wrapper element is not available');
    }
  }

    

  save(blockContent:string) {

    return this.data;
  }
}

