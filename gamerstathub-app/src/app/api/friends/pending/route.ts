import { NextResponse } from "next/server";
import { createSupabaseBrowser } from "@/lib/supabase/client";

const supabase = createSupabaseBrowser();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("Friendship")
      .select(
        `
        Friendship_ID,
        User_1_ID,
        User_2_ID,
        FriendshipStatus (
          Pending
        )
      `
      )
      .eq("User_2_ID", userId)
      .eq("FriendshipStatus.Pending", true);

    if (error) {
      throw error;
    }

    return NextResponse.json({ pendingInvitations: data });
  } catch (err) {
    console.error("Error fetching pending invitations:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
