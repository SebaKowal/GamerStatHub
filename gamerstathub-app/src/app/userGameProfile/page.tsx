"use client";

import useUser from "../hook/useUser";
import useGamerInfo from "../hook/useGamerInfo";
import { useEffect, useState } from "react";
import { fetchPUUIDByRiotID, fetchSummonerDataByPUUID } from "@/lib/riot/riotApiService";

export default function UserGameProfile() {
  const { data } = useUser(); // Pobieramy zalogowanego użytkownika z autoryzacji Supabase
  const { data: gamerInfo, isLoading, error } = useGamerInfo(data?.id); // Fetch danych o graczu z Supabase
  const [summonerData, setSummonerData] = useState(null);

  useEffect(() => {
    if (gamerInfo?.GameNick && gamerInfo?.GameTag) {
      const fetchSummonerData = async () => {
        try {
          const puuid = await fetchPUUIDByRiotID(gamerInfo.GameNick, gamerInfo.GameTag);
          const summonerData = await fetchSummonerDataByPUUID(puuid);
          setSummonerData(summonerData);
        } catch (err) {
          console.error("Error fetching Riot API data:", err);
        }
      };

      fetchSummonerData();
    }
  }, [gamerInfo]);
  console.log(summonerData)
  if (isLoading) return <div>Loading your game profile...</div>;
  if (error) return <div>Error loading data: {error.message}</div>;

  return (
    <div>
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
          <p>Name: {summonerData}</p>
        </div>
      ) : (
        <p>Loading summoner stats...</p>
      )}
    </div>
  );
}
