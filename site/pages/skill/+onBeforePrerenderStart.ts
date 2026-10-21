import { data, idPath } from "../../skills.ts";

/** One page per skill. */
export const onBeforePrerenderStart = () => data.skills.map((s) => `/skill/${idPath(s.id)}/`);
