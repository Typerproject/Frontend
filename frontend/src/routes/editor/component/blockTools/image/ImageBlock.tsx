import { API } from "@editorjs/editorjs/types/index";

interface ReportBlockData {
  data: ImageData;
  api: API;
}

export interface ImageData {
  url: string;
}

export class ImageBlock {
  data: ImageData;
  api: API;

  constructor({ data, api }: ReportBlockData) {
    this.data = data || null ;
    this.api = api;
  }

  static get toolbox() {
    return {
      title: "이미지",
      icon: "<svg xmlns='http://www.w3.org/2000/svg' id='Layer_1' data-name='Layer 1' viewBox='0 0 24 24'><path d='m19,0h-9c-2.757,0-5,2.243-5,5v1h-.5c-2.481,0-4.5,2.019-4.5,4.5v10c0,1.929,1.569,3.499,3.499,3.5h15.501c2.757,0,5-2.243,5-5V5c0-2.757-2.243-5-5-5ZM5,20.5c0,.827-.673,1.5-1.5,1.5s-1.5-.673-1.5-1.5v-10c0-1.378,1.122-2.5,2.5-2.5h.5v12.5Zm17-1.5c0,1.654-1.346,3-3,3H6.662c.216-.455.338-.963.338-1.5V5c0-1.654,1.346-3,3-3h9c1.654,0,3,1.346,3,3v14Zm-2-12c0,.552-.448,1-1,1h-3c-.552,0-1-.448-1-1s.448-1,1-1h3c.552,0,1,.448,1,1Zm0,4c0,.552-.448,1-1,1h-9c-.552,0-1-.448-1-1s.448-1,1-1h9c.552,0,1,.448,1,1Zm0,4c0,.552-.448,1-1,1h-9c-.552,0-1-.448-1-1s.448-1,1-1h9c.552,0,1,.448,1,1Zm0,4c0,.552-.448,1-1,1h-9c-.552,0-1-.448-1-1s.448-1,1-1h9c.552,0,1,.448,1,1ZM9,7v-2c0-.552.448-1,1-1h2c.552,0,1,.448,1,1v2c0,.552-.448,1-1,1h-2c-.552,0-1-.448-1-1Z'/></svg>",
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get pasteConfig() {
    return {
      tags: ['img'],
      patterns: {
        image: '/https?:\\/\\/\\S+\\.(gif|jpe?g|tiff|png|webp|bmp)$/i',
      },
    };
  }

  render() {
    const img = document.createElement('img');
    img.src = this.data.url;
    img.style.maxWidth = '100%';
    img.style.textAlign = 'center'
    this.data = { url: img.src };

    return img;
  }

  save(blockContent: string) {
    console.log(this.data)
    return this.data;
  }
}

export default ImageBlock;