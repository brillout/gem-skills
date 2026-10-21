import { date, esc, href } from "../../format.ts";
import { skillsLink } from "../../list.ts";
import { GITHUB, data, tagChip } from "../../skills.ts";
import { skipped } from "../../types.ts";

export default function Page(): string {
  const n = data.skills.filter((s) => !skipped(data, s)).length;
  const tagged = (t: string) => data.skills.filter((s) => s.tags.includes(t)).length;
  const skips = data.skip
    .map(({ tag, note }) => `<li>${tagChip(tag, skillsLink({ tags: [tag] }))} ${esc(note)}</li>`)
    .join("");
  return `
    <div class="page">
      <h1>About</h1>
      <p class="lede">Gem Skills lists ${n} of the most popular agent skills, ranked by real usage and tagged by what they do, need and change.</p>
      <h2>How popularity is measured</h2>
      <ul>
        <li><strong>Installs</strong> are all-time installs on <a href="https://skills.sh">skills.sh</a>, Vercel's registry for the <code>npx skills</code> CLI, from its top 600 on ${date(data.snapshots.installs)}. They also give the weekly trend.</li>
        <li><strong>Downloads</strong> come from <a href="https://clawhub.ai">ClawHub</a>, the OpenClaw registry, and <a href="https://skillhub.cn">Tencent SkillHub</a>, on ${date(data.snapshots.downloads)}. They aren't comparable with skills.sh installs.</li>
        <li><strong>Stars</strong> belong to the GitHub repo behind a skill, collected on ${date(data.snapshots.stars)}.</li>
      </ul>
      <h2>Read the numbers with care</h2>
      <ul>
        <li><strong>Bundles share counts.</strong> skills.sh counts an install of a repo once per skill in it, so skills from one repo sit close together. Turn on <a href="${skillsLink({ one: true })}">One per repo</a> to see one skill per bundle.</li>
        <li><strong>Some skills are copies.</strong> ${tagged("flag:republished")} skills here are republished copies of another publisher's skill, with install counts far above their originals'. They carry <a href="${skillsLink({ tags: ["flag:republished"] })}"><code>flag:republished</code></a>.</li>
        <li><strong>Some skills are left out.</strong> The list skips ${data.skills.length - n} skills; <a href="${skillsLink({ all: true })}">Show all</a> brings them back, and their pages stay.
          <ul>${skips}<li>Skills gone from their source can no longer be installed.</li></ul>
        </li>
        <li><strong>CI installs count too</strong>, so skills wired into pipelines are over-represented.</li>
      </ul>
      <h2>Tags</h2>
      <p>Each skill has one type, one effect and one publisher, plus what it needs, its stack, one to five topics and any flags. The <a href="${href("tags/")}">Tags</a> page explains every value. Tags were assigned from each skill's SKILL.md on ${date(data.snapshots.tags)}. Eleven ClawHub and Tencent SkillHub skills were tagged from their registry description because their SKILL.md couldn't be read. <code>by:official</code> is conservative: unverified vendor claims count as community.</p>
      <h2>Data</h2>
      <p>Everything on this site comes from one file, <a href="${GITHUB}/blob/HEAD/skills.json">skills.json</a>. To add or correct a skill, edit it and open a pull request.</p>
      <p>Each skill's page shows a copy of its SKILL.md, from <a href="${GITHUB}/tree/HEAD/skill-md">skill-md/</a>. A daily job checks every SKILL.md at its source, except the skipped skills', and updates the copy when it changes.</p>
      <p>Sources: <a href="https://skills.sh">skills.sh</a> (installs, weekly trend), <a href="https://clawhub.ai">ClawHub</a> and <a href="https://skillhub.cn">Tencent SkillHub</a> (downloads), GitHub (stars), and <a href="https://dev.to/aws/the-most-popular-ai-coding-skills-right-now-4183">AWS's June 2026 survey</a> for two repos that aren't packaged as skills.</p>
      <p class="attribution">Star, ClawHub and SkillHub numbers: data from <a href="https://github.com/LinklyAI/best-skills">Best Skills</a> by <a href="https://x.com/BlueeonY">@BlueeonY</a>, <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.</p>
    </div>`;
}
