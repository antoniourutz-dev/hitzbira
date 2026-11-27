import { createAccountGateway } from "../_shared/account-gateway.ts";
import { vocabularyRelease } from "../_shared/vocabulary-release.ts";
const allowedOrigin = origin => ["https://hitzbira-git-feature-hitzbira-171a80-antoniourutz-devs-projects.vercel.app", "https://hitzbira-git-feature-guest-ac-cbff4f-antoniourutz-devs-projects.vercel.app"].includes(origin);
Deno.serve(createAccountGateway(allowedOrigin, vocabularyRelease));
