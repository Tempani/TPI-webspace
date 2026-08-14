import type { Metadata } from "next";
import { AgroixHero } from "@/components/home/agroix/AgroixHero";
import { TrustedBy } from "@/components/home/agroix/TrustedBy";
import { MissionBand } from "@/components/home/agroix/MissionBand";
import { SmartSolutions } from "@/components/home/agroix/SmartSolutions";
import { MadeSimple } from "@/components/home/agroix/MadeSimple";
import { SolutionCards } from "@/components/home/agroix/SolutionCards";
import {
  FarmerStories,
  AgroixFooter,
} from "@/components/home/agroix/FarmerStories";

export const metadata: Metadata = {
  title: "Agroix — Smart Farming for Future Generations",
  description:
    "Practical agricultural technology for farmers, agribusinesses, and innovators — productivity with respect for the land.",
};

export default function HomePage() {
  return (
    <div className="agroix-home bg-white text-[#152028]">
      <AgroixHero />
      <TrustedBy />
      <MissionBand />
      <SmartSolutions />
      <MadeSimple />
      <SolutionCards />
      <FarmerStories />
      <AgroixFooter />
    </div>
  );
}
