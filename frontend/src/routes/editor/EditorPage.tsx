import Editor from "./component/Editor";
import Timer from "./component/Timer";

export default function EditorPage() {
  return (
    <>
      <div className="h-dvh">
        <nav className="bg-black h-4" />
        <div className="flex flex-col items-center">
          <input
            type="text"
            className="block w-11/12 p-4 text-4xl mb-4"
            placeholder="제목을 입력해주세요"
            maxLength={25}
          />

          <Timer />

          <Editor />
        </div>
        <footer className="bg-black h-14 sticky top-[100vh]" />
      </div>
    </>
  );
}
