"use client";

import useUser from "../hook/useUser";
import useGamerInfo from "../hook/useGamerInfo";
import { useEffect, useState } from "react";
import {
  fetchPUUIDByRiotID,
  fetchSummonerDataByPUUID,
} from "@/lib/riot/riotApiService";
import SummonerProfile from "@/components/ui/summonerProfile";
import GameHistory from "@/components/ui/gameHistory";
import { SummonerData } from "@/components/interfaces";



export default function UserGameProfile() {
  const { data } = useUser();
  const { data: gamerInfo, isLoading, error } = useGamerInfo(data?.id);
  const [summonerData, setSummonerData] = useState<SummonerData | null>(null);

  useEffect(() => {
    if (gamerInfo?.GameNick && gamerInfo?.GameTag) {
      const fetchSummonerData = async () => {
        try {
          const puuid = await fetchPUUIDByRiotID(
            gamerInfo.GameNick,
            gamerInfo.GameTag
          );
          const summonerData = await fetchSummonerDataByPUUID(puuid);
          setSummonerData(summonerData);
        } catch (err) {
          console.error("Error fetching Riot API data:", err);
        }
      };

      fetchSummonerData();
    }
  }, [gamerInfo]);

  if (isLoading) return <div>Loading your game profile...</div>;
  if (error) return <div>Error loading data: {error.message}</div>;

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-4 px-4 sm:px-16">
      {summonerData ? (
        <div className="flex flex-col w-full lg:flex-row">
          <SummonerProfile summonerData={summonerData} gamerInfo={gamerInfo} />
          <div className="flex flex-col w-full pt-8 px-8">
            <GameHistory puuid={summonerData.puuid} />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-white text-2xl">Loading ... </p>
        </div>
      )}
    </div>
  );
}
