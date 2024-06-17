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
      icon: `
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M21 13.1c-.1 0-.3.1-.4.2l-1 1l2.1 2.1l1-1c.2-.2.2-.6 0-.8l-1.3-1.3c-.1-.1-.2-.2-.4-.2m-1.9 1.8l-6.1 6V23h2.1l6.1-6.1l-2.1-2M21 9h-8V3h8v6m-8 9.06V11h8v.1c-.76 0-1.43.4-1.81.79L13 18.06M11 13H3V3h8v10m0 8H3v-6h8v6Z"
          />
        </svg>
      `,
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

