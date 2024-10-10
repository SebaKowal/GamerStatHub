"use client";

import useUser from "../hook/useUser";
import useGamerInfo from "../hook/useGamerInfo";
import { useEffect, useState } from "react";
import {
  fetchPUUIDByRiotID,
  fetchSummonerDataByPUUID,
} from "@/lib/riot/riotApiService";

// Typy danych summoner'a
interface SummonerData {
  id: string;
  name: string;
  profileIconId: number;
  summonerLevel: number;
}

export default function UserGameProfile() {
  const { data } = useUser(); // Pobieramy zalogowanego użytkownika z autoryzacji Supabase
  const { data: gamerInfo, isLoading, error } = useGamerInfo(data?.id); // Fetch danych o graczu z Supabase
  const [summonerData, setSummonerData] = useState<SummonerData | null>(null); // Ustaw typ dla stanu

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
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Your Game Profile</h1>
      {gamerInfo && (
        <>
          <p>Game Nick: {gamerInfo.GameNick}</p>
          <p>Game Tag: {gamerInfo.GameTag}</p>
        </>
      )}

      {summonerData ? (
        <div>
          <h2>Summoner Stats</h2>
          <p>Name: {summonerData.name}</p>
          <p>Id: {summonerData.id}</p>
          <p>Level: {summonerData.summonerLevel}</p>
          <p>
            Icon:
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/12.18.1/img/profileicon/${summonerData.profileIconId}.png`}
              alt={`${summonerData.profileIconId}'s Icon`}
            />
          </p>
        </div>
      ) : (
        <p>Loading summoner stats...</p>
      )}
    </div>
  );
}
