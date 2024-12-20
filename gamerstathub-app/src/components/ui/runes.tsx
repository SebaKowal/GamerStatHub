import Image from "next/image";
import { RunesProps } from "../interfaces";

export default function Runes({ runeIds, runeData }: RunesProps) {
  const baseUrl = "https://ddragon.leagueoflegends.com/cdn/img/";
  const selectedRunesIds = [runeIds[0], ...runeIds.slice(-3)];

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-2 gap-0.5">
        {selectedRunesIds.map((runeId) => {
          const rune = runeData[runeId];
          const iconUrl = rune ? `${baseUrl}${rune.icon}` : null;

          return (
            <div key={runeId} className="">
              {rune && iconUrl ? (
                <Image
                  src={iconUrl}
                  alt={rune.name}
                  width={26}
                  height={26}
                  className="rounded"
                />
              ) : (
                <div className="w-6 h-6 bg-gray-600 rounded" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
