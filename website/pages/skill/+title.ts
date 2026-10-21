import type { PageContextServer } from "vike/types";
import type { Data } from "./+data.ts";

export default (pageContext: PageContextServer) =>
  `${(pageContext.data as Data).skill.name} · Gem Skills`;
