import { createAccountGateway } from "../_shared/account-gateway.ts";
import { vocabularyRelease } from "../_shared/vocabulary-release.ts";
const allowedOrigin = origin => origin === "https://hitzbira.vercel.app";
Deno.serve(createAccountGateway(allowedOrigin, vocabularyRelease));
