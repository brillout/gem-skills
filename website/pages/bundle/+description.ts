import type { PageContextServer } from "vike/types";
import type { Data } from "./+data.ts";

export default (pageContext: PageContextServer) => {
  const { tldr, description } = (pageContext.data as Data).bundle;
  return tldr?.glance.length
    ? tldr.glance.map(({ label, text }) => `${label}: ${text}.`).join(" ")
    : description;
};
