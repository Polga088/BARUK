import { type ReactNode } from "react";
import Link from "next/link";

export function Hero({
  eyebrow,
  title,
  subtitle,
  children,
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`ui:relative ui:overflow-hidden ui:px-4 ui:py-24 md:ui:py-32 ${className}`}
    >
      <div className="ui:pointer-events-none ui:absolute ui:inset-0 ui:bg-[radial-gradient(circle_at_top,_rgba(196,105,74,0.12),_transparent_55%)]" />
      <div className="ui:relative ui:mx-auto ui:max-w-6xl">
        {eyebrow && (
          <p className="ui:text-xs ui:font-semibold ui:uppercase ui:tracking-[0.25em] ui:text-gold-600">
            {eyebrow}
          </p>
        )}
        <h1 className="ui:mt-4 ui:max-w-3xl ui:font-display ui:text-5xl ui:font-bold ui:leading-[1.1] ui:text-baruk-900 md:ui:text-6xl lg:ui:text-7xl">
          {title}
        </h1>
        {subtitle && (
          <p className="ui:mt-6 ui:max-w-2xl ui:text-lg ui:leading-relaxed ui:text-baruk-800/80">
            {subtitle}
          </p>
        )}
        {children && (
          <div className="ui:mt-10 ui:flex ui:flex-wrap ui:gap-4">{children}</div>
        )}
      </div>
    </section>
  );
}

export function FeatureCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon?: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="ui:group ui:block ui:rounded-2xl ui:border ui:border-baruk-200/60 ui:bg-cream-50 ui:p-6 ui:shadow-[var(--shadow-warm-sm)] ui:transition-all ui:duration-300 hover:ui:-translate-y-1 hover:ui:border-gold-500/40 hover:ui:shadow-[var(--shadow-warm-md)]"
    >
      {icon && (
        <div className="ui:mb-4 ui:flex ui:h-10 ui:w-10 ui:items-center ui:justify-center ui:rounded-xl ui:bg-baruk-600/10 ui:text-baruk-600">
          {icon}
        </div>
      )}
      <div className="ui:mb-2 ui:h-0.5 ui:w-6 ui:rounded-full ui:bg-gold-500 ui:transition-all group-hover:ui:w-10" />
      <h2 className="ui:font-display ui:text-xl ui:font-semibold ui:text-baruk-900">
        {title}
      </h2>
      <p className="ui:mt-2 ui:text-sm ui:leading-relaxed ui:text-baruk-800/70">
        {description}
      </p>
    </Link>
  );
}

export function MenuCard({
  name,
  description,
  price,
  imageUrl,
  className = "",
}: {
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  className?: string;
}) {
  return (
    <article
      className={`ui:group ui:overflow-hidden ui:rounded-2xl ui:border ui:border-baruk-200/50 ui:bg-cream-50 ui:shadow-[var(--shadow-warm-sm)] ui:transition-all hover:ui:border-gold-500/30 hover:ui:shadow-[var(--shadow-warm-md)] ${className}`}
    >
      <div className="ui:relative ui:aspect-[4/3] ui:overflow-hidden ui:bg-gradient-to-br ui:from-baruk-400 ui:to-baruk-600">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={name}
            className="ui:h-full ui:w-full ui:object-cover ui:transition-transform ui:duration-500 group-hover:ui:scale-105"
          />
        ) : (
          <div className="ui:flex ui:h-full ui:items-center ui:justify-center ui:font-display ui:text-2xl ui:text-white/80">
            {name.charAt(0)}
          </div>
        )}
        <div className="ui:absolute ui:inset-x-0 ui:bottom-0 ui:h-1/3 ui:bg-gradient-to-t ui:from-baruk-950/40 ui:to-transparent" />
      </div>
      <div className="ui:p-4">
        <div className="ui:flex ui:items-start ui:justify-between ui:gap-3">
          <h3 className="ui:font-display ui:text-lg ui:font-semibold ui:text-baruk-900">
            {name}
          </h3>
          <span className="ui:whitespace-nowrap ui:font-semibold ui:text-gold-600">
            {price.toFixed(0)} MAD
          </span>
        </div>
        {description && (
          <p className="ui:mt-1 ui:text-sm ui:text-baruk-800/65">{description}</p>
        )}
      </div>
    </article>
  );
}
