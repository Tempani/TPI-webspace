import Image from "next/image";

const SUNSET =
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=80";

const FEATURES = [
  { label: "Real-time Data", path: "M4 12h4l2-6 4 12 2-6h4" },
  { label: "Smart Planning", path: "M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" },
  { label: "Pest Control", path: "M12 4v4M8 8h8M7 12h10l-1 8H8l-1-8Zm2-4 2-3 2 3" },
  { label: "Soil Analysis", path: "M12 20c0-6 3-10 8-12-1 5-4 8-8 9-4-1-7-4-8-9 5 2 8 6 8 12Z" },
] as const;

const STATS = [
  { value: "1.5M+", label: "Acres Monitored" },
  { value: "500K+", label: "Farmers Connected" },
  { value: "2M+", label: "Farm Decisions Optimized" },
  { value: "750K+", label: "Total Yield" },
] as const;

export function MadeSimple() {
  return (
    <section className="bg-[#f3f5f7] py-20 md:py-28">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-[-0.03em] text-[#152028] md:text-5xl md:leading-[1.1]">
            Smart Farming{" "}
            <em className="font-[family-name:var(--font-accent)] font-medium italic">
              Made Simple
            </em>
          </h2>
          <p className="text-sm leading-relaxed text-[#5d6670] md:text-base">
            From field sensors to harvest planning, Agroix brings clarity to every
            decision — so you spend less time in spreadsheets and more time growing.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3 md:gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.label}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-[#152028] shadow-sm"
            >
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e8f5c4] text-[#3d5c12]"
                aria-hidden
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d={f.path} />
                </svg>
              </span>
              {f.label}
            </div>
          ))}
        </div>

        <div className="relative mt-10 overflow-hidden rounded-[28px]">
          <div className="relative min-h-[340px] md:min-h-[480px]">
            <Image
              src={SUNSET}
              alt="Farmer overlooking fields at golden hour"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/35" />
          </div>

          <div className="absolute right-4 top-1/2 w-[min(100%-2rem,320px)] -translate-y-1/2 rounded-2xl bg-white/95 p-4 shadow-2xl backdrop-blur md:right-10 md:w-[340px] md:p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#152028]">Smart Farm Dashboard</p>
              <span className="rounded-full bg-[#e8f5c4] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#3d5c12]">
                Live
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#f3f5f7] p-3">
                <p className="text-[11px] text-[#5d6670]">Temperature</p>
                <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold text-[#152028]">
                  24°C
                </p>
              </div>
              <div className="rounded-xl bg-[#f3f5f7] p-3">
                <p className="text-[11px] text-[#5d6670]">Soil Moisture</p>
                <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold text-[#152028]">
                  62%
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-[#f3f5f7] p-3">
              <p className="text-[11px] text-[#5d6670]">Growth trend</p>
              <div className="mt-3 flex h-16 items-end gap-1.5">
                {[35, 48, 42, 60, 55, 72, 68, 80, 76, 88].map((h, i) => (
                  <span
                    key={i}
                    className="flex-1 rounded-t bg-gradient-to-t from-[#6fa32a] to-[#b6d93b]"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-6 border-t border-[#dde2e8] pt-10 md:grid-cols-4 md:gap-8">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-[#152028] md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-[#5d6670]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
