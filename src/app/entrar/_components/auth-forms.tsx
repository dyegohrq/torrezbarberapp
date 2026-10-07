"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  requestPasswordReset,
  signInAction,
  signInOwnerAction,
  signUpAction,
  updatePassword,
  type AuthState,
} from "@/app/entrar/_actions/auth";
import { Input, Label } from "@/components/ui/input";
import { signInSchema, signUpSchema } from "@/lib/validators";

const initial: AuthState = { success: false };

export function SignInForm({ next = "/", pedido = "" }: { next?: string; pedido?: string }) {
  const form = useForm<z.input<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });
  const [message, setMessage] = useState("");

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        const data = new FormData();
        data.set("email", values.email);
        data.set("password", values.password);
        data.set("next", next);
        data.set("pedido", pedido);
        const result = await signInAction(initial, data);
        setMessage(result.message ?? "");
      })}
    >
      <Field label="E-mail" error={form.formState.errors.email?.message}>
        <Input type="email" autoComplete="email" {...form.register("email")} />
      </Field>
      <Field label="Senha" error={form.formState.errors.password?.message}>
        <Input type="password" autoComplete="current-password" {...form.register("password")} />
      </Field>
      {message ? <p className="text-sm text-[#ffb4ab]">{message}</p> : null}
      <button className="w-full bg-[#C5A059] py-3 text-sm font-bold tracking-[0.08em] text-[#0D0D0D] uppercase" type="submit">
        Entrar
      </button>
      <div className="flex justify-between text-sm">
        <Link href="/cadastro" className="text-[#C5A059]">Criar conta</Link>
        <Link href="/recuperar-senha" className="text-[#9CA3AF]">Esqueci a senha</Link>
      </div>
    </form>
  );
}

export function SignUpForm({ next = "/", pedido = "" }: { next?: string; pedido?: string }) {
  const form = useForm<z.input<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { fullName: "", email: "", phone: "", password: "" },
  });
  const [message, setMessage] = useState("");

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        const data = new FormData();
        data.set("fullName", values.fullName);
        data.set("email", values.email);
        data.set("phone", values.phone);
        data.set("password", values.password);
        data.set("next", next);
        data.set("pedido", pedido);
        const result = await signUpAction(initial, data);
        setMessage(result.message ?? "");
      })}
    >
      <Field label="Nome" error={form.formState.errors.fullName?.message}>
        <Input autoComplete="name" {...form.register("fullName")} />
      </Field>
      <Field label="Telefone" error={form.formState.errors.phone?.message}>
        <Input autoComplete="tel" placeholder="(83) 90000-0000" {...form.register("phone")} />
      </Field>
      <Field label="E-mail" error={form.formState.errors.email?.message}>
        <Input type="email" autoComplete="email" {...form.register("email")} />
      </Field>
      <Field label="Senha" error={form.formState.errors.password?.message}>
        <Input type="password" autoComplete="new-password" {...form.register("password")} />
      </Field>
      {message ? <p className="text-sm text-[#E5E5E5]">{message}</p> : null}
      <button className="w-full bg-[#C5A059] py-3 text-sm font-bold tracking-[0.08em] text-[#0D0D0D] uppercase" type="submit">
        Criar conta
      </button>
      <Link href="/entrar" className="block text-sm text-[#C5A059]">Já tenho conta</Link>
    </form>
  );
}

export function ResetForm() {
  const form = useForm<{ email: string }>({
    resolver: zodResolver(signInSchema.pick({ email: true })),
    defaultValues: { email: "" },
  });
  const [message, setMessage] = useState("");

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        const data = new FormData();
        data.set("email", values.email);
        const result = await requestPasswordReset(initial, data);
        setMessage(result.message ?? "");
      })}
    >
      <Field label="E-mail" error={form.formState.errors.email?.message}>
        <Input type="email" {...form.register("email")} />
      </Field>
      {message ? <p className="text-sm text-[#E5E5E5]">{message}</p> : null}
      <button className="w-full bg-[#C5A059] py-3 text-sm font-bold tracking-[0.08em] text-[#0D0D0D] uppercase" type="submit">
        Enviar link
      </button>
    </form>
  );
}

export function NewPasswordForm() {
  const form = useForm<{ password: string }>({ defaultValues: { password: "" } });
  const [message, setMessage] = useState("");

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        const data = new FormData();
        data.set("password", values.password);
        const result = await updatePassword(initial, data);
        setMessage(result.message ?? "");
      })}
    >
      <Field label="Nova senha">
        <Input type="password" {...form.register("password", { minLength: 8 })} />
      </Field>
      {message ? <p className="text-sm text-[#ffb4ab]">{message}</p> : null}
      <button className="w-full bg-[#C5A059] py-3 text-sm font-bold tracking-[0.08em] text-[#0D0D0D] uppercase" type="submit">
        Salvar senha
      </button>
    </form>
  );
}

export function OwnerSignInForm({ denied = false }: { denied?: boolean }) {
  const form = useForm<z.input<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });
  const [message, setMessage] = useState(denied ? "Esta área é restrita ao dono da barbearia." : "");

  return (
    <form
      className="space-y-4"
      onSubmit={form.handleSubmit(async (values) => {
        const data = new FormData();
        data.set("email", values.email);
        data.set("password", values.password);
        const result = await signInOwnerAction(initial, data);
        setMessage(result.message ?? "");
      })}
    >
      <Field label="E-mail" error={form.formState.errors.email?.message}>
        <Input type="email" {...form.register("email")} />
      </Field>
      <Field label="Senha" error={form.formState.errors.password?.message}>
        <Input type="password" {...form.register("password")} />
      </Field>
      {message ? <p className="text-sm text-[#ffb4ab]">{message}</p> : null}
      <button className="w-full bg-[#C5A059] py-3 text-sm font-bold tracking-[0.08em] text-[#0D0D0D] uppercase" type="submit">
        Entrar no painel
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-sm text-[#ffb4ab]">{error}</p> : null}
    </div>
  );
}

export function AuthCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-16">
      <p className="text-[11px] font-bold tracking-[0.14em] text-[#C5A059] uppercase">Torrezbarber</p>
      <h1 className="font-display mt-2 text-4xl text-white">{title}</h1>
      <div className="mt-8">{children}</div>
    </main>
  );
}
