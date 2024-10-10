import { NextResponse } from 'next/server';

const RIOT_API_KEY = process.env.RIOT_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const puuid = searchParams.get('puuid');

  if (!RIOT_API_KEY) {
    return NextResponse.json({ error: "RIOT_API_KEY not found" }, { status: 500 });
  }

  if (!puuid) {
    return NextResponse.json({ error: "Missing query parameters" }, { status: 400 });
  }

  try {
    // Pobieranie listy meczów z Riot API
    const riotResponse = await fetch(
      `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=10&api_key=${RIOT_API_KEY}`
    );
    const matchIds = await riotResponse.json();

    if (!riotResponse.ok) {
      return NextResponse.json({ error: matchIds }, { status: riotResponse.status });
    }

    // Pobieranie szczegółowych danych o każdym meczu
    const matchDetails = await Promise.all(
      matchIds.map(async (matchId: string) => {
        const matchResponse = await fetch(
          `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${RIOT_API_KEY}`
        );
        const matchData = await matchResponse.json();
        return matchData;
      })
    );

    // Zwraca szczegółowe dane o meczach
    return NextResponse.json({ matches: matchDetails }, { status: 200 });
  } catch (error) {
    console.error("Error fetching match history from Riot API:", error);
    return NextResponse.json({ error: "Failed to fetch match history" }, { status: 500 });
  }
}
