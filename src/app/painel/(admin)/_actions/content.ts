"use server";

import { revalidatePath } from "next/cache";
import { getSessionProfile } from "@/app/_data-access/get-public-content";
import {
  breakSchema,
  businessSchema,
  hoursSchema,
  productSchema,
  serviceSchema,
} from "@/lib/validators";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

async function ownerClient() {
  if (!hasSupabaseEnv()) return null;
  const profile = await getSessionProfile();
  if (profile?.role !== "owner") return null;
  return createClient();
}

function refresh() {
  revalidatePath("/");
  revalidatePath("/agendar");
  revalidatePath("/painel/conteudo");
}

export async function saveBusiness(input: unknown) {
  const parsed = businessSchema.safeParse(input);
  if (!parsed.success) return { success: false, message: "Revise os dados de contato." };

  const supabase = await ownerClient();
  if (!supabase) return { success: false, message: "Acesso restrito ao dono." };

  const { error } = await supabase
    .from("business_profile")
    .update({
      address: parsed.data.address,
      whatsapp: parsed.data.whatsapp,
      instagram_url: parsed.data.instagramUrl,
      map_embed_url: parsed.data.mapEmbedUrl,
    })
    .eq("id", 1);

  if (error) return { success: false, message: error.message };
  refresh();
  return { success: true, message: "Contato atualizado." };
}

export async function saveHours(input: unknown) {
  const parsed = hoursSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Horário inválido." };
  }

  const supabase = await ownerClient();
  if (!supabase) return { success: false, message: "Acesso restrito ao dono." };

  const { error } = await supabase
    .from("operating_hours")
    .update({
      is_open: parsed.data.isOpen,
      opens_at: parsed.data.isOpen ? parsed.data.opensAt : null,
      closes_at: parsed.data.isOpen ? parsed.data.closesAt : null,
    })
    .eq("weekday", parsed.data.weekday);

  if (error) return { success: false, message: error.message };
  refresh();
  return { success: true, message: "Funcionamento atualizado." };
}

export async function addBreak(input: unknown) {
  const parsed = breakSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Pausa inválida." };
  }

  const supabase = await ownerClient();
  if (!supabase) return { success: false, message: "Acesso restrito ao dono." };

  const { error } = await supabase.from("operating_breaks").insert({
    weekday: parsed.data.weekday,
    starts_at: parsed.data.startsAt,
    ends_at: parsed.data.endsAt,
  });

  if (error) return { success: false, message: error.message };
  refresh();
  return { success: true, message: "Pausa salva." };
}

export async function removeBreak(id: string) {
  const supabase = await ownerClient();
  if (!supabase) return { success: false, message: "Acesso restrito ao dono." };

  const { error } = await supabase.from("operating_breaks").delete().eq("id", id);
  if (error) return { success: false, message: error.message };
  refresh();
  return { success: true, message: "Pausa removida." };
}

export async function saveService(formData: FormData) {
  const parsed = serviceSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    durationMinutes: formData.get("durationMinutes"),
    isActive: formData.get("isActive") === "on",
  });
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Serviço inválido." };
  }

  const supabase = await ownerClient();
  if (!supabase) return { success: false, message: "Acesso restrito ao dono." };

  const file = formData.get("image");
  let imagePath = String(formData.get("currentImage") || "") || null;
  if (file instanceof File && file.size > 0) {
    const uploaded = await uploadImage(supabase, file, "services");
    if ("message" in uploaded) return { success: false, message: uploaded.message };
    imagePath = uploaded.path;
  }

  const payload = {
    name: parsed.data.name,
    description: parsed.data.description || null,
    price_cents: Math.round(parsed.data.price * 100),
    duration_minutes: parsed.data.durationMinutes,
    duration_is_provisional: false,
    is_active: parsed.data.isActive,
    image_path: imagePath,
  };

  const id = String(formData.get("id") || "");
  const query = id
    ? supabase.from("services").update(payload).eq("id", id)
    : supabase.from("services").insert(payload);

  const { error } = await query;
  if (error) return { success: false, message: error.message };
  refresh();
  return { success: true, message: "Serviço salvo." };
}

export async function replaceServiceImage(formData: FormData) {
  const id = String(formData.get("id") || "");
  const file = formData.get("image");
  if (!id) return { success: false, message: "Serviço inválido." };
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, message: "Escolha uma imagem." };
  }

  const supabase = await ownerClient();
  if (!supabase) return { success: false, message: "Acesso restrito ao dono." };

  const uploaded = await uploadImage(supabase, file, "services");
  if ("message" in uploaded) return { success: false, message: uploaded.message };

  const { error } = await supabase.from("services").update({ image_path: uploaded.path }).eq("id", id);
  if (error) return { success: false, message: error.message };
  refresh();
  return { success: true, message: "Imagem atualizada." };
}

export async function saveProduct(formData: FormData) {
  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    isActive: formData.get("isActive") === "on",
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Produto inválido." };
  }

  const supabase = await ownerClient();
  if (!supabase) return { success: false, message: "Acesso restrito ao dono." };

  const file = formData.get("image");
  let imagePath = String(formData.get("currentImage") || "") || null;
  if (file instanceof File && file.size > 0) {
    const uploaded = await uploadImage(supabase, file, "products");
    if ("message" in uploaded) return { success: false, message: uploaded.message };
    imagePath = uploaded.path;
  }

  const id = String(formData.get("id") || "");
  const payload = {
    name: parsed.data.name,
    description: parsed.data.description || null,
    price_cents: Math.round(parsed.data.price * 100),
    is_active: parsed.data.isActive,
    image_path: imagePath,
  };

  const query = id
    ? supabase.from("products").update(payload).eq("id", id)
    : supabase.from("products").insert(payload);
  const { error } = await query;
  if (error) return { success: false, message: error.message };
  refresh();
  return { success: true, message: "Produto salvo." };
}

export async function addPortfolio(formData: FormData) {
  const supabase = await ownerClient();
  if (!supabase) return { success: false, message: "Acesso restrito ao dono." };

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false, message: "Escolha uma imagem." };
  }

  const uploaded = await uploadImage(supabase, file, "portfolio");
  if ("message" in uploaded) return { success: false, message: uploaded.message };

  const { error } = await supabase.from("portfolio_items").insert({
    image_path: uploaded.path,
    caption: String(formData.get("caption") || "") || null,
    is_active: true,
  });

  if (error) return { success: false, message: error.message };
  refresh();
  return { success: true, message: "Foto publicada." };
}

export async function removePortfolio(id: string) {
  const supabase = await ownerClient();
  if (!supabase) return { success: false, message: "Acesso restrito ao dono." };

  const { error } = await supabase.from("portfolio_items").delete().eq("id", id);
  if (error) return { success: false, message: error.message };
  refresh();
  return { success: true, message: "Foto removida." };
}

async function uploadImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File,
  folder: string,
) {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type) || file.size > 5_242_880) {
    return { message: "Use JPG, PNG ou WebP de até 5 MB." };
  }

  const extension = file.type.split("/")[1] === "jpeg" ? "jpg" : file.type.split("/")[1];
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type,
  });

  if (error) return { message: error.message };

  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return { path: data.publicUrl };
}
