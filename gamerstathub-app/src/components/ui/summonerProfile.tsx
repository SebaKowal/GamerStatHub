import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchSummonerRankDataByPUUID } from "@/lib/riot/riotApiService";
import { getTierIcon, useTierIcons } from "@/components/ui/riot_icons";
import RankedInfo from "./rankedInfo";
import { SummonerProfileProps } from "../interfaces";

export default function SummonerProfile({
  summonerData,
  gamerInfo,
}: SummonerProfileProps) {
  const [summonerRankData, setSummonerRankData] = useState<any[]>([]);
  const tierIcons = useTierIcons();

  useEffect(() => {
    const fetchSummonerRankData = async () => {
      try {
        const rankData = await fetchSummonerRankDataByPUUID(summonerData.id);
        setSummonerRankData(rankData);
      } catch (err) {
        console.error("Error fetching summoner rank data:", err);
      }
    };

    fetchSummonerRankData();
  }, [summonerData]);

  return (
    <div className="flex flex-col items-center w-full lg:w-1/3 pt-8">
      <div className="pb-8">
        <div className="flex items-center bg-gray-800 rounded-lg pt-2 p-4 m-2">
          <Image
            className="w-14 h-14 mr-3 rounded-sm mt-2"
            src={`https://ddragon.leagueoflegends.com/cdn/12.18.1/img/profileicon/${summonerData.profileIconId}.png`}
            alt={`${gamerInfo.GameNick}'s Icon`}
            width={56}
            height={56}
          />
          <div className="text-white">
            <p className="text-lg font-bold">{gamerInfo.GameNick}</p>
            <p className="text-sm">#{gamerInfo.GameTag}</p>
            <p className="text-xs">Level: {summonerData.summonerLevel}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row lg:flex-col gap-4">
        <RankedInfo
          rankData={summonerRankData}
          queueType="RANKED_SOLO_5x5"
          title="SoloQ"
          tierIcons={tierIcons}
        />
        <RankedInfo
          rankData={summonerRankData}
          queueType="RANKED_FLEX_SR"
          title="Flex"
          tierIcons={tierIcons}
        />
      </div>
    </div>
  );
}
