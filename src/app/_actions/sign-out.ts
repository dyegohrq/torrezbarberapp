"use server";

import { redirect } from "next/navigation";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export async function signOut(formData: FormData) {
  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }

  const next = String(formData.get("next") || "/");
  redirect(next.startsWith("/") ? next : "/");
}
