/** Render a skill's SKILL.md for its page. Raw HTML in it shows as text and never runs. */

import MarkdownIt from "markdown-it";

/** Where a relative link or image in the SKILL.md points, or null to drop it. */
export type Rebase = ((url: string, image: boolean) => string) | null;

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)/;
const ABSOLUTE = /^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i;

export function renderSkillMd(
  text: string,
  rebase: Rebase,
): { frontmatter: string | null; html: string } {
  const md = new MarkdownIt({ html: false, linkify: true });
  md.core.ruler.push("skill_md", (state) => {
    for (const token of state.tokens) {
      // The page has its own h1 and h2: the SKILL.md's headings sit below them.
      if (token.type === "heading_open" || token.type === "heading_close")
        token.tag = `h${Math.min(6, Number(token.tag.slice(1)) + 2)}`;
      for (const child of token.children ?? []) {
        const attr = child.type === "link_open" ? "href" : child.type === "image" ? "src" : null;
        const url = attr ? child.attrGet(attr) : null;
        if (!attr || typeof url !== "string" || !url || ABSOLUTE.test(url)) continue;
        if (rebase) child.attrSet(attr, rebase(url, attr === "src"));
        else child.attrs = (child.attrs ?? []).filter(([name]) => name !== attr);
      }
    }
  });
  const m = FRONTMATTER.exec(text);
  return { frontmatter: m ? m[1] : null, html: md.render(m ? text.slice(m[0].length) : text) };
}
