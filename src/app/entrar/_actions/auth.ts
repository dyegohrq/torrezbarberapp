"use server";

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
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { success: false, message: "E-mail ou senha inválidos." };
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

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
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
    const text = error.message.toLowerCase();
    if (text.includes("already") || text.includes("registered")) {
      return { success: false, message: "Este e-mail já está cadastrado." };
    }
    if (text.includes("phone") || text.includes("profiles_phone")) {
      return { success: false, message: "Este telefone já está cadastrado." };
    }
    return { success: false, message: "Não foi possível criar a conta." };
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
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
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
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error || !data.user) {
    return { success: false, message: "E-mail ou senha inválidos." };
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
