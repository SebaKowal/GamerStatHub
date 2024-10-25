export interface SpellData {
  key: string;
  name: string;
  image: {
    full: string;
  };
}
export interface RuneData {
  key: string;
  name: string;
  icon: string;
  tree?: string;
}

export interface ItemData {
  id: string;
  key: string;
  name: string;
  image: {
    full: string;
  };
}

export interface SummonerData {
  tag: string;
  id: string;
  puuid: string;
  name: string;
  profileIconId: number;
  summonerLevel: number;
}

export interface RankedInfoProps {
  rankData: any[];
  queueType: string;
  title: string;
  tierIcons: any;
}

export interface SummonerProfileProps {
  summonerData: {
    id: string;
    puuid: string;
    profileIconId: number;
    summonerLevel: number;
  };
  gamerInfo: {
    GameNick: string;
    GameTag: string;
  };
}

export interface SummonerSpellsProps {
  spellIds: string[];
  spellData: Record<string, SpellData>;
}

export interface RunesProps {
  runeIds: string[];
  runeData: Record<string, RuneData>;
}

export interface TierIconData {
  tier: string;
  url: string;
}

export interface MatchData {
  matchId: string;
  gameMode: string;
  champion: string;
  kills: number;
  deaths: number;
  assists: number;
  kda: number;
  win: boolean;
  gameDuration: number;
  gameDate: string;
  summonerSpells: string[];
  items: string[];
  runes: string[];
  teammates: TeammateData[];
  opponents: OpponentData[];
}

export interface TeammateData {
  summonerName: string;
  champion: string;
}

export interface OpponentData {
  summonerName: string;
  champion: string;
}

export interface SummonerIconProps {
  profileIconId: number;
  gameNick: string;
  gameTag: string;
  summonerLevel: number;
}

export interface User {
  GamerInfo_ID: number;
  GameNick: string;
  GameTag: string;
  PageUsername: string;
  Description: string;
  summonerData?: any; // Możesz zdefiniować bardziej szczegółowy typ, jeśli masz interfejs dla summonerData
}