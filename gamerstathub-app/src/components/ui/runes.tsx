// /components/Runes.tsx

import Image from 'next/image';

interface RuneData {
  id: number;
  name: string;
  icon: string;
}

interface RunesProps {
  runeIds: number[];
  runeData: RuneData[];
}

export default function Runes({ runeIds, runeData }: RunesProps) {
  return (
    <div className="flex mt-2">
      {runeIds.map((runeId, idx) => {
        const rune = runeData.find((r) => r.id === runeId);
        return (
          <div key={idx} className="mr-2">
            {rune && (
              <>
                <Image
                  src={`https://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`}
                  alt={rune.name}
                  width={40}
                  height={40}
                />
                <p className="text-gray-400 text-xs">{rune.name}</p>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
