import Image from "next/image";
import Link from "next/link";

export function BarukLogo({
  variant = "header",
  className = "",
}: {
  variant?: "header" | "monogram" | "light";
  className?: string;
}) {
  if (variant === "monogram") {
    return (
      <Link href="/" className={`block ${className}`}>
        <Image
          src="/brand/logo-monogram.png"
          alt="BARUK"
          width={120}
          height={120}
          className="h-14 w-auto object-contain md:h-16"
          priority
        />
      </Link>
    );
  }

  const scriptColor = variant === "light" ? "text-baruk-400" : "text-baruk-600";
  const tagColor = variant === "light" ? "text-olive-300" : "text-olive-700";

  return (
    <Link href="/" className={`group flex flex-col ${className}`}>
      <span className={`font-brand text-3xl leading-none md:text-4xl ${scriptColor}`}>
        Baruk.
      </span>
      <span className={`mt-0.5 text-[9px] font-medium uppercase tracking-[0.35em] ${tagColor}`}>
        Fast Food du Cœur
      </span>
    </Link>
  );
}
