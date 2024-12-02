"use client";

import { useEffect, useState } from "react";
import {
  fetchPUUIDByRiotID,
  fetchSummonerDataByPUUID,
} from "@/lib/riot/riotApiService";
import SummonerProfile from "@/components/ui/summonerProfile";
import GameHistory from "@/components/ui/gameHistory";
import { SummonerData } from "@/components/interfaces";
import { Spinner } from "@nextui-org/spinner";

export default function UserGameProfile() {
  const [gameNick, setGameNick] = useState<string>("");
  const [gameTag, setGameTag] = useState<string>("");
  const [summonerData, setSummonerData] = useState<SummonerData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const pathParts = window.location.pathname.split("/");
    const nick = pathParts[pathParts.length - 1];
    const tag = window.location.hash.replace("#", "");

    if (nick && tag) {
      setGameNick(nick);
      setGameTag(tag);
    } else {
      setError("Invalid user information in URL.");
    }
  }, []);

  useEffect(() => {
    const fetchSummonerData = async () => {
      if (gameNick && gameTag) {
        try {
          const puuid = await fetchPUUIDByRiotID(gameNick, gameTag);
          const summonerData = await fetchSummonerDataByPUUID(puuid);
          setSummonerData(summonerData);
        } catch (err) {
          console.error("Error fetching Riot API data:", err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSummonerData();
  }, [gameNick, gameTag]);

  if (isLoading)
    return (
      <div className="flex p-12 min-h-screen items-center justify-center min-h-screen">
        <Spinner label="Loading..." color="default" />
      </div>
    );
  if (error) return <div>Error loading data: {error}</div>;

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-4 px-4 sm:px-16">
      {summonerData ? (
        <div className="flex flex-col w-full lg:flex-row pt-2 p-4 m-2 ">
          <SummonerProfile
            summonerData={summonerData}
            gamerInfo={{ GameNick: gameNick, GameTag: gameTag }}
          />
          <div className="flex flex-col w-full pt-8 px-8">
            <GameHistory puuid={summonerData.puuid} />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <Spinner label="Loading..." color="default" />
        </div>
      )}
    </div>
  );
}
