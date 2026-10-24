import{t as e}from"../chunks/chunk-DK3Fl9T5.js";import{n as t,r as n,t as r}from"../chunks/chunk-BVY3ZfaF.js";import{F as i,I as a,g as o,h as s,s as c}from"../chunks/chunk-CFpRM7XM.js";var l=e({default:()=>d}),u={skills:`Skills`,project:`Project`,index:`Index`};function d(){let e=new Map;for(let t of s.skills){let n=i(t)?.repo;n&&!a(s,t)&&e.set(n,[...e.get(n)??[],t])}let l=[...s.repos].sort((e,t)=>o(e.stars,t.stars)||e.id.localeCompare(t.id)).map(t=>{let i=e.get(t.id)??[];return`
        <tr>
          <td><a href="${n(t.url)}">${n(t.id)}</a></td>
          <td>${u[t.kind]}</td>
          <td class="num">${t.stars===null?`—`:r(t.stars)}</td>
          <td class="num">${i.length?`<a href="${c({repo:t.id})}">${i.length}</a>`:`—`}</td>
          <td class="num">${t.leaderboardSkills??`—`}</td>
          <td>${n(t.description??``)}${t.note?` <span class="muted">${n(t.note)}</span>`:``}</td>
        </tr>`}).join(``);return`
    <div class="page wide">
      <h1>Repos</h1>
      <p class="lede">The GitHub repositories behind the skills, plus notable skill repos that aren't on skills.sh. Stars count the whole repository and were collected on ${t(s.asOf.stars)}. For a project such as shadcn/ui, the skill is a small part of a much larger codebase. <em>Skills</em> repos exist to ship skills, <em>Project</em> repos ship a skill alongside a product, and <em>Index</em> repos list other skills.</p>
      <div class="table-scroll">
        <table class="repo-table">
          <thead><tr><th scope="col">Repository</th><th scope="col">Kind</th><th scope="col">Stars</th><th scope="col">Listed here</th><th scope="col" title="Skills in the skills.sh all-time top 600 on ${t(s.asOf.installs)}">In top 600</th><th scope="col">About</th></tr></thead>
          <tbody>${l}</tbody>
        </table>
      </div>
    </div>`}var f={hasServerOnlyHook:{type:`computed`,definedAtData:null,valueSerialized:{type:`js-serialized`,value:!1}},isClientRuntimeLoaded:{type:`computed`,definedAtData:null,valueSerialized:{type:`js-serialized`,value:!1}},onBeforeRenderEnv:{type:`computed`,definedAtData:null,valueSerialized:{type:`js-serialized`,value:null}},dataEnv:{type:`computed`,definedAtData:null,valueSerialized:{type:`js-serialized`,value:null}},guardEnv:{type:`computed`,definedAtData:null,valueSerialized:{type:`js-serialized`,value:null}},Page:{type:`standard`,definedAtData:{filePathToShowToUser:`/pages/repos/+Page.ts`,fileExportPathToShowToUser:[]},valueSerialized:{type:`plus-file`,exportValues:l}}};export{f as configValuesSerialized};