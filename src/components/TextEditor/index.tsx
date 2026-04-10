"use client";

import "react-quill-new/dist/quill.snow.css";
import type { FC } from "react";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";

import { Spinner } from "../ui/spinner";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center">
      <Spinner  />
    </div>
  ),
});

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["blockquote", "code-block"],
    [
      "link",
      // 'image'
    ],
    [{ align: [] }, { color: [] }, { background: [] }],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "code-block",
  "color",
  "background",
  "align",
];

interface TextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
}

const TextEditor: FC<TextEditorProps> = ({ value = "", onChange }) => {
  const [editorValue, setEditorValue] = useState<string>(value);
  const t = useTranslations("HomePage");

  const handleChange = (content: string) => {
    setEditorValue(content);
    onChange?.(content);
  };

  return (
    <ReactQuill
      theme="snow"
      value={editorValue}
      onChange={handleChange}
      modules={modules}
      formats={formats}
      placeholder={t("enterYourMessage")}
      className="w-[620px] h-[320px] rounded-md"
    />
  );
};

export default TextEditor;
