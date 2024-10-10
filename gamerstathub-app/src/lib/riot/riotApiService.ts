"use client";

const RIOT_API_KEY = process.env.NEXT_PUBLIC_RIOT_API_KEY;
if (!RIOT_API_KEY) {
  console.log("problem z RIOT_API_KEY");
}

// Fetch PUUID using Riot ID
export const fetchPUUIDByRiotID = async (
  gamerName: string,
  tagLine: string
) => {
  const response = await fetch(
    `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gamerName}/${tagLine}?api_key=${RIOT_API_KEY}`
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Failed to fetch PUUID: ${data.status.message}`);
  }
  return data.puuid;
};

// Fetch Summoner Data using PUUID
export const fetchSummonerDataByPUUID = async (puuid: string) => {
  const response = await fetch(
    `https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${RIOT_API_KEY}`
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Failed to fetch Summoner Data: ${data.status.message}`);
  }
  return data;
};
