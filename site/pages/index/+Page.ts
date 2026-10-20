import { FRESH, listView } from "../../list.ts";

/** The skills list, unfiltered; ./+client.ts applies the filters in the URL. */
export default () => listView(FRESH);
