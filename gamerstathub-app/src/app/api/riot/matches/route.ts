import { NextResponse } from 'next/server';

const RIOT_API_KEY = process.env.NEXT_PUBLIC_RIOT_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const puuid = searchParams.get('puuid');
  const count = searchParams.get('count') || 5; // Default 5 matches

  if (!RIOT_API_KEY) {
    return NextResponse.json({ error: "RIOT_API_KEY not found" }, { status: 500 });
  }

  if (!puuid) {
    return NextResponse.json({ error: "Missing PUUID" }, { status: 400 });
  }

  try {
    const matchIdsResponse = await fetch(
      `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${count}&api_key=${RIOT_API_KEY}`
    );
    const matchIds = await matchIdsResponse.json();
    
    const matches = await Promise.all(
      matchIds.map(async (matchId: string) => {
        const matchDetailResponse = await fetch(
          `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${RIOT_API_KEY}`
        );
        return matchDetailResponse.json();
      })
    );
    
    return NextResponse.json(matches, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch match data from Riot API" }, { status: 500 });
  }
}
