import { href } from "../../format.ts";

export default () => `
  <div class="page">
    <h1>Page not found</h1>
    <p class="lede">There's no page at this address. <a href="${href()}">Browse the skills</a>.</p>
  </div>`;
