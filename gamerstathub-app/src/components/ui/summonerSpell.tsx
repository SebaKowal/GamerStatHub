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
    <div className="flex mt-2">
      {spellIds.map((spellId) => {
        const spell = spellData[spellId];
        return (
          <div key={spellId} className="mr-2">
            {spell && (
              <Image
                src={`https://ddragon.leagueoflegends.com/cdn/14.20.1/img/spell/${spell.image.full}`}
                alt={spell.name}
                width={40}
                height={40}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
