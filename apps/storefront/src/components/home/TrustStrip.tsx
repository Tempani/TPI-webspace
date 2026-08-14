const PARTNERS = [
  "Atelier Nord",
  "Maison Vale",
  "Côte Estate",
  "Studio Linen",
  "Harbor Press",
];

export function TrustStrip() {
  return (
    <section className="border-y border-[var(--color-border)] bg-white">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-center gap-x-10 gap-y-4 px-5 py-8 md:px-10">
        <p className="w-full text-center text-[11px] uppercase tracking-[0.18em] text-[var(--color-muted)] md:w-auto md:text-left">
          Trusted by
        </p>
        {PARTNERS.map((name) => (
          <span
            key={name}
            className="font-[family-name:var(--font-serif)] text-lg text-[var(--color-ink)]/70"
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}
