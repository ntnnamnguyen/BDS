interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <div className="mb-16 space-y-4">
      {subtitle ? (
        <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-luxury-stone">
          {subtitle}
        </p>
      ) : null}
      <h2 className="font-serif text-4xl text-luxury-ink md:text-5xl">
        {title}
      </h2>
      <div className="h-px w-12 bg-luxury-bronze" />
    </div>
  );
}
