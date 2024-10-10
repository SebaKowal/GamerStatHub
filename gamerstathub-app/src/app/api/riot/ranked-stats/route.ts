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
    // Wywołanie API Riot do pobrania statystyk rankingowych
    const riotResponse = await fetch(
      `https://eun1.api.riotgames.com/lol/league/v4/entries/by-summoner/${puuid}?api_key=${RIOT_API_KEY}`
    );
    const data = await riotResponse.json();

    if (!riotResponse.ok) {
      return NextResponse.json({ error: data }, { status: riotResponse.status });
    }

    // Zwraca dane rankingowe
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching ranked stats from Riot API:", error);
    return NextResponse.json({ error: "Failed to fetch ranked stats" }, { status: 500 });
  }
}
