"use client";

import { createSupabaseBrowser } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export default function useGamerInfo(userId: any) {
  const supabase = createSupabaseBrowser();

  return useQuery({
    queryKey: [], // Unikalny klucz dla tego zapytania
    queryFn: async () => {
      const { data, error } = await supabase
        .from("GamerInfo") // Wybieramy tabelę gamerInfo
        .select("*") // Wybieramy wszystkie kolumny
        .eq("ID_userAuth", userId)
        .single()
      console.log("Fetched data:", data);
      console.log("Error:", error);
      
      if (error) throw new Error(error.message); // Obsługa błędów
      return data; // Zwracamy dane
    },
    enabled: !!userId, // Zapytanie zostanie włączone tylko, gdy userId jest dostępne
  });
}
