"use server";

import { createClient as createServiceClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { signInSchema, signUpSchema } from "@/lib/validators";
import { getSiteUrl, hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export type AuthState = {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

function safeNext(value: FormDataEntryValue | null): string {
  const next = String(value || "/");
  return next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

async function findSignupConflict(email: string, phone: string): Promise<string | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;

  const admin = createServiceClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const [{ data: emailRow }, { data: phoneRow }] = await Promise.all([
    admin.from("profiles").select("id").eq("email", email.toLowerCase()).maybeSingle(),
    admin.from("profiles").select("id").eq("phone", phone).maybeSingle(),
  ]);

  if (emailRow) return "Este e-mail já está cadastrado.";
  if (phoneRow) return "Este telefone já está cadastrado.";
  return null;
}

function signInErrorMessage(error: { code?: string; message: string; status?: number }): string {
  if (error.code === "email_not_confirmed") {
    return "Confirme o e-mail antes de entrar. Veja a caixa de entrada e o spam.";
  }
  if (error.code === "over_request_rate_limit" || error.status === 429) {
    return "Muitas tentativas. Espere um instante e tente de novo.";
  }
  if (error.code === "email_address_invalid") {
    return "Informe um e-mail válido.";
  }
  if (error.code === "invalid_credentials") {
    return "E-mail ou senha inválidos.";
  }
  return "Não foi possível entrar agora. Tente de novo.";
}

function signupErrorMessage(message: string): string {
  const text = message.toLowerCase();
  if (text.includes("already") || text.includes("registered")) {
    return "Este e-mail já está cadastrado.";
  }
  if (text.includes("phone") || text.includes("profiles_phone") || text.includes("database error saving new user")) {
    return "Este telefone já está cadastrado.";
  }
  if (text.includes("password")) {
    return "Escolha uma senha mais forte, com pelo menos 8 caracteres.";
  }
  if (text.includes("rate") || text.includes("only request this")) {
    return "Muitas tentativas. Espere um instante e tente de novo.";
  }
  return "Não foi possível criar a conta.";
}

export async function signInAction(_state: AuthState, formData: FormData): Promise<AuthState> {
  if (!hasSupabaseEnv()) {
    return { success: false, message: "Configure o Supabase para entrar." };
  }

  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email.toLowerCase(),
    password: parsed.data.password,
  });

  if (error) {
    return { success: false, message: signInErrorMessage(error) };
  }

  const next = safeNext(formData.get("next"));
  const pedido = String(formData.get("pedido") || "");
  redirect(pedido ? `${next}?pedido=${encodeURIComponent(pedido)}` : next);
}

export async function signUpAction(_state: AuthState, formData: FormData): Promise<AuthState> {
  if (!hasSupabaseEnv()) {
    return { success: false, message: "Configure o Supabase para criar a conta." };
  }

  const parsed = signUpSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const conflict = await findSignupConflict(parsed.data.email, parsed.data.phone);
  if (conflict) {
    return { success: false, message: conflict };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email.toLowerCase(),
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
        phone: parsed.data.phone,
      },
      emailRedirectTo: `${getSiteUrl()}/auth/callback`,
    },
  });

  if (error) {
    return { success: false, message: signupErrorMessage(error.message) };
  }

  if (data.user && (data.user.identities?.length ?? 0) === 0) {
    return {
      success: false,
      message: "Este e-mail já está cadastrado. Entre com a senha original ou redefina a senha.",
    };
  }

  const next = safeNext(formData.get("next"));
  const pedido = String(formData.get("pedido") || "");
  const destination = pedido ? `${next}?pedido=${encodeURIComponent(pedido)}` : next;

  if (data.session) {
    redirect(destination);
  }

  return {
    success: true,
    message: "Conta criada. Se o e-mail pedir confirmação, abra a mensagem e depois entre.",
  };
}

export async function requestPasswordReset(
  _state: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!hasSupabaseEnv()) {
    return { success: false, message: "Configure o Supabase para recuperar a senha." };
  }

  const email = String(formData.get("email") || "");
  const parsed = signInSchema.pick({ email: true }).safeParse({ email });

  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email.toLowerCase(), {
    redirectTo: `${getSiteUrl()}/auth/callback?next=/redefinir-senha`,
  });

  if (error) {
    return { success: false, message: "Não foi possível enviar o e-mail agora." };
  }

  return {
    success: true,
    message: "Se o e-mail existir, enviamos o link para redefinir a senha.",
  };
}

export async function updatePassword(
  _state: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const password = String(formData.get("password") || "");

  if (password.length < 8) {
    return { success: false, message: "A senha precisa ter pelo menos 8 caracteres." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { success: false, message: "Não foi possível atualizar a senha. Peça um novo link." };
  }

  redirect("/minha-agenda");
}

export async function signInOwnerAction(
  _state: AuthState,
  formData: FormData,
): Promise<AuthState> {
  if (!hasSupabaseEnv()) {
    return { success: false, message: "Configure o Supabase para entrar no painel." };
  }

  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email.toLowerCase(),
    password: parsed.data.password,
  });

  if (error || !data.user) {
    return {
      success: false,
      message: error ? signInErrorMessage(error) : "E-mail ou senha inválidos.",
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profile?.role !== "owner") {
    await supabase.auth.signOut();
    return { success: false, message: "Esta área é restrita ao dono da barbearia." };
  }

  redirect("/painel");
}
