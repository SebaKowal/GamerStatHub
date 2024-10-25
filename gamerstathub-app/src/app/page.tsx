"use client";

import Link from "next/link";
import useAllGamerInfo from "./hook/useAllGamerInfo";
import { useEffect, useState } from "react";
import {
  fetchPUUIDByRiotID,
  fetchSummonerDataByPUUID,
} from "@/lib/riot/riotApiService";
import Image from "next/image";
import SummonerIcon from "@/components/ui/summonerIcon";
import { User } from "@/components/interfaces";

const MainPage = () => {
  const { data: users, isLoading, error } = useAllGamerInfo();
  const [summonerProfiles, setSummonerProfiles] = useState<User[]>([]);

  useEffect(() => {
    const fetchSummonerProfiles = async () => {
      if (!users) return;

      const profiles = await Promise.all(
        users.map(async (user: User) => {
          try {
            const puuid = await fetchPUUIDByRiotID(user.GameNick, user.GameTag);
            const summonerData = await fetchSummonerDataByPUUID(puuid);
            return {
              ...user,
              summonerData,
            };
          } catch (error) {
            console.error("Error fetching summoner data:", error);
            return { ...user, summonerData: null };
          }
        })
      );
      setSummonerProfiles(profiles);
    };

    fetchSummonerProfiles();
  }, [users]);

  if (isLoading) return <div className="p-12 min-h-screen">Loading...</div>;
  if (error)
    return <div className="p-12 min-h-screen">Error: {error.message}</div>;

  return (
    <div className="p-24 min-h-screen">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {summonerProfiles.map((user) => (
          <Link
            key={user.GamerInfo_ID}
            href={`/userHistory/${user.GameNick}#${user.GameTag}`}
            passHref
          >
            <div className="border border-gray-600 rounded-xl bg-gray-800 cursor-pointer">
              <div className="flex flex-col divide-y divide-gray-600 mx-2">
                <div className="flex items-center">
                  {user.summonerData && (
                    <div className="flex items-center">
                      <SummonerIcon
                        profileIconId={user.summonerData.profileIconId}
                        gameNick={user.GameNick}
                        gameTag={user.GameTag}
                        summonerLevel={user.summonerData.summonerLevel}
                      />
                    </div>
                  )}
                </div>

                <div className="p-4 px-5">
                  <p className="">{user.Description}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MainPage;
