import { codeToHtml } from "shiki";
import { CopyButton } from "./copy-button";

export async function CodeBlock({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const html = await codeToHtml(code, {
    lang: language,
    theme: "github-dark",
  });

  return (
    <div className="group relative rounded-lg border border-border overflow-hidden">
      <div className="flex items-center justify-between bg-secondary px-4 py-2">
        <span className="text-xs font-mono text-muted-foreground">
          {language}
        </span>
        <CopyButton text={code} />
      </div>
      <div
        className="overflow-x-auto p-4 text-sm [&_pre]:!bg-transparent [&_code]:!bg-transparent"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
