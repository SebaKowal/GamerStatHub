import { createSupabaseBrowser } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export default function useAllGamerInfo() {
  const supabase = createSupabaseBrowser();

  return useQuery({
    queryKey: ["gamerInfo"], // Możesz dodać klucz dla cache'u zapytania
    queryFn: async () => {
      const { data, error } = await supabase.from("GamerInfo").select("*");
      if (error) throw new Error(error.message);
      return data;
    },
  });
}
