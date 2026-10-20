import Image from "next/image";

export function BrandLogo({
  className = "h-10 w-auto",
  alt = "Torrez Barber",
}: {
  className?: string;
  alt?: string;
}) {
  return (
    <Image
      src="/image/TB_logo_fundo_removido.png"
      alt={alt}
      width={1184}
      height={1184}
      sizes="48px"
      className={className}
    />
  );
}
