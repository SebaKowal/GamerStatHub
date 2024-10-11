import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/client";

// Typ danych ikon
export interface TierIconData {
  tier: string;
  url: string;
}

// Hook do pobierania ścieżek ikon z Supabase Storage
export const useTierIcons = () => {
  const [tierIcons, setTierIcons] = useState<TierIconData[]>([]);
  const supabase = createSupabaseBrowser();
  useEffect(() => {
    const fetchTierIcons = async () => {
      const tiers = [
        "Iron",
        "Bronze",
        "Silver",
        "Gold",
        "Platinium",
        "Emerald",
        "Diamond",
        "Master",
        "GrandMaster",
        "Challenger",
        "Unranked",
      ];

      const iconsPromises = tiers.map(async (tier) => {
        try {
          const { data } = await supabase.storage
            .from("TierIcons")
            .getPublicUrl(`Iconsv4/${tier}.png`);

          if (data?.publicUrl) {
            return { tier, url: data.publicUrl };
          } else {
            console.error(`Public URL not found for ${tier}`);
            return { tier, url: "" };
          }
        } catch (error) {
          console.error(`Error fetching icon for ${tier}:`, error);
          return { tier, url: "" };
        }
      });

      const icons = await Promise.all(iconsPromises);
      setTierIcons(icons);
    };

    fetchTierIcons();
  }, []);
  return tierIcons;
};

export const getTierIcon = (
  tier: string,
  tierIcons: TierIconData[]
): string => {
  const tierIcon = tierIcons.find(
    (icon) => icon.tier.toLowerCase() === tier.toLowerCase()
  );

  // Sprawdź, czy ikona została znaleziona, jeśli nie, zwróć domyślny URL dla Unranked
  if (tierIcon) {
    return tierIcon.url;
  } else if (tier.toLowerCase() === "unranked") {
    return "https://yymvpswjxnabayeagyza.supabase.co/storage/v1/object/public/TierIcons/Iconsv4/Unranked.png"; // Zastąp odpowiednim URL dla ikony Unranked
  }

  return ""; // Zwraca pusty string, jeśli nie znaleziono ikony
};
