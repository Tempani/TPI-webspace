import Image from "next/image";
import Link from "next/link";

const STORIES = [
  {
    quote:
      "Agroix turned scattered field notes into decisions we trust. Irrigation alone paid for itself in one season.",
    name: "Michael Stevens",
    role: "Wheat grower, Iowa",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  },
  {
    quote:
      "The dashboard is calm and clear. My team finally shares one picture of moisture, pests, and yield outlook.",
    name: "Scott Wilson",
    role: "Orchard manager, California",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
  },
  {
    quote:
      "We scaled from two parcels to twelve without losing the feel of hands-on farming. That balance matters.",
    name: "Elena Ruiz",
    role: "Cooperative lead, Spain",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
  },
] as const;

export function FarmerStories() {
  return (
    <section id="stories" className="bg-[#f3f5f7] py-20 md:py-28">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        <h2 className="max-w-3xl font-[family-name:var(--font-display)] text-3xl font-bold tracking-[-0.03em] text-[#152028] md:text-5xl md:leading-[1.1]">
          Real Stories Shared by{" "}
          <em className="font-[family-name:var(--font-accent)] font-medium italic">
            Our Farmers
          </em>
        </h2>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {STORIES.map((story) => (
            <blockquote
              key={story.name}
              className="flex h-full flex-col rounded-[24px] bg-white p-7 shadow-sm"
            >
              <span
                className="font-[family-name:var(--font-accent)] text-5xl leading-none text-[#9fcf3a]"
                aria-hidden
              >
                “
              </span>
              <p className="mt-2 flex-1 text-[15px] leading-relaxed text-[#3a4450]">
                {story.quote}
              </p>
              <footer className="mt-8 flex items-center gap-3 border-t border-[#eef1f4] pt-5">
                <div className="relative h-11 w-11 overflow-hidden rounded-full">
                  <Image
                    src={story.avatar}
                    alt={story.name}
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#152028]">{story.name}</p>
                  <p className="text-xs text-[#5d6670]">{story.role}</p>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AgroixFooter() {
  return (
    <footer id="contact" className="bg-[#0f1c14] py-16 text-white">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-10 px-5 md:flex-row md:items-end md:justify-between md:px-8">
        <div>
          <p className="font-[family-name:var(--font-display)] text-2xl font-semibold">
            Agroix
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
            Smart farming for future generations — practical tools for land,
            yield, and lasting stewardship.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/shop"
            className="rounded-full bg-[#b6d93b] px-5 py-2.5 text-sm font-semibold text-[#142014]"
          >
            Explore Products
          </Link>
          <Link
            href="/account/login"
            className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Sign in
          </Link>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-[1240px] border-t border-white/10 px-5 pt-6 text-xs text-white/50 md:px-8">
        © {new Date().getFullYear()} Agroix. All rights reserved.
      </div>
    </footer>
  );
}
