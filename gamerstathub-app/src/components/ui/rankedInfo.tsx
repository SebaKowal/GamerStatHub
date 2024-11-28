import Image from "next/image";
import { getTierIcon } from "@/components/ui/riot_icons";
import { RankedInfoProps } from "../interfaces";


export default function RankedInfo({ rankData, queueType, title, tierIcons }: RankedInfoProps) {
  const rankedData = rankData.filter((data) => data.queueType === queueType);

  return (
    <div className="flex flex-col bg-gray-800 rounded-lg p-6 mt-4">
      <div className="flex justify-center mb-2">
        <h2 className="text-white text-lg font-bold">{title}</h2>
      </div>
      {rankedData.length > 0 ? (
        <div className="flex flex-col">
          {rankedData.map((rankData, index) => (
            <div key={index} className="flex items-center border-b border-gray-700 pb-2 last:border-b-0">
              <Image
                className="w-24 h-24 object-cover rounded-full bg-gray-900 pt-2 mr-4"
                src={getTierIcon(rankData.tier, tierIcons)}
                alt={`${rankData.tier} icon`}
                width={56}
                height={56}
              />
              <div className="text-white">
                <p className="text-lg font-bold  overflow-hidden text-ellipsis">
                  {rankData.tier} {rankData.rank}
                </p>
                <p className="text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                  {rankData.leaguePoints} LP
                </p>
                <p className="text-xs whitespace-nowrap overflow-hidden text-ellipsis">
                  {rankData.wins} W / {rankData.losses} L
                </p>
                <p className="text-xs whitespace-nowrap overflow-hidden text-ellipsis">
                  W/R{" "}
                  {Math.round(
                    (rankData.wins / (rankData.wins + rankData.losses)) * 100
                  )}
                  %
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <Image
            className="w-24 h-24 object-cover rounded-full bg-gray-900 pt-2"
            src={getTierIcon("Unranked", tierIcons)}
            alt={`Unranked icon`}
            width={56}
            height={56}
          />
          <p className="text-sm text-gray-300 font-bold mt-2">Unranked</p>
        </div>
      )}
    </div>
  );
}
