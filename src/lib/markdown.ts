export type MarkdownLiteBlock =
  | { type: "heading"; id: string; text: string }
  | { type: "list"; items: string[] }
  | { type: "paragraph"; lines: string[] };

function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function pushParagraph(buffer: string[], blocks: MarkdownLiteBlock[]) {
  if (buffer.length === 0) return;

  blocks.push({
    type: "paragraph",
    lines: [...buffer]
  });
  buffer.length = 0;
}

function pushList(buffer: string[], blocks: MarkdownLiteBlock[]) {
  if (buffer.length === 0) return;

  blocks.push({
    type: "list",
    items: [...buffer]
  });
  buffer.length = 0;
}

export function parseMarkdownLite(content: string): MarkdownLiteBlock[] {
  const lines = content.split(/\r?\n/).map((line) => line.trim());
  const blocks: MarkdownLiteBlock[] = [];
  const paragraphBuffer: string[] = [];
  const listBuffer: string[] = [];

  for (const line of lines) {
    if (!line) {
      pushParagraph(paragraphBuffer, blocks);
      pushList(listBuffer, blocks);
      continue;
    }

    if (line.startsWith("## ")) {
      pushParagraph(paragraphBuffer, blocks);
      pushList(listBuffer, blocks);

      const text = line.replace(/^##\s*/, "").trim();
      blocks.push({
        type: "heading",
        id: slugifyHeading(text),
        text
      });
      continue;
    }

    if (line.startsWith("- ")) {
      pushParagraph(paragraphBuffer, blocks);
      listBuffer.push(line.replace(/^-\s*/, "").trim());
      continue;
    }

    pushList(listBuffer, blocks);
    paragraphBuffer.push(line);
  }

  pushParagraph(paragraphBuffer, blocks);
  pushList(listBuffer, blocks);

  return blocks;
}

export function extractHeadings(content: string) {
  return parseMarkdownLite(content)
    .filter((block): block is Extract<MarkdownLiteBlock, { type: "heading" }> => block.type === "heading")
    .map(({ id, text }) => ({ id, text }));
}
