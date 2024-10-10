// Fetch PUUID using Riot ID from our Next.js API Route
export const fetchPUUIDByRiotID = async (gamerName: string, tagLine: string) => {
  const response = await fetch(`/api/riot?gamerName=${gamerName}&tagLine=${tagLine}`);
  
  console.log('Response status:', response.status); // Loguje status odpowiedzi
  console.log('Response headers:', response.headers); // Loguje nagłówki odpowiedzi

  const data = await response.json();

  if (!response.ok) {
    const errorData = await response.json(); // Odczytaj dane błędu
    console.error('Error data:', errorData); // Loguj szczegóły błędu
    throw new Error(`Failed to fetch PUUID: ${errorData.error.message || "Unknown error"}`);
  }
  
  console.log('Fetched PUUID:', data.puuid); // Loguje PUUID, jeśli wszystko poszło dobrze
  return data.puuid;
};

// Fetch Summoner Data using PUUID from our Next.js API Route
export const fetchSummonerDataByPUUID = async (puuid: string) => {
  const response = await fetch(`/api/summoner?puuid=${puuid}`);
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(`Failed to fetch Summoner Data: ${data.error.message || "Unknown error"}`);
  }
  
  return data;
};




