import { createElement } from "react";
import CreateDOM from "react-dom/client";
import DisclosureModal from "./DisclosureModal";
import { API } from "@editorjs/editorjs/types/index";
import "./css/Dart.css";
import "./css/HTML.css";

interface DisclosureBlockProps {
  data: any;
  api: API;
}

export class DisclosureBlock {
  nodes: HTMLElement | null;
  data: any;
  api: API;

  constructor({ data, api }: DisclosureBlockProps) {
    this.data = data;
    this.nodes = null;
    this.api = api;
  }

  static get toolbox() {
    return {
      title: "공시",
      icon: "<svg xmlns='http://www.w3.org/2000/svg' id='Layer_1' data-name='Layer 1' viewBox='0 0 24 24'><path d='m19,0h-9c-2.757,0-5,2.243-5,5v1h-.5c-2.481,0-4.5,2.019-4.5,4.5v10c0,1.929,1.569,3.499,3.499,3.5h15.501c2.757,0,5-2.243,5-5V5c0-2.757-2.243-5-5-5ZM5,20.5c0,.827-.673,1.5-1.5,1.5s-1.5-.673-1.5-1.5v-10c0-1.378,1.122-2.5,2.5-2.5h.5v12.5Zm17-1.5c0,1.654-1.346,3-3,3H6.662c.216-.455.338-.963.338-1.5V5c0-1.654,1.346-3,3-3h9c1.654,0,3,1.346,3,3v14Zm-2-12c0,.552-.448,1-1,1h-3c-.552,0-1-.448-1-1s.448-1,1-1h3c.552,0,1,.448,1,1Zm0,4c0,.552-.448,1-1,1h-9c-.552,0-1-.448-1-1s.448-1,1-1h9c.552,0,1,.448,1,1Zm0,4c0,.552-.448,1-1,1h-9c-.552,0-1-.448-1-1s.448-1,1-1h9c.552,0,1,.448,1,1Zm0,4c0,.552-.448,1-1,1h-9c-.552,0-1-.448-1-1s.448-1,1-1h9c.552,0,1,.448,1,1ZM9,7v-2c0-.552.448-1,1-1h2c.552,0,1,.448,1,1v2c0,.552-.448,1-1,1h-2c-.552,0-1-.448-1-1Z'/></svg>",
    };
  }

  static get isReadOnlySupported() {
    return true;
  }

  render() {
    const createElementFromJson = (element) => {
      if (typeof element === "string") {
        return element;
      }

      const { type, props } = element;
      let children = element.props?.children;

      if (children === undefined) {
        return createElement(type, props);
      }

      if (typeof children === "string") {
        return createElement(type, props, children);
      } else {
        if (Array.isArray(children)) {
          children = children.map((ele) => {
            return createElementFromJson(ele);
          });
        } else {
          children = createElementFromJson(children);
        }
      }

      return createElement(type, props, children);
    };

    const rootNode = document.createElement("div");
    this.nodes = rootNode;

    const disclosureRoot = CreateDOM.createRoot(rootNode);

    const corpModal = document.createElement("div");
    const corpRoot = CreateDOM.createRoot(corpModal);

    const current = this.api.blocks.getCurrentBlockIndex();

    disclosureRoot.render(<h1>레포트 작성중</h1>);

    const setData = (data: any) => {
      this.data = data;

      const marginStyle = this.data.type === "Dart" ? " gap-y-3" : " ";

      disclosureRoot.render(
        <div className="flex flex-col items-center">
          <div className={`flex flex-col ${marginStyle}`}>{this.data.body}</div>
        </div>
      );

      corpModal.remove();
    };

    if (Object.keys(this.data).length === 0) {
      corpRoot.render(
        <DisclosureModal
          onExitFirst={() => {
            this.api.blocks.delete(current);
            corpModal.remove();
          }}
          setData={setData}
        />
      );
      document.getElementById("root")?.appendChild(corpModal);
    } else {
      const compo = this.data.body.map((ele) => createElementFromJson(ele));

      const marginStyle = this.data.type === "Dart" ? " gap-y-3" : " ";

      disclosureRoot.render(
        <div className="flex flex-col items-center">
          <div
            className={`flex flex-col w-full overflow-x-scroll hover:bg-gray-300 ${marginStyle}`}
            onClick={() => {
              window.open(
                `https://dart.fss.or.kr/dsaf001/main.do?rcpNo=${this.data.reportCode}`,
                "_blank"
              );
            }}
            title="dart.fss.or.kr로 이동해서 원문 보기"
          >
            {compo}
          </div>
        </div>
      );
      corpModal.remove();
    }

    return rootNode;
  }

  save() {
    return this.data;
  }
}
