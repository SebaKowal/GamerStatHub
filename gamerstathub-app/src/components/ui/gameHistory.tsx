"use client";

import { useEffect, useState } from "react";
import {
  SpellData,
  fetchMatchHistoryByPUUID,
  fetchSummonerSpells,
} from "@/lib/riot/riotApiService";
import SummonerSpells from "./summonerSpell";
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
  runes: string[];
  teammates: TeammateData[];
}

interface TeammateData {
  summonerName: string;
  champion: string;
}

export default function GameHistory({ puuid }: { puuid: string }) {
  const [matchHistory, setMatchHistory] = useState<MatchData[]>([]);
  const [spellData, setSpellData] = useState<Record<string, SpellData>>({});

  useEffect(() => {
    const fetchMatchHistory = async () => {
      try {
        const matches = await fetchMatchHistoryByPUUID(puuid, 5);
        const detailedMatches = matches.map((match: any) => {
          const participant = match.info.participants.find(
            (p: any) => p.puuid === puuid
          );
          const teammates = match.info.participants
            .filter(
              (p: any) => p.teamId === participant.teamId && p.puuid !== puuid
            )
            .map((t: any) => ({
              summonerName: t.summonerName,
              champion: t.championName,
            }));
          console.log(match);
          return {
            matchId: match.metadata.matchId,
            gameMode: match.info.gameMode,
            champion: participant.championName,
            kills: participant.kills,
            deaths: participant.deaths,
            assists: participant.assists,
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

    fetchMatchHistory();
    fetchSpells();
  }, [puuid]);

  return (
    <div className="mt-4">
      {matchHistory.length > 0 ? (
        matchHistory.map((match, index) => (
          <div
            key={index}
            className="bg-gray-900 p-4 rounded-lg mb-4 border border-gray-700"
          >
            {/* Górny rząd - tryb gry, ikona czempiona */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-white">{match.gameMode}</p>
              <Image
                className="w-10 h-10 rounded-full"
                src={`https://ddragon.leagueoflegends.com/cdn/12.18.1/img/champion/${match.champion}.png`}
                alt={match.champion}
                width={40}
                height={40}
              />
            </div>
            {/* Wynik gry */}
            <p
              className={`text-${
                match.win ? "green" : "red"
              }-500 font-bold text-xl mt-2`}
            >
              {match.win ? "Zwycięstwo" : "Porażka"}
            </p>
            {/* Statystyki */}
            <div className="flex items-center mt-2">
              <p className="text-white text-lg">
                {match.kills}/{match.deaths}/{match.assists}
              </p>
              <p className="text-gray-400 text-sm ml-2">
                KDA: {match.kda.toFixed(2)}
              </p>
            </div>
            <div className="text-gray-400 text-xs mt-1">
              <p>Czas gry: {(match.gameDuration / 60).toFixed(2)} min</p>
              <p>Data: {match.gameDate}</p>
            </div>
            {/* Czar przywoływacza */}
            <div className="flex mt-2">
              <SummonerSpells
                spellIds={match.summonerSpells}
                spellData={spellData}
              />
            </div>
            {/* Runy */}
            <div className="flex mt-2">
              {match.runes.map((runeId, idx) => (
                <Image
                  key={idx}
                  className="w-10 h-10"
                  src={`https://ddragon.leagueoflegends.com/cdn/img/${runeId}.png`}
                  alt={`Rune ${runeId}`}
                  width={40}
                  height={40}
                />
              ))}
            </div>
            {/* Teammates */}
            <h3 className="text-white mt-4">Drużyna:</h3>
            <div className="flex flex-wrap mt-1">
              {match.teammates.map((teammate, idx) => (
                <div key={idx} className="flex items-center mr-2">
                  <Image
                    className="w-8 h-8 rounded-full"
                    src={`https://ddragon.leagueoflegends.com/cdn/12.18.1/img/champion/${teammate.champion}.png`}
                    alt={teammate.champion}
                    width={32}
                    height={32}
                  />
                  <p className="text-gray-400 ml-2">{teammate.summonerName}</p>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p className="text-white">Brak wyników.</p>
      )}
    </div>
  );
}
