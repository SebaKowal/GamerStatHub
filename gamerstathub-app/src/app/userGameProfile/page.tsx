"use client";

import useUser from "../hook/useUser";
import useGamerInfo from "../hook/useGamerInfo";
import { useEffect, useState } from "react";
import {
  fetchPUUIDByRiotID,
  fetchSummonerDataByPUUID,
  fetchSummonerRankDataByPUUID,
} from "@/lib/riot/riotApiService";
import { getTierIcon, useTierIcons } from "@/components/ui/riot_icons";

// Typy danych summoner'a
interface SummonerData {
  id: string;
  name: string;
  profileIconId: number;
  summonerLevel: number;
}

interface SummonerRankData {
  queueType: string;
  id: string;
  tier: string;
  rank: string;
  wins: number;
  losses: number;
  leaguePoints: number;

  flexTier: string;
  flexRank: string;
  flexWins: number;
  flexLosses: number;
  flexLeaguePoints: number;
}

type SummonerRankDataArray = SummonerRankData[];

export default function UserGameProfile() {
  const { data } = useUser(); // Pobieramy zalogowanego użytkownika z autoryzacji Supabase
  const { data: gamerInfo, isLoading, error } = useGamerInfo(data?.id); // Fetch danych o graczu z Supabase
  const [summonerData, setSummonerData] = useState<SummonerData | null>(null); // Ustaw typ dla stanu
  const [summonerRankData, setSummonerRankData] =
    useState<SummonerRankDataArray>([]);
  const tierIcons = useTierIcons();

  useEffect(() => {
    if (gamerInfo?.GameNick && gamerInfo?.GameTag) {
      const fetchSummonerData = async () => {
        try {
          const puuid = await fetchPUUIDByRiotID(
            gamerInfo.GameNick,
            gamerInfo.GameTag
          );
          const summonerData = await fetchSummonerDataByPUUID(puuid);
          console.log("summonerData:");
          console.log(summonerData);
          const summonerRankData = await fetchSummonerRankDataByPUUID(
            summonerData.id
          );
          console.log("summonerRankData:");
          console.log(summonerRankData);

          setSummonerRankData(summonerRankData);
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
    <div className="flex min-h-screen flex-col items-center justify-between p-4">
      {/* Sprawdzenie, czy summonerData istnieje */}
      {summonerData ? (
        <div className="flex flex-col w-full md:flex-row">
          {/* Sekcja danych o summonerze */}
          <div className="flex flex-col items-center w-full md:w-1/3 pt-8">
            <div className="pb-8">
              <div className="flex items-center bg-gray-800 rounded-lg p-4 m-2">
                <img
                  className="w-14 h-14 mr-3 rounded-sm"
                  src={`https://ddragon.leagueoflegends.com/cdn/12.18.1/img/profileicon/${summonerData.profileIconId}.png`}
                  alt={`${gamerInfo.GameNick}'s Icon`}
                />
                <div className="text-white">
                  <p className="text-lg font-bold">{gamerInfo.GameNick}</p>
                  <p className="text-sm">#{gamerInfo.GameTag}</p>
                  <p className="text-xs">Level: {summonerData.summonerLevel}</p>
                </div>
              </div>
            </div>

            {/* Kontener dla sekcji SoloQ i Flex */}
            {/* Sekcja SoloQ */}
            <div className="flex flex-col bg-gray-800 rounded-lg p-6 py-4 mt-4">
              <h2 className="flex justify-center text-white text-lg font-bold mb-2">
                SoloQ
              </h2>
              {summonerRankData && summonerRankData.length > 0 ? (
                <div className="flex flex-col">
                  {summonerRankData
                    .filter(
                      (rankData) => rankData.queueType === "RANKED_SOLO_5x5"
                    )
                    .map((rankData, index) => (
                      <div
                        key={index}
                        className="flex items-center border-b border-gray-700 pb-2 last:border-b-0"
                      >
                        {/* Ikona po lewej stronie */}
                        <img
                          className="w-24 h-24 object-cover rounded-full bg-gray-900 pt-2 mr-4"
                          src={getTierIcon(rankData.tier, tierIcons)}
                          alt={`${rankData.tier} icon`}
                        />
                        {/* Dane po prawej stronie */}
                        <div className="text-white">
                          <p className="text-lg font-bold whitespace-nowrap overflow-hidden text-ellipsis">
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
                              (rankData.wins /
                                (rankData.wins + rankData.losses)) *
                                100
                            )}
                            %
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <img
                    className="w-24 h-24 object-cover rounded-full bg-gray-900 pt-2"
                    src={getTierIcon("Unranked", tierIcons)}
                    alt={`Unranked icon`}
                  />
                  <p className="text-sm text-gray-300 font-bold mt-2">
                    Unranked
                  </p>
                </div>
              )}
            </div>

            {/* Sekcja Flex */}
            <div className="flex flex-col bg-gray-800 rounded-lg p-6 mt-4">
              <div className="flex justify-center mb-2">
                <h2 className="text-white text-lg font-bold">Flex</h2>
              </div>
              {summonerRankData && summonerRankData.length > 0 ? (
                <div className="flex flex-col">
                  {summonerRankData
                    .filter(
                      (rankData) => rankData.queueType === "RANKED_FLEX_SR"
                    )
                    .map((rankData, index) => (
                      <div
                        key={index}
                        className="flex items-center border-b border-gray-700 pb-2 last:border-b-0"
                      >
                        <img
                          className="w-24 h-24 object-cover rounded-full bg-gray-900 pt-2 mr-4"
                          src={getTierIcon(rankData.tier, tierIcons)} // Używamy funkcji do pobrania URL ikony
                          alt={`${rankData.tier} icon`}
                        />
                        <div className="text-white">
                          <p className="text-lg font-bold whitespace-nowrap overflow-hidden text-ellipsis">
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
                              (rankData.wins /
                                (rankData.wins + rankData.losses)) *
                                100
                            )}
                            %
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <img
                    className="w-24 h-24 object-cover rounded-full bg-gray-900 pt-2"
                    src={getTierIcon("Unranked", tierIcons)}
                    alt={`Unranked icon`}
                  />
                  <p className="text-sm text-gray-300 font-bold mt-2">
                    Unranked
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Blok na historię gier po prawej stronie */}
          <div className="flex flex-col w-full md:w-2/3 pt-8 px-8">
            <h2 className="text-white text-lg font-bold mb-4">Historia Gier</h2>

            {/* Miejsce na przyszłą implementację historii gier */}
            <p className="text-white">Tu będzie historia gier...</p>
          </div>
        </div>
      ) : (
        // Wyświetlanie komunikatu, gdy summonerData nie istnieje
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-white text-2xl">Player Doesn't Exist</p>
        </div>
      )}
    </div>
  );
}
