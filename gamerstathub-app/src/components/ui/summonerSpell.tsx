// SummonerSpells.tsx
import Image from "next/image";
import { SpellData } from "@/lib/riot/riotApiService"; // Upewnij się, że ścieżka jest poprawna

interface SummonerSpellsProps {
  spellIds: string[];
  spellData: Record<string, SpellData>;
}

export default function SummonerSpells({
  spellIds,
  spellData,
}: SummonerSpellsProps) {
  return (
    <div className="flex flex-col gap-0.5">
      {spellIds.map((spellId) => {
        const spell = spellData[spellId];
        return (
          <div key={spellId} className="">
            {spell && (
              <Image className="rounded-sm"
                src={`https://ddragon.leagueoflegends.com/cdn/14.20.1/img/spell/${spell.image.full}`}
                alt={spell.name}
                width={26}
                height={26}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
