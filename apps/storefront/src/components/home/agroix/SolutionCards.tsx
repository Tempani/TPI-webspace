import Image from "next/image";

const CARDS = [
  {
    title: "Precision Crop Management",
    body: "Monitor canopy health, moisture, and nutrient signals so every input lands where it matters most.",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Smart Farm Automation",
    body: "Orchestrate irrigation, equipment schedules, and alerts from a single calm control surface.",
    image:
      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Sustainable Agriculture",
    body: "Grow with practices that protect soil biodiversity while keeping margins and yields resilient.",
    image:
      "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1200&q=80",
  },
] as const;

export function SolutionCards() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        <h2 className="max-w-3xl font-[family-name:var(--font-display)] text-3xl font-bold tracking-[-0.03em] text-[#152028] md:text-5xl md:leading-[1.1]">
          Smart Solutions for{" "}
          <em className="font-[family-name:var(--font-accent)] font-medium italic">
            Modern Farming
          </em>
        </h2>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {CARDS.map((card) => (
            <article
              key={card.title}
              className="group overflow-hidden rounded-[24px] bg-[#f3f5f7] transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-52 overflow-hidden md:h-56">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="space-y-3 p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#9fcf3a] text-[#163016]">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                      <path d="M12 3c4 3 6 6 6 9a6 6 0 1 1-12 0c0-3 2-6 6-9Z" />
                    </svg>
                  </span>
                  <h3 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#152028]">
                    {card.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-[#5d6670]">{card.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
