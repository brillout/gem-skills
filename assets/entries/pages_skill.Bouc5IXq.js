import{t as e}from"../chunks/chunk-DK3Fl9T5.js";import{i as t,n,r,t as i}from"../chunks/chunk-BVY3ZfaF.js";import{A as a,C as o,D as s,E as c,F as l,N as u,P as d,T as f,_ as p,b as m,f as h,h as g,k as _,l as v,m as y,p as b,s as x,u as S,v as C,w}from"../chunks/chunk-CFpRM7XM.js";import{n as T}from"../chunks/chunk-QnCpk2e9.js";var E=e({default:()=>j});function D(e,{version:t}){let n=l(e);if(n)return`<a href="https://github.com/${r(n.repo)}/blob/${t}/${r(encodeURI(n.dir?`${n.dir}/SKILL.md`:`SKILL.md`))}">${r(n.repo)} at ${f(t)}</a>`;let i=e.id.split(`/`)[0],a=e[`clawhub.ai`];return i===`clawhub.ai`?`${a?.url?`<a href="${r(a.url)}">ClawHub</a>`:`ClawHub`}, version ${r(t)}`:i===`skillhub.cn`?`Tencent SkillHub, version ${r(t)}`:`<a href="https://${r(i)}/.well-known/skills/index.json">${r(i)}</a>, ${r(f(t))}`}function O(e){let t=l(e),i=t?o.get(t.repo):void 0,a=e[`skills.sh`],s=[];a?.installs!=null&&s.push(`<div><dt>Installs</dt><dd>${a.installs.toLocaleString(`en`)} <span class="muted">on skills.sh, ${n(g.asOf.installs)}</span></dd></div>`);for(let t of v){let i=e[t]?.downloads;i!==void 0&&s.push(`<div><dt>Downloads</dt><dd>${i.toLocaleString(`en`)} <span class="muted">on ${r(h[t])}, ${n(g.asOf.downloads)}</span></dd></div>`)}return i?.stars!=null&&s.push(`<div><dt>Repo stars</dt><dd>${i.stars.toLocaleString(`en`)} <span class="muted">${r(i.id)}</span></dd></div>`),a?.firstSeen&&s.push(`<div><dt>First seen</dt><dd>${n(a.firstSeen)} <span class="muted">on skills.sh</span></dd></div>`),`<dl class="facts">${s.join(``)}</dl>`}function k(e){let t=new Map;for(let n of u(e))t.set(C(n),[...t.get(C(n))??[],n]);return`<table class="tag-detail">${S.filter(e=>t.has(e)).map(e=>{let n=t.get(e)??[],i=e===`topic`||e===`stack`?[]:n.filter(e=>a.has(e));return`
      <tr>
        <th scope="row">${r(p.get(e)?.name??e)}</th>
        <td>
          <div class="tags">${n.map(e=>_(e,x({tags:[e]}))).join(``)}</div>
          ${i.map(e=>`<p class="tag-meaning">${r(a.get(e)??``)}</p>`).join(``)}
        </td>
      </tr>`}).join(``)}</table>`}function A(e){let t=y.get(e.id);if(!t)return``;let{bundle:n,index:i,standalone:a,note:o}=t,l=(e,t)=>{let i=n.skills[e]?.id;return i?` · ${t}: <a href="${s(i)}">${r(c.get(i)?.name??i)}</a>`:``};return`
    <p class="in-bundle">Skill ${i+1} of ${n.skills.length} in the <a href="${b(n.id)}">${r(n.name)}</a> bundle${l(i-1,`Before it`)}${l(i+1,`After it`)}</p>
    ${a?``:`<p class="note">Only works inside its bundle: ${r(o??``)} Install <a href="${b(n.id)}">${r(n.name)}</a> instead.</p>`}`}function j(e){let{skill:a,copy:o}=e.data,s=l(a),c=a[`skills.sh`],u=a[`clawhub.ai`],f=a.skillMd,p=f?.removed,h=p&&f?f.version:`HEAD`,_=[c?`<a href="${r(c.url)}">skills.sh page</a>`:``,u?.url?`<a href="${r(u.url)}">ClawHub page</a>`:``,s?`<a href="https://github.com/${r(s.repo)}${s.dir||p?`/tree/${h}/${r(encodeURI(s.dir))}`:``}">Source on GitHub</a>`:``,`<a href="${x({repo:w(a)})}">All skills from ${r(w(a))}</a>`].filter(Boolean),v=[c?.install,u?.install].filter(e=>!!e),S=y.get(a.id)?.bundle;return`
    <div class="page skill-page">
      <p class="crumbs"><a href="${t()}">Skills</a> <span aria-hidden="true">/</span> <a href="${x({repo:w(a)})}">${r(w(a))}</a>${S?` <span aria-hidden="true">/</span> <a href="${b(S.id)}">${r(S.name)}</a>`:``}</p>
      <h1>${r(a.name)}</h1>
      ${a.tldr?.glance.length?`<section class="at-a-glance" aria-label="At a glance">${m(a.tldr.glance)}</section>`:`<p class="lede">${r(a.description)}</p>`}
      ${A(a)}
      ${a.note?`<p class="note">${r(a.note)}</p>`:``}
      ${p?`<p class="note">Gone from ${s?r(s.repo):`its registry`} since ${n(p)}, so installing it no longer works. The SKILL.md below is its last version.</p>`:``}
      ${a.tldr?d(a.tldr,`the skill`,a.skillMd?.skew??0):``}
      <div class="details-grid">
        <div>
          ${v.length?v.map(e=>`<div class="install"><code>${r(e)}</code><button type="button" class="copy" data-copy="${r(e)}">Copy</button></div>`).join(``):`<p class="muted">No install command known for this registry.</p>`}
          <p class="links">${_.join(` · `)}</p>
          ${O(a)}
        </div>
        ${c?.weeklyInstalls?T(c.weeklyInstalls,g.asOf.installs,i):``}
      </div>
      ${k(a)}
      <section class="skill-md" aria-labelledby="skill-md">
        <h2 id="skill-md">SKILL.md</h2>
        ${o&&f?`<p class="muted">From ${D(a,f)}. Checked daily, last changed ${n(f.updated)}.</p>
        ${o.frontmatter?`<details class="frontmatter"><summary>Frontmatter</summary><pre><code>${r(o.frontmatter)}</code></pre></details>`:``}
        <div class="markdown">${o.html}</div>`:`<p class="muted">No copy of its SKILL.md yet.</p>`}
      </section>
    </div>`}var M={hasServerOnlyHook:{type:`computed`,definedAtData:null,valueSerialized:{type:`js-serialized`,value:!0}},isClientRuntimeLoaded:{type:`computed`,definedAtData:null,valueSerialized:{type:`js-serialized`,value:!1}},onBeforeRenderEnv:{type:`computed`,definedAtData:null,valueSerialized:{type:`js-serialized`,value:null}},dataEnv:{type:`computed`,definedAtData:null,valueSerialized:{type:`js-serialized`,value:{server:!0}}},guardEnv:{type:`computed`,definedAtData:null,valueSerialized:{type:`js-serialized`,value:null}},Page:{type:`standard`,definedAtData:{filePathToShowToUser:`/pages/skill/+Page.ts`,fileExportPathToShowToUser:[]},valueSerialized:{type:`plus-file`,exportValues:E}}};export{M as configValuesSerialized};