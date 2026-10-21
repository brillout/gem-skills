/** A skill's page: copy buttons, and the weekly-installs sparkline. */

import { mountCopyButtons } from "../../copy.ts";
import { mountSparklines } from "../../sparkline.ts";

mountSparklines(document);
mountCopyButtons();
