"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { signOut } from "@/app/_actions/sign-out";
import type { Profile } from "@/lib/content/types";

const links = [
  { href: "/#inicio", label: "Início" },
  { href: "/#servicos", label: "Serviços" },
  { href: "/#servicos", label: "Preço" },
  { href: "/#galeria", label: "Galeria" },
  { href: "/#quem-somos", label: "Quem somos" },
  { href: "/#localizacao", label: "Localização" },
];

export function SiteHeader({
  profile,
  onSchedule,
  overlay = false,
}: {
  profile: Profile | null;
  onSchedule?: () => void;
  overlay?: boolean;
}) {
  const headerRef = useRef<HTMLElement>(null);
  const ignoreCloseRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("Início");
  const [pastHero, setPastHero] = useState(false);

  useLayoutEffect(() => {
    if (!overlay) return;

    const hero = document.getElementById("hero");
    if (!hero) return;
    const heroElement = hero;

    function update() {
      const headerHeight = headerRef.current?.offsetHeight ?? 64;
      setPastHero(heroElement.getBoundingClientRect().bottom <= headerHeight);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [overlay]);

  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY;
    const { style } = document.body;
    const htmlStyle = document.documentElement.style;
    const previous = {
      position: style.position,
      top: style.top,
      left: style.left,
      right: style.right,
      width: style.width,
      overflow: style.overflow,
      htmlOverflow: htmlStyle.overflow,
    };

    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.left = "0";
    style.right = "0";
    style.width = "100%";
    style.overflow = "hidden";
    htmlStyle.overflow = "hidden";

    return () => {
      style.position = previous.position;
      style.top = previous.top;
      style.left = previous.left;
      style.right = previous.right;
      style.width = previous.width;
      style.overflow = previous.overflow;
      htmlStyle.overflow = previous.htmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  function handleOpen() {
    ignoreCloseRef.current = true;
    setOpen(true);
    window.setTimeout(() => {
      ignoreCloseRef.current = false;
    }, 400);
  }

  function handleClose() {
    if (ignoreCloseRef.current) return;
    setOpen(false);
  }

  function handleSchedule() {
    setOpen(false);
    onSchedule?.();
  }

  const solid = !overlay || pastHero;

  return (
    <header
      ref={headerRef}
      className={`top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
        overlay ? "fixed inset-x-0" : "sticky"
      } ${
        solid
          ? "border-[#262626] bg-[#141414]/95 backdrop-blur"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-300 items-center justify-between px-5 md:px-8 lg:px-12">
        <Link href="/#inicio" className="flex items-center gap-3">
          <img
            src="/image/TB_logo_fundo_removido.png"
            alt="Torrez Barber"
            className="h-10 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[11px] font-bold tracking-[0.14em] text-white uppercase hover:text-[#C5A059]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {profile?.role === "owner" ? (
            <Link
              href="/painel"
              className="text-xs tracking-[0.08em] text-[#C5A059] uppercase"
            >
              Painel
            </Link>
          ) : null}
          {profile ? (
            <>
              <Link
                href="/minha-agenda"
                className="text-xs tracking-[0.08em] text-white uppercase"
              >
                Minha agenda
              </Link>
              <SignOutButton className="text-xs tracking-[0.08em] text-[#9CA3AF] uppercase hover:text-white" />
            </>
          ) : (
            <Link
              href="/entrar"
              className="text-xs tracking-[0.08em] text-white uppercase"
            >
              Entrar
            </Link>
          )}
          {profile && onSchedule ? (
            <button
              type="button"
              onClick={handleSchedule}
              className="bg-[#C5A059] px-4 py-2 text-[12px] font-bold tracking-[0.08em] text-[#0D0D0D] uppercase hover:bg-[#D4AF37]"
            >
              Agendar
            </button>
          ) : (
            <Link
              href={profile ? "/agendar" : "/entrar?next=/agendar"}
              className="bg-[#C5A059] px-4 py-2 text-[12px] font-bold tracking-[0.08em] text-[#0D0D0D] uppercase hover:bg-[#D4AF37]"
            >
              Agendar
            </Link>
          )}
        </div>

        <button
          type="button"
          className="relative z-10 p-2 text-white lg:hidden"
          aria-label="Abrir menu"
          aria-expanded={open}
          onClick={handleOpen}
        >
          <Menu />
        </button>
      </div>

      {open
        ? createPortal(
        <div className="fixed inset-0 z-[80] h-dvh w-full overflow-hidden overscroll-none">
          <button
            type="button"
            aria-label="Fechar menu"
            className="absolute inset-0 bg-black/75"
            onClick={handleClose}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(100%,320px)] flex-col overflow-y-auto overscroll-contain bg-[#0D0D0D] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <div className="mb-8 flex items-center justify-between">
              <img
                src="/image/TB_logo_fundo_removido.png"
                alt=""
                className="h-12 w-auto"
              />
              <button
                type="button"
                aria-label="Fechar"
                onClick={handleClose}
              >
                <X className="text-white" />
              </button>
            </div>
            <nav className="flex flex-col gap-5">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => {
                    setActive(link.label);
                    setOpen(false);
                  }}
                  className={`text-sm font-bold tracking-[0.14em] uppercase ${
                    active === link.label ? "text-[#C5A059]" : "text-white"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-3">
              {profile?.role === "owner" ? (
                <Link
                  href="/painel"
                  onClick={() => setOpen(false)}
                  className="border border-[#C5A059] py-3 text-center text-sm font-bold tracking-[0.08em] text-[#C5A059] uppercase"
                >
                  Painel
                </Link>
              ) : null}
              {!profile ? (
                <Link
                  href="/entrar"
                  onClick={() => setOpen(false)}
                  className="border border-[#C5A059] py-3 text-center text-sm font-bold tracking-[0.08em] text-[#C5A059] uppercase"
                >
                  Entrar
                </Link>
              ) : null}
              {profile && onSchedule ? (
                <button
                  type="button"
                  onClick={handleSchedule}
                  className="bg-[#C5A059] py-3 text-sm font-bold tracking-[0.08em] text-[#0D0D0D] uppercase"
                >
                  Agendar
                </button>
              ) : (
                <Link
                  href={profile ? "/agendar" : "/entrar?next=/agendar"}
                  onClick={() => setOpen(false)}
                  className="bg-[#C5A059] py-3 text-center text-sm font-bold tracking-[0.08em] text-[#0D0D0D] uppercase"
                >
                  Agendar
                </Link>
              )}
              {profile ? (
                <SignOutButton className="text-left text-sm tracking-[0.08em] text-[#9CA3AF] uppercase hover:text-white" />
              ) : null}
            </div>
          </aside>
        </div>,
          document.documentElement,
        )
        : null}
    </header>
  );
}

function SignOutButton({ className }: { className: string }) {
  return (
    <form action={signOut}>
      <input type="hidden" name="next" value="/" />
      <button type="submit" className={className}>
        Sair
      </button>
    </form>
  );
}
