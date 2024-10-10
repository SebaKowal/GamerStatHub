interface SummonerData {
  id: string;
  name: string;
  profileIconId: number;
  summonerLevel: number;
}

interface RankedStats {
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
}

interface MatchHistory {
  championName: string;
  kills: number;
  deaths: number;
  assists: number;
  win: boolean;
  gameDuration: number;
  gameCreation: number;
  cs: number;
}
