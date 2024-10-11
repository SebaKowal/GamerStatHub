import { NextResponse } from 'next/server';

const RIOT_API_KEY = process.env.NEXT_PUBLIC_RIOT_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gamerName = searchParams.get('gamerName');
  const tagLine = searchParams.get('tagLine');

  if (!RIOT_API_KEY) {
    console.log("RIOT_API_KEY not found");
    return NextResponse.json({ error: "RIOT_API_KEY not found" }, { status: 500 });
  }

  if (!gamerName || !tagLine) {
    console.log("Missing query parameters");
    return NextResponse.json({ error: "Missing query parameters" }, { status: 400 });
  }

  try {
    const riotResponse = await fetch(
      `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gamerName}/${tagLine}?api_key=${RIOT_API_KEY}`
    );
    const data = await riotResponse.json();

    if (!riotResponse.ok) {
      return NextResponse.json({ error: data }, { status: riotResponse.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching data from Riot API:", error);
    return NextResponse.json({ error: "Failed to fetch data from Riot API" }, { status: 500 });
  }
}
