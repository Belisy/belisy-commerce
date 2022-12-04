import dynamic from "next/dynamic";
import { EditorProps } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { EditorState } from "draft-js";
import { Dispatch, SetStateAction } from "react";

// TODO: 디버깅 필요

// const Editor = dynamic<EditorProps>(
//   () => import("react-draft-wysiwyg").then((module) => module.Editor),
//   {
//     ssr: false,
//     loading: () => <p>Loading...</p>,
//   }
// );

// const Editor = dynamic<EditorProps>(
//   () => import("react-draft-wysiwyg").then((module) => module.Editor),
//   {
//     ssr: false, //ssr에서는 불러오지 않도록
//   }
// );

// const Editor = dynamic<EditorProps>(
//   () => import("react-draft-wysiwyg").then((module) => module.Editor),
//   { ssr: false }
// );

export default function CustomEditor({
  editorState,
  readOnly = false,
  onSave,
  onEditorStateChange,
}: {
  editorState: EditorState | undefined;
  readOnly?: boolean;
  onSave?: () => void;
  onEditorStateChange?: Dispatch<SetStateAction<EditorState | undefined>>;
}) {
  return (
    <div className="relative">
      <h1>디버깅 중입니다.</h1>
      {/* <Editor
        readOnly={readOnly}
        editorState={editorState}
        toolbarHidden={readOnly}
        toolbarClassName="editorToolbar-hidden"
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbar={{
          options: ["inline", "list", "textAlign", "link"],
        }}
        localization={{
          locale: "ko",
        }}
        onEditorStateChange={onEditorStateChange}
      /> */}
      {!readOnly && (
        <button
          className="px-2 my-3 absolute right-0 bg-gray-50 border rounded-md mb-5 shadow-sm focus:outline-none focus:border-pink-500 focus:ring-pink-500 focus:ring-1"
          onClick={onSave}
        >
          save
        </button>
      )}
    </div>
  );
}
