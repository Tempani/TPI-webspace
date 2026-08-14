const PARTNERS = ["CHASE", "JOHN DEERE", "Leader", "Kubota", "GLEANER"] as const;

export function TrustedBy() {
  return (
    <section
      id="partners"
      className="border-y border-[#e6e9ee] bg-[#eef1f4] py-10 md:py-12"
    >
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        <p className="text-center text-sm text-[#5d6670] md:text-left">
          Trusted by the world&apos;s leading companies in the field.
        </p>
        <div className="mt-8 grid grid-cols-2 items-center gap-8 sm:grid-cols-3 md:grid-cols-5 md:gap-6">
          {PARTNERS.map((name) => (
            <div
              key={name}
              className="flex h-10 items-center justify-center text-center text-lg font-bold tracking-wide text-[#8a939e] grayscale md:text-xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
