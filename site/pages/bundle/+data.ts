import { render } from "vike/abort";
import type { PageContextServer } from "vike/types";
import { bundleById } from "../../skills.ts";

export type Data = ReturnType<typeof data>;

export function data(pageContext: PageContextServer) {
  const id = decodeURIComponent(pageContext.routeParams["*"]).replace(/\/$/, "");
  const bundle = bundleById.get(id);
  if (!bundle) throw render(404);
  return { bundle };
}
