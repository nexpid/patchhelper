import { useMemo, useRef, useState } from "react";
import Prism from "prismjs";

export default function Codeblock({
  text,
  language,
}: {
  text: string;
  language?: string;
}) {
  const otherTextTimeout = useRef<NodeJS.Timeout>();
  const [otherText, setOtherText] = useState(false);

  const lines = useMemo(() => {
    return language
      ? Prism.highlight(text, Prism.languages[language], language).split("\n")
      : text
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .split("\n");
  }, [text, language]);

  return (
    <pre
      className={`relative select-text rounded-[4px] mb-2 text-[#d4d4d4] font-code bg-[#1e1e1e] p-2 overflow-x-hidden whitespace-pre-wrap`}
    >
      <code>
        <table>
          <tbody>
            {lines.map((line, i) => (
              <tr key={i}>
                <td className="pl-1 pr-4 select-none align-top">{i + 1}</td>
                <td dangerouslySetInnerHTML={{ __html: line }}></td>
              </tr>
            ))}
          </tbody>
        </table>
      </code>
      <button
        className="absolute right-0 bottom-0 text-white text-sm px-2 py-[2px] bg-sky-800 rounded-sm font-text-xs-semibold hover-fade"
        onClick={() => {
          clearTimeout(otherTextTimeout.current);
          otherTextTimeout.current = setTimeout(() => {
            setOtherText(false);
          }, 1000);
          setOtherText(true);

          const textarea = document.createElement("textarea");
          textarea.appendChild(document.createTextNode(text));
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          document.execCommand("copy");
          textarea.remove();
        }}
      >
        {otherText ? "Copied!" : "Copy"}
      </button>
    </pre>
  );
}
