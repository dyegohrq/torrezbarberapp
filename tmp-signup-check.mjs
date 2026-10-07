import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const env = {};
for (const line of readFileSync(new URL("./.env", import.meta.url), "utf8").split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const index = trimmed.indexOf("=");
  if (index < 0) continue;
  const key = trimmed.slice(0, index).trim();
  let value = trimmed.slice(index + 1).trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }
  env[key] = value;
}

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.log("missing env");
  process.exit(1);
}

const supabase = createClient(url, key);
const { data, error } = await supabase.auth.signUp({
  email: `cadastro.teste.${Date.now()}@example.com`,
  password: "Senha12345",
  options: { data: { full_name: "Teste Cadastro", phone: "83988887777" } },
});

console.log(
  JSON.stringify(
    {
      error: error
        ? { message: error.message, code: error.code, status: error.status }
        : null,
      hasUser: Boolean(data.user),
      hasSession: Boolean(data.session),
      identityCount: data.user?.identities?.length ?? null,
    },
    null,
    2,
  ),
);
