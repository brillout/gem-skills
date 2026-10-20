import type { Config, PageContextServer } from "vike/types";

export default {
  // Every page is HTML rendered at build time; the pages that need JavaScript add a +client.ts.
  prerender: true,
  trailingSlash: true,
  // GitHub Pages serves the site under the repo's name, such as /gemskills/.
  vite: { base: process.env.BASE ?? "/" },
  meta: {
    title: { env: { server: true } },
    description: { env: { server: true } },
  },
  title: "Gem Skills: popular agent skills, tagged",
  description:
    "Browse the most popular agent skills, ranked by installs and tagged by what they do, need and change.",
} satisfies Config;

type PerPage = string | ((pageContext: PageContextServer) => string);

declare global {
  namespace Vike {
    interface Config {
      /** The page's `<title>`. */
      title?: PerPage;
      /** The page's `<meta name="description">`. */
      description?: PerPage;
    }
  }
}
