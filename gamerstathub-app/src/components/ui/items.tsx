import Image from "next/image";
import { ItemData } from "@/lib/riot/riotApiService";

interface ItemsProps {
  itemIds?: string[];
  itemData: Record<string, ItemData>;
}

export default function Items({ itemIds = [], itemData }: ItemsProps) {
  const baseUrl = "https://ddragon.leagueoflegends.com/cdn/14.20.1/img/item/";
  const maxItems = 6;
  const filledItemIds = [...itemIds];

  while (filledItemIds.length < maxItems) {
    filledItemIds.push();
  }

  //console.log("Received itemIds:", itemIds);
  //console.log("Received itemData:", itemData);

  return (
    <div className="grid grid-rows-2 grid-cols-3 gap-1 ">
      {filledItemIds.slice(0, maxItems).map((itemId, index) => {
        const item = itemId ? itemData[itemId] : null;
        const iconUrl = item?.image?.full
          ? `${baseUrl}${item.image.full}`
          : null;

        return (
          <div key={index} className="w-6 h-6">
            {item && iconUrl ? (
              <Image
                src={iconUrl}
                alt={item.name}
                width={48}
                height={48}
                className="rounded"
              />
            ) : (
              <div className="w-6 h-6 bg-gray-600 rounded" />
            )}
          </div>
        );
      })}
    </div>
  );
}
