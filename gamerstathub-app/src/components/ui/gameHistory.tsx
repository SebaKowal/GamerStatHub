"use client";

import { useEffect, useState } from "react";
import {
  SpellData,
  RuneData,
  ItemData,
  fetchRunes,
  fetchItems,
  fetchMatchHistoryByPUUID,
  fetchSummonerSpells,
} from "@/lib/riot/riotApiService";
import SummonerSpells from "./summonerSpell";
import Items from "./items";
import Runes from "./runes";
import Image from "next/image";

interface MatchData {
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

interface TeammateData {
  summonerName: string;
  champion: string;
}

interface OpponentData {
  summonerName: string;
  champion: string;
}

export default function GameHistory({ puuid }: { puuid: string }) {
  const [matchHistory, setMatchHistory] = useState<MatchData[]>([]);
  const [spellData, setSpellData] = useState<Record<string, SpellData>>({});
  const [runeData, setRuneData] = useState<Record<string, RuneData>>({});
  const [itemData, setItemData] = useState<Record<string, ItemData>>({});

  useEffect(() => {
    const fetchMatchHistory = async () => {
      try {
        const matches = await fetchMatchHistoryByPUUID(puuid, 5);
        const detailedMatches = matches.map((match: any) => {
          const participant = match.info.participants.find(
            (p: any) => p.puuid === puuid
          );
          const teammates = match.info.participants
            .filter((p: any) => p.teamId === participant.teamId)
            .map((t: any) => ({
              summonerName: t.summonerName,
              champion: t.championName,
            }));

          const opponents = match.info.participants
            .filter((p: any) => p.teamId !== participant.teamId)
            .map((o: any) => ({
              summonerName: o.summonerName,
              champion: o.championName,
            }));
          const items = [
            participant.item0,
            participant.item1,
            participant.item2,
            participant.item3,
            participant.item4,
            participant.item5,
            participant.item6, // Jeśli item6 to trinket, nadal może być potrzebny
          ];

          return {
            matchId: match.metadata.matchId,
            gameMode: match.info.gameMode,
            champion: participant.championName,
            kills: participant.kills,
            deaths: participant.deaths,
            assists: participant.assists,
            items: items.map((item) => item.toString()),
            kda:
              (participant.kills + participant.assists) /
              Math.max(1, participant.deaths),
            win: participant.win,
            gameDuration: match.info.gameDuration,
            gameDate: new Date(
              match.info.gameEndTimestamp
            ).toLocaleDateString(),
            summonerSpells: [participant.summoner1Id, participant.summoner2Id],
            runes: participant.perks.styles.flatMap((style: any) =>
              style.selections.map((rune: any) => rune.perk)
            ),
            teammates: teammates,
            opponents: opponents,
          };
        });
        setMatchHistory(detailedMatches);
      } catch (err) {
        console.error("Error fetching match history:", err);
      }
    };

    const fetchSpells = async () => {
      try {
        const data = await fetchSummonerSpells();
        setSpellData(data); // Set the fetched spell data to state
      } catch (err) {
        console.error("Error fetching summoner spells:", err);
      }
    };

    const fetchRune = async () => {
      try {
        const data = await fetchRunes();
        setRuneData(data);
      } catch (err) {
        console.error("Error fetching runes", err);
      }
    };

    const fetchItem = async () => {
      try {
        const data = await fetchItems();
        console.log(data);
        setItemData(data);
      } catch (err) {
        console.error("Error fetching items", err);
      }
    };

    fetchMatchHistory();
    fetchSpells();
    fetchRune();
    fetchItem();
  }, [puuid]);

  return (
    <div className="mt-2 flex flex-col mx-auto">
      {matchHistory.length > 0 ? (
        matchHistory.map((match, index) => (
          <div
            key={index}
            className={`bg-gray-800 p-4 rounded-lg mb-4 shadow-inner ${
              match.win ? "shadow-green-700" : "shadow-red-700"
            }`}
          >
            <div className="flex md:flex-row flex-col text-center w-full ">
              <div className="flex flex-row mb-4 md:mb-0 w-full  ">
                <div className="flex flex-col mr-4">
                  <p className="font-bold text-white mb-2">{match.gameMode}</p>
                  <p className="text-white text-lg ">
                    {match.kills}/{match.deaths}/{match.assists}
                  </p>
                  <p className="text-gray-400 text-sm">
                    KDA: {match.kda.toFixed(2)}
                  </p>
                  <div className="text-gray-400 text-xs mt-2">
                    <p>{match.gameDate}</p>
                    <p>
                      {Math.floor(match.gameDuration / 60)}{" "}
                      {match.gameDuration % 60}
                    </p>
                  </div>
                </div>
                <div className="flex flex-row">
                  <div className="flex mb-2 mr-1">
                    <Image
                      className="w-14 h-14 rounded-full mr-2"
                      src={`https://ddragon.leagueoflegends.com/cdn/12.18.1/img/champion/${match.champion}.png`}
                      alt={match.champion}
                      width={64}
                      height={64}
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex">
                      <SummonerSpells
                        spellIds={match.summonerSpells}
                        spellData={spellData}
                      />
                      <Runes runeIds={match.runes} runeData={runeData} />
                    </div>

                    <div className="flex ">
                      <Items itemIds={match.items} itemData={itemData} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-row items-center ml-4 md:ml-16">
                <div className="flex flex-col">
                  {match.teammates.map((teammate, idx) => (
                    <div key={idx} className="flex items-center">
                      <Image
                        className="w-6 h-6 rounded-full"
                        src={`https://ddragon.leagueoflegends.com/cdn/12.18.1/img/champion/${teammate.champion}.png`}
                        alt={teammate.champion}
                        width={32}
                        height={32}
                      />
                      <p className="text-gray-400 ml-1 text-[10px] 2xl:text-sm whitespace-nowrap overflow-hidden text-ellipsis w-20 2xl:w-36">
                        {teammate.summonerName}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col ml-4">
                  {match.opponents.map((opponent, idx) => (
                    <div key={idx} className="flex items-center">
                      <Image
                        className="w-6 h-6 rounded-full"
                        src={`https://ddragon.leagueoflegends.com/cdn/12.18.1/img/champion/${opponent.champion}.png`}
                        alt={opponent.champion}
                        width={32}
                        height={32}
                      />
                      <p className="text-gray-400 ml-1 text-[10px] 2xl:text-sm whitespace-nowrap overflow-hidden text-ellipsis w-20 2xl:w-36">
                        {opponent.summonerName}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-white">Brak wyników.</p>
      )}
    </div>
  );
}
