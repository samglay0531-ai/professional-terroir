import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ cacheDir: '/Users/chenchewei/professional-terroir/tina/__generated__/.cache/1776418975267', url: 'http://localhost:4001/graphql', token: '', queries,  });
export default client;
  