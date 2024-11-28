import Image from "next/image";
import { SummonerIconProps } from "../interfaces";

const SummonerIcon: React.FC<SummonerIconProps> = ({
  profileIconId,
  gameNick,
  gameTag,
  summonerLevel,
}) => {
  return (
    <div className="flex items-center bg-gray-800 rounded-lg pt-2 p-4 m-2">
      <Image
        className="w-14 h-14 mr-3 rounded-sm mt-2"
        src={`https://ddragon.leagueoflegends.com/cdn/14.20.1/img/profileicon/${profileIconId}.png`}
        alt={`${gameNick}'s Icon`}
        width={56}
        height={56}
      />
      <div className="text-white">
        <p className="text-lg font-bold">{gameNick}</p>
        <p className="text-sm">#{gameTag}</p>
        <p className="text-xs">Level: {summonerLevel}</p>
      </div>
    </div>
  );
};

export default SummonerIcon;
