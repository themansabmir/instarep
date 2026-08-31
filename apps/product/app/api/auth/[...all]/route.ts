import { toNextJsHandler } from "better-auth/next-js";

import { getAuth } from "@repo/auth/server";

const handler = toNextJsHandler(getAuth());

export const { GET, POST } = handler;
