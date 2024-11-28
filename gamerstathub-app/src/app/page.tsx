"use client";

import Link from "next/link";
import useAllGamerInfo from "./hook/useAllGamerInfo";
import useUser from "./hook/useUser";
import useGamerInfo from "./hook/useGamerInfo";
import { useEffect, useState, useRef } from "react";
import {
  fetchPUUIDByRiotID,
  fetchSummonerDataByPUUID,
} from "@/lib/riot/riotApiService";
import SummonerIcon from "@/components/ui/summonerIcon";
import AddFriendButton from "@/components/friends/AddFriendButton";
import axios from "axios";
import { User } from "@/components/interfaces";
import ThreeWayButton from "@/components/ui/threewaybutton";

const MainPage = () => {
  const { data: currentUser } = useUser();
  const { data: currentGamerInfo } = useGamerInfo(currentUser?.id);
  const { data: users, isLoading, error } = useAllGamerInfo();
  const [summonerProfiles, setSummonerProfiles] = useState<User[]>([]);
  const [filter, setFilter] = useState<"all" | "friends" | "none">("all");
  const [friendIds, setFriendIds] = useState<string[]>([]);
  const [highlightedUsers, setHighlightedUsers] = useState<string[]>([]);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchFriends = async () => {
    if (currentUser?.id === undefined) return;
    try {
      const response = await axios.get("/api/friends/list", {
        params: { userId: currentUser.id },
      });
      setFriendIds(response.data.friends || []);
    } catch (error) {
      console.error("[Main Page] Error fetching friends list:", error);
    }
  };

  useEffect(() => {
    fetchFriends();
    pollingIntervalRef.current = setInterval(fetchFriends, 5000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [currentUser]);

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      if (currentUser?.id === undefined) return;
      try {
        const response = await axios.get("/api/messages/unread", {
          params: { userId: currentUser.id },
        });
        const unreadMessages = response.data.messages;
        const unreadUserIds = unreadMessages.map((msg: any) => msg.Sender_ID);
        setHighlightedUsers(unreadUserIds);
      } catch (error) {
        console.error("[Main Page] Error fetching unread messages:", error);
      }
    };

    fetchUnreadMessages();
    pollingIntervalRef.current = setInterval(fetchUnreadMessages, 5000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [currentUser]);

  useEffect(() => {
    const fetchSummonerProfiles = async () => {
      if (!users) return;

      const filteredUsers = users.filter((user: User) => {
        if (!currentUser) {
          return true;
        }

        const isFriend = friendIds.includes(String(user.ID_userAuth));
        return (
          user.GamerInfo_ID !== currentGamerInfo?.GamerInfo_ID &&
          (filter === "all" ||
            (filter === "friends" && isFriend) ||
            (filter === "none" && !isFriend))
        );
      });

      const profiles = await Promise.all(
        filteredUsers.map(async (user: User) => {
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
  }, [users, currentGamerInfo, filter, friendIds, currentUser]);

  const handleFilterChange = (newFilter: "all" | "friends" | "none") => {
    setFilter(newFilter);
  };

  if (isLoading) return <div className="p-12 min-h-screen">Loading...</div>;
  if (error)
    return <div className="p-12 min-h-screen">Error: {error.message}</div>;

  return (
    <div className="p-6 min-h-screen sm:p-12">
      {currentUser?.id === undefined || (
        <div className="flex justify-center mb-6">
          <ThreeWayButton filter={filter} onFilterChange={handleFilterChange} />
        </div>
      )}

      <div
        className="grid gap-4 justify-center"
        style={{
          gridTemplateColumns: "repeat(auto-fit, 300px)",
        }}
      >
        {summonerProfiles.map((user) => (
          <div
            key={user.GamerInfo_ID}
            className={`w-[300px] border border-gray-600 rounded-xl divide-y divide-gray-600 px-1 bg-gray-800 ${
              highlightedUsers.includes(String(user.ID_userAuth))
                ? "shadow-inner shadow-blue-600"
                : "shadow-none"
            }`}
          >
            <div className="flex">
              <div>
                <Link
                  href={`/userHistory/${user.GameNick}#${user.GameTag}`}
                  passHref
                >
                  <div className="flex items-center cursor-pointer">
                    {user.summonerData && (
                      <SummonerIcon
                        profileIconId={user.summonerData.profileIconId}
                        gameNick={user.GameNick}
                        gameTag={user.GameTag}
                        summonerLevel={user.summonerData.summonerLevel}
                      />
                    )}
                  </div>
                </Link>
              </div>
              <div className="flex items-center ml-auto mr-4">
                {currentUser?.id && (
                  <AddFriendButton
                    currentUserId={currentUser.id}
                    targetUserId={String(user.ID_userAuth)}
                  />
                )}
              </div>
            </div>
            <div className="p-1 px-2 max-h-40">
              <p className="text-sm text-gray-300">
                {user.Description || "No description provided."}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainPage;
