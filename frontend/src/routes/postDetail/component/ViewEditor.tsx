// import React from 'react'
// import EditorJS from "@editorjs/editorjs";
// import Header from "@editorjs/header";
// import Quote from "@editorjs/quote";
// import NestedList from "@editorjs/nested-list";
// import Table from "@editorjs/table";
// import Paragraph from "@editorjs/paragraph";
// import AttachesTool from "@editorjs/attaches";
// import SimpleImage from "@editorjs/simple-image";

// const dummyData = {
//   time: 1718069579642,
//   blocks: [
//     {
//       id: "l98dyx3yjb",
//       type: "header",
//       data: {
//         text: "Header예시",
//         level: 1,
//       },
//     },
//     {
//       id: "mhTl6ghSkV",
//       type: "paragraph",
//       data: {
//         text: "paragraph 더미",
//       },
//     },
//     {
//       id: "os_YI4eub4",
//       type: "list",
//       data: {
//         type: "unordered",
//         items: [
//           {
//             content: "와 대박",
//             items: [
//               { content: "진짜", items: [] },
//               { content: "잘 되어있구나", items: [] },
//             ],
//           },
//         ],
//       },
//     },
//     {
//       id: "1yKeXKxN7-",
//       type: "header",
//       data: {
//         text: "header level3",
//         level: 3,
//       },
//     },
//     {
//       id: "TcUNySG15P",
//       type: "paragraph",
//       data: {
//         text: "Workspace in classic editors is made of a single contenteditable element, used to create different HTML markups. Editor.js workspace consists of separate Blocks: paragraphs, headings, images, lists, quotes, etc. Each of them is an independent <sup data-tune='footnotes'>1</sup> contenteditable element (or more complex structure) provided by Plugin and united by Editor's Core.",
//       },
//       tunes: {
//         footnotes: [
//           "It works more stable then in other WYSIWYG editors. Same time it has smooth and well-known arrow navigation behavior like classic editors.",
//         ],
//       },
//     },
//     {
//       id: "KOcIofZ3Z1",
//       type: "paragraph",
//       data: {
//         text: "There are dozens of ready-to-use Blocks and a simple API <sup data-tune='footnotes'>2</sup> for creating any Block you need. For example, you can implement Blocks for Tweets, Instagram posts, surveys and polls, CTA buttons, and even games.",
//       },
//       tunes: {
//         footnotes: [
//           "Just take a look at our Creating Block Tool guide. You'll be surprised.",
//         ],
//       },
//     },
//     {
//       id: "ksCokKAhQw",
//       type: "paragraph",
//       data: {
//         text: "Classic WYSIWYG editors produce raw HTML-markup with both content data and content appearance. On the contrary, <mark class='cdx-marker'>Editor.js outputs JSON object</mark> with data of each Block.",
//       },
//     },
//     {
//       id: "XKNT99-qqS",
//       type: "attaches",
//       data: {
//         file: {
//           url: "https://drive.google.com/user/catalog/my-file.pdf",
//           size: 12902,
//           name: "file.pdf",
//           extension: "pdf",
//         },
//         title: "My file",
//       },
//     },
//     {
//       id: "hZAjSnqYMX",
//       type: "image",
//       data: {
//         url: "https://i.ytimg.com/vi/tbg3QAu-GnI/maxresdefault.jpg",
//         withBorder: false,
//         withBackground: false,
//         stretched: true,
//         caption: "고양이 사진 !  ",
//       },
//     },
//   ],
// };

export default function ViewEditor() {

    // const initEditor = new EditorJS({
    //     holder: "editorjs",
    //     readOnly: true,
    //     data: dummyData,
    //     tools: {
    //       header: Header,
    //       quote: Quote,
    //       table: Table,
    //       paragraph: Paragraph,
    //       list: {
    //         class: NestedList,
    //         inlineToolbar: true,
    //         config: {
    //           defaultStyle: "unordered",
    //         },
    //       },
    //       attaches: {
    //         class: AttachesTool,
    //         config: {
    //           endpoint: "http://localhost:8008/uploadFile",
    //         },
    //       },
    //       image: SimpleImage,
    //     },
    //   });

  return (<div id="viewEditor">
    <p>view Editor임</p>
  </div>);
}
