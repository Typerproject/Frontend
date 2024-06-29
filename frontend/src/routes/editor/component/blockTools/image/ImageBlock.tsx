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
    this.data = data || null;
    this.api = api;
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get pasteConfig() {
    return {
      tags: ["img"],
      patterns: {
        image: "/https?:\\/\\/\\S+\\.(gif|jpe?g|tiff|png|webp|bmp)$/i",
      },
    };
  }

  render() {
    const img = document.createElement("img");
    img.src = this.data.url;
    img.style.maxWidth = "100%";
    img.style.textAlign = "center";
    this.data = { url: img.src };

    return img;
  }

  save(blockContent: string) {
    return this.data;
  }
}

export default ImageBlock;
