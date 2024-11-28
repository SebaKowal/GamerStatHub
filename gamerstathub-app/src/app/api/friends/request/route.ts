import { NextResponse } from "next/server";
import { createSupabaseBrowser } from "@/lib/supabase/client";

const supabase = createSupabaseBrowser();

export async function POST(req: Request) {
  const { userId, friendId } = await req.json();

  if (!userId || !friendId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const { data: status, error: statusError } = await supabase
      .from("FriendshipStatus")
      .insert([{ Pending: true, Accepted: false, Rejected: false }])
      .select("FriendshipStatus_ID")
      .single();

    if (statusError) throw statusError;

    const { error: friendshipError } = await supabase
      .from("Friendship")
      .insert([
        {
          User_1_ID: userId,
          User_2_ID: friendId,
          ID_FriendshipStatus: status.FriendshipStatus_ID,
        },
      ]);

    if (friendshipError) throw friendshipError;

    return NextResponse.json({ message: "Friend request sent" });
  } catch (err) {
    console.error("Error sending friend request:", err);
    return NextResponse.json(
      { error: "Failed to send request" },
      { status: 500 }
    );
  }
}
