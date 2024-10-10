// src/app/api/riot/summoner/route.ts
import { NextResponse } from 'next/server';

const RIOT_API_KEY = process.env.NEXT_PUBLIC_RIOT_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const puuid = searchParams.get('puuid');

  if (!RIOT_API_KEY) {
    return NextResponse.json({ error: "RIOT_API_KEY not found" }, { status: 500 });
  }

  try {
    const riotResponse = await fetch(
      `https://eun1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${RIOT_API_KEY}`
    );
    const data = await riotResponse.json();

    if (!riotResponse.ok) {
      return NextResponse.json({ error: data }, { status: riotResponse.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching data from Riot API summoner:", error);
    return NextResponse.json({ error: "Failed to fetch data from Riot API" }, { status: 500 });
  }
}
