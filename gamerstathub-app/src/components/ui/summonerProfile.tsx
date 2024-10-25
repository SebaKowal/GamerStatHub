import { useEffect, useState } from "react";
import { fetchSummonerRankDataByPUUID } from "@/lib/riot/riotApiService";
import { getTierIcon, useTierIcons } from "@/components/ui/riot_icons";
import RankedInfo from "./rankedInfo";
import { SummonerProfileProps } from "../interfaces";
import SummonerIcon from "./summonerIcon";

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
        <SummonerIcon
          profileIconId={summonerData.profileIconId}
          gameNick={gamerInfo.GameNick}
          gameTag={gamerInfo.GameTag}
          summonerLevel={summonerData.summonerLevel}
        />
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
