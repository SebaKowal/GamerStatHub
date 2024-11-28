import { NextResponse } from "next/server";
import { createSupabaseBrowser } from "@/lib/supabase/client";
import { FriendshipStatus } from "@/components/interfaces";

const supabase = createSupabaseBrowser();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const user1Id = url.searchParams.get("user1Id");
  const user2Id = url.searchParams.get("user2Id");

  if (!user1Id || !user2Id) {
    return NextResponse.json({ error: "Missing user IDs" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("Friendship")
      .select(
        "Friendship_ID, User_1_ID, User_2_ID, FriendshipStatus(Pending, Accepted)"
      )
      .or(`User_1_ID.eq.${user1Id},User_2_ID.eq.${user1Id}`)
      .or(`User_1_ID.eq.${user2Id},User_2_ID.eq.${user2Id}`)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No relationship exists
        return NextResponse.json({ status: "none" });
      }
      throw error;
    }

    const friendshipId = data.Friendship_ID; // Use the correct column name
    const isInviter = data.User_1_ID === user1Id;
    const status = data.FriendshipStatus as unknown as FriendshipStatus;

    if (status.Accepted) {
      return NextResponse.json({
        status: "friends",
        role: isInviter ? "inviter" : "invited",
        friendshipId,
      });
    }

    if (status.Pending) {
      return NextResponse.json({
        status: "pending",
        role: isInviter ? "inviter" : "invited",
        friendshipId,
      });
    }

    return NextResponse.json({ status: "none", friendshipId: null });
  } catch (err) {
    console.error("Error fetching friendship status:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
