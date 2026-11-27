import { createAccountGateway } from "../_shared/account-gateway.ts";
import { vocabularyRelease } from "../_shared/vocabulary-release.ts";
const allowedOrigin = origin => origin === "https://hitzbira-git-feature-hitzbira-171a80-antoniourutz-devs-projects.vercel.app";
Deno.serve(createAccountGateway(allowedOrigin, vocabularyRelease));
