import { NextResponse } from "next/server";
import { createSupabaseBrowser } from "@/lib/supabase/client";

const supabase = createSupabaseBrowser();

export async function POST(req: Request) {
  try {
    const { friendshipId, accepted } = await req.json();

    if (!friendshipId || typeof accepted !== "boolean") {
      console.error("Invalid request data:", { friendshipId, accepted });
      return NextResponse.json(
        {
          error:
            "Invalid request data. Friendship ID or accepted status is missing.",
        },
        { status: 400 }
      );
    }

    const { data: friendshipData, error: friendshipError } = await supabase
      .from("Friendship")
      .select("*")
      .eq("Friendship_ID", friendshipId)
      .single();

    if (friendshipError || !friendshipData?.ID_FriendshipStatus) {
      console.error(
        "Friendship not found or invalid. Query error:",
        friendshipError
      );
      return NextResponse.json(
        { error: "Friendship ID not found or invalid." },
        { status: 404 }
      );
    }

    const friendshipStatusId = friendshipData.ID_FriendshipStatus;

    const { error: updateError } = await supabase
      .from("FriendshipStatus")
      .update({
        Pending: false,
        Accepted: accepted,
        Rejected: !accepted,
      })
      .eq("FriendshipStatus_ID", friendshipStatusId);

    if (updateError) {
      console.error("Error updating FriendshipStatus:", updateError);
      throw updateError;
    }

    console.log("Friendship status updated successfully.");

    let chatId;

    if (accepted) {
      const { data: existingChat, error: chatError } = await supabase
        .from("Chat")
        .select("Chat_ID")
        .eq("Friendship_ID", friendshipId)
        .maybeSingle();

      if (chatError) {
        console.error("Error checking for existing chat:", chatError);
        return NextResponse.json(
          { error: "Error checking for existing chat." },
          { status: 500 }
        );
      }

      if (!existingChat) {
        const { data: newChat, error: chatCreationError } = await supabase
          .from("Chat")
          .insert({ Friendship_ID: friendshipId })
          .select("Chat_ID")
          .single();

        if (chatCreationError) {
          console.error("Error creating chat:", chatCreationError);
          return NextResponse.json(
            { error: "Error creating chat." },
            { status: 500 }
          );
        }

        chatId = newChat.Chat_ID;

        const welcomeMessages = [
          {
            Chat_ID: chatId,
            Content: "Hello, new friend!",
            Sender_ID: friendshipData.User_1_ID,
            Sent_At: new Date(),
          },
          {
            Chat_ID: chatId,
            Content: "Hello, new friend!",
            Sender_ID: friendshipData.User_2_ID,
            Sent_At: new Date(),
          },
        ];

        const { error: messageError } = await supabase
          .from("Message")
          .insert(welcomeMessages);

        if (messageError) {
          console.error("Error creating welcome messages:", messageError);
          return NextResponse.json(
            { error: "Error creating welcome messages." },
            { status: 500 }
          );
        }

        console.log("Welcome messages created successfully.");
      } else {
        chatId = existingChat.Chat_ID;
        console.log("Chat already exists with Chat_ID:", chatId);
      }
    }

    return NextResponse.json({ success: true, chatId });
  } catch (err) {
    console.error("Unexpected error occurred:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
