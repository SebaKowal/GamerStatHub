// Fetch PUUID using Riot ID from our Next.js API Route
export const fetchPUUIDByRiotID = async (
  gamerName: string,
  tagLine: string
) => {
  const response = await fetch(
    `/api/riot?gamerName=${gamerName}&tagLine=${tagLine}`
  );

  console.log("Response status:", response.status); // Loguje status odpowiedzi
  console.log("Response headers:", response.headers); // Loguje nagłówki odpowiedzi

  const data = await response.json();

  if (!response.ok) {
    const errorData = await response.clone().json(); // Use `clone` to copy the response
    console.error("Error data:", errorData);
    throw new Error(
      `Failed to fetch PUUID: ${errorData.error.message || "Unknown error"}`
    );
  }

  console.log("Fetched PUUID:", data.puuid); // Loguje PUUID, jeśli wszystko poszło dobrze
  return data.puuid;
};

// Fetch Summoner Data using PUUID from our Next.js API Route
export const fetchSummonerDataByPUUID = async (puuid: string) => {
  const response = await fetch(`/api/riot/summoner?puuid=${puuid}`);
  const data = await response.json();

  if (!response.ok) {
    const errorData = await response.clone().json(); // Use `clone` to copy the response
    console.error("Error data:", errorData);
    throw new Error(
      `Failed to fetch PUUID: ${errorData.error.message || "Unknown error"}`
    );
  }

  return data;
};

export const fetchSummonerRankDataByPUUID = async (summonerid: string) => {
  const response = await fetch(`/api/riot/rank?summonerid=${summonerid}`);
  const data = await response.json();

  if (!response.ok) {
    const errorData = await response.clone().json(); // Use `clone` to copy the response
    console.error("Error data:", errorData);
    throw new Error(
      `Failed to fetch summonerid: ${
        errorData.error.message || "Unknown error"
      }`
    );
  }

  return data;
};

// Fetch match history by PUUID
export const fetchMatchHistoryByPUUID = async (puuid: string, count = 5) => {
  const response = await fetch(
    `/api/riot/matches?puuid=${puuid}&count=${count}`
  );
  const data = await response.json();

  if (!response.ok) {
    const errorData = await response.clone().json();
    console.error("Error data:", errorData);
    throw new Error(
      `Failed to fetch match history: ${
        errorData.error.message || "Unknown error"
      }`
    );
  }

  return data;
};

// riotApiService.ts
export interface SpellData {
  key: string;
  name: string;
  image: {
    full: string;
  };
}

type SpellDataRecord = Record<string, SpellData>;

export async function fetchSummonerSpells(): Promise<SpellDataRecord> {
  const response = await fetch(
    "https://ddragon.leagueoflegends.com/cdn/14.20.1/data/en_US/summoner.json"
  );
  const data = await response.json();
  
  const spells: SpellDataRecord = {};
  for (const key in data.data) {
    spells[data.data[key].key] = {
      key: data.data[key].key,
      name: data.data[key].name,
      image: data.data[key].image,
    };
  }
  return spells;
}


export async function fetchItems() {
  const response = await fetch(
    "https://ddragon.leagueoflegends.com/cdn/14.20.1/data/en_US/item.json"
  );
  const data = await response.json();
  return data.data;
}

export async function fetchRunes() {
  const response = await fetch(
    "https://ddragon.leagueoflegends.com/cdn/14.20.1/data/en_US/runesReforged.json"
  );
  const data = await response.json();
  return data;
}
