import { createSupabaseBrowser } from "@/lib/supabase/client";

const useUpdateGamerInfo = () => {
  const upsertGamerInfo = async (userId, gamerData) => {
    const supabase = createSupabaseBrowser();

    console.log("Dane do aktualizacji/wstawienia:", gamerData);

    // Check if the user already has data in the table
    const { data, error: fetchError } = await supabase
      .from("GamerInfo")
      .select()
      .eq("ID_userAuth", userId)
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching gamer info:", fetchError);
      return false;
    }

    if (data) {
      // Update existing data
      console.log("Updating gamer info...");
      const { error } = await supabase
        .from("GamerInfo")
        .update(gamerData)
        .eq("ID_userAuth", userId);

      if (error) {
        console.error("Error updating gamer info:", error);
        return false;
      } else {
        console.log("Gamer info updated successfully.");
      }
    } else {
      // Insert new data
      console.log("Inserting new gamer info...");
      const { error } = await supabase
        .from("GamerInfo")
        .insert({ ...gamerData, ID_userAuth: userId });

      if (error) {
        console.error("Error inserting gamer info:", error);
        return false;
      } else {
        console.log("New gamer info added successfully.");
      }
    }

    return true;
  };

  return { upsertGamerInfo };
};

export default useUpdateGamerInfo;
