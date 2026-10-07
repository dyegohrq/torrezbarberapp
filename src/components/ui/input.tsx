import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-[4px] border border-[#262626] bg-[#1C1C1C] px-3 text-sm text-white outline-none placeholder:text-[#6B7280] focus:border-[#C5A059]",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full rounded-[4px] border border-[#262626] bg-[#1C1C1C] px-3 py-2 text-sm text-white outline-none placeholder:text-[#6B7280] focus:border-[#C5A059]",
        className,
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn(
        "text-[11px] font-bold tracking-[0.14em] text-[#C5A059] uppercase",
        className,
      )}
      {...props}
    />
  );
}
