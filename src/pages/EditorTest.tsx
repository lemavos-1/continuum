import { useState } from "react";
import { TiptapEditor } from "@/components/TiptapEditor";

const EditorTest = () => {
  const [json, setJson] = useState<any>({ type: "doc", content: [{ type: "paragraph" }] });
  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <div data-testid="editor-wrap" className="max-w-2xl">
        <TiptapEditor content={json} onChange={setJson} />
      </div>
    </div>
  );
};

export default EditorTest;
