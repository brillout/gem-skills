import { data, idPath } from "../../skills.ts";

/** One page per bundle. */
export const onBeforePrerenderStart = () => data.bundles.map((b) => `/bundle/${idPath(b.id)}/`);
