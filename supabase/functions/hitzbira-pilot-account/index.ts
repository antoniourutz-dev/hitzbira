import { createAccountGateway } from "../_shared/account-gateway.ts";
const allowedOrigin=o=>o==="https://hitzbira.vercel.app"||o==="https://hitzbira-gramatika.vercel.app"||/^https:\/\/hitzbira-gramatika(?:-[a-z0-9-]+)?-antoniourutz-devs-projects\.vercel\.app$/.test(o);
Deno.serve(createAccountGateway(allowedOrigin));
