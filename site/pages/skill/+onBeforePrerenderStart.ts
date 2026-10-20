import { data } from "../../skills.ts";

/** One page per skill. */
export const onBeforePrerenderStart = () =>
  data.skills.map((s) => `/skill/${s.id.split("/").map(encodeURIComponent).join("/")}/`);
