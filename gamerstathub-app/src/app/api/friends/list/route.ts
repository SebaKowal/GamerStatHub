import { NextResponse } from "next/server";
import { createSupabaseBrowser } from "@/lib/supabase/client";

const supabase = createSupabaseBrowser();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("Friendship")
      .select(
        `
        Friendship_ID,
        User_1_ID,
        User_2_ID,
        FriendshipStatus(Accepted)
      `
      )
      .or(`User_1_ID.eq.${userId},User_2_ID.eq.${userId}`)
      .filter("FriendshipStatus.Accepted", "eq", true);

    if (error) {
      console.error("Error fetching friends list:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    const friendIds = data.map((friendship) =>
      friendship.User_1_ID === userId
        ? friendship.User_2_ID
        : friendship.User_1_ID
    );

    return NextResponse.json({ friends: friendIds });
  } catch (err) {
    console.error("Error processing request:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
