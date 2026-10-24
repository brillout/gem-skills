import{t as e}from"../chunks/chunk-DK3Fl9T5.js";import{i as t,n,r}from"../chunks/chunk-BVY3ZfaF.js";import{I as i,d as a,h as o,k as s,p as c,s as l}from"../chunks/chunk-CFpRM7XM.js";var u=e({default:()=>d});function d(){let e=o.skills.filter(e=>!i(o,e)).length,u=e=>o.skills.filter(t=>t.tags.includes(e)).length,d=o.skip.map(({tag:e,note:t})=>`<li>${s(e,l({tags:[e]}))} ${r(t)}</li>`).join(``);return`
    <div class="page">
      <h1>About</h1>
      <p class="lede">Gem Skills lists ${e} of the most popular agent skills, ranked by real usage and tagged by what they do, need and change.</p>
      <h2>How popularity is measured</h2>
      <ul>
        <li><strong>Installs</strong> are all-time installs on <a href="https://skills.sh">skills.sh</a>, Vercel's registry for the <code>npx skills</code> CLI, from its top 600 on ${n(o.asOf.installs)}. They also give the weekly trend.</li>
        <li><strong>Downloads</strong> come from <a href="https://clawhub.ai">ClawHub</a>, the OpenClaw registry, and <a href="https://skillhub.cn">Tencent SkillHub</a>, on ${n(o.asOf.downloads)}. They aren't comparable with skills.sh installs.</li>
        <li><strong>Stars</strong> belong to the GitHub repo behind a skill, collected on ${n(o.asOf.stars)}.</li>
      </ul>
      <h2>Read the numbers with care</h2>
      <ul>
        <li><strong>Skills of one repo share counts.</strong> skills.sh counts an install of a repo once per skill in it, so skills from one repo sit close together. Turn on <a href="${l({one:!0})}">One per repo</a> to see one entry per repo.</li>
        <li><strong>Some skills are copies.</strong> ${u(`flag:republished`)} skills here are republished copies of another publisher's skill, with install counts far above their originals'. They carry <a href="${l({tags:[`flag:republished`]})}"><code>flag:republished</code></a>.</li>
        <li><strong>Some skills are left out.</strong> The list skips ${o.skills.length-e} skills; <a href="${l({all:!0})}">Show all</a> brings them back, and their pages stay.
          <ul>${d}<li>Skills gone from their source can no longer be installed.</li></ul>
        </li>
        <li><strong>CI installs count too</strong>, so skills wired into pipelines are over-represented.</li>
      </ul>
      <h2>Bundles</h2>
      <p>Some repos ship skills meant to be used together, such as the steps of a workflow: ${o.bundles.map(e=>`<a href="${c(e.id)}">${r(e.name)}</a>`).join(`, `)}. A bundle gets one entry, with its skills inside in the order they're used. A skill that also works alone keeps its own entry, with a link to its bundle; one that needs the rest of the bundle is only listed inside it. A bundle's installs are those of its most installed skill.</p>
      <h2>Tags</h2>
      <p>Each skill has one or more categories, one type, one effect and one publisher, plus what it needs, its stack, one to five topics and any flags. The <a href="${t(`tags/`)}">Tags</a> page explains every value. Tags were assigned from each skill's SKILL.md on ${n(o.asOf.tags)}. Eleven ClawHub and Tencent SkillHub skills were tagged from their registry description because their SKILL.md couldn't be read. <code>by:official</code> is conservative: unverified vendor claims count as community.</p>
      <h2>Data</h2>
      <p>Everything on this site comes from one file, <a href="${a}/blob/HEAD/data/skills.json">skills.json</a>. To add or correct a skill, edit it and open a pull request.</p>
      <p>Each skill's page shows a copy of its SKILL.md, from <a href="${a}/tree/HEAD/data/skill-snapshots">data/skill-snapshots/</a>. A daily job checks every SKILL.md at its source, except the skipped skills', and updates the copy when it changes.</p>
      <p>Sources: <a href="https://skills.sh">skills.sh</a> (installs, weekly trend), <a href="https://clawhub.ai">ClawHub</a> and <a href="https://skillhub.cn">Tencent SkillHub</a> (downloads), GitHub (stars), and <a href="https://dev.to/aws/the-most-popular-ai-coding-skills-right-now-4183">AWS's June 2026 survey</a> for two repos that aren't packaged as skills.</p>
      <p class="attribution">Star, ClawHub and SkillHub numbers: data from <a href="https://github.com/LinklyAI/best-skills">Best Skills</a> by <a href="https://x.com/BlueeonY">@BlueeonY</a>, <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.</p>
    </div>`}var f={hasServerOnlyHook:{type:`computed`,definedAtData:null,valueSerialized:{type:`js-serialized`,value:!1}},isClientRuntimeLoaded:{type:`computed`,definedAtData:null,valueSerialized:{type:`js-serialized`,value:!1}},onBeforeRenderEnv:{type:`computed`,definedAtData:null,valueSerialized:{type:`js-serialized`,value:null}},dataEnv:{type:`computed`,definedAtData:null,valueSerialized:{type:`js-serialized`,value:null}},guardEnv:{type:`computed`,definedAtData:null,valueSerialized:{type:`js-serialized`,value:null}},Page:{type:`standard`,definedAtData:{filePathToShowToUser:`/pages/about/+Page.ts`,fileExportPathToShowToUser:[]},valueSerialized:{type:`plus-file`,exportValues:u}}};export{f as configValuesSerialized};