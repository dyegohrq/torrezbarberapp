import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Torrezbarber | Barbearia no Valentina, João Pessoa",
  description:
    "Barbearia no Valentina, João Pessoa — PB. Serviços, preços, portfólio e agendamento no site. Rua José de Oliveira Batista, 116.",
  icons: { icon: "/image/TB_logo_fundo_removido.png" },
  openGraph: {
    title: "Torrezbarber | Barbearia no Valentina",
    description:
      "Cortes masculinos, barba e agendamento com horário marcado em João Pessoa.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={cn("dark h-full antialiased", sans.variable, display.variable)}
    >
      <body className="min-h-full bg-[#131313] font-sans text-[#E5E5E5]">{children}</body>
    </html>
  );
}
