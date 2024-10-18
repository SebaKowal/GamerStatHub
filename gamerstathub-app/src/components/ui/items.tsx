// /components/Items.tsx

import Image from 'next/image';

interface ItemData {
  id: string;
  name: string;
  description: string;
  image: {
    full: string;
  };
}

interface ItemsProps {
  itemIds: string[];
  itemData: Record<string, ItemData>;
}

export default function Items({ itemIds, itemData }: ItemsProps) {
  return (
    <div className="flex mt-2">
      {itemIds.map((itemId, idx) => {
        const item = itemData[itemId];
        return (
          <div key={idx} className="mr-2">
            {item && (
              <>
                <Image
                  src={`https://ddragon.leagueoflegends.com/cdn/14.20.1/img/item/${item.image.full}`}
                  alt={item.name}
                  width={40}
                  height={40}
                />
                <p className="text-gray-400 text-xs">{item.name}</p>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
