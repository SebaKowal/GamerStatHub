import { NextResponse } from "next/server";
import { createSupabaseBrowser } from "@/lib/supabase/client";

const supabase = createSupabaseBrowser();

export async function GET(
  req: Request,
  { params }: { params: { friendshipId: string } }
) {
  const { friendshipId } = params;

  if (!friendshipId || isNaN(Number(friendshipId))) {
    return NextResponse.json(
      { error: "Invalid Friendship ID", params },
      { status: 400 }
    );
  }

  try {
    const { data: chatData, error: chatError } = await supabase
      .from("Chat")
      .select("Chat_ID")
      .eq("Friendship_ID", friendshipId)
      .single();

    if (chatError || !chatData?.Chat_ID) {
      return NextResponse.json(
        { error: "Chat not found for given Friendship ID" },
        { status: 404 }
      );
    }

    const chatId = chatData.Chat_ID;
    const { data: messages, error: messageError } = await supabase
      .from("Message")
      .select("*")
      .eq("Chat_ID", chatId)
      .order("Sent_At", { ascending: true });

    if (messageError) {
      return NextResponse.json(
        { error: "Failed to fetch messages", details: messageError },
        { status: 500 }
      );
    }

    return NextResponse.json(messages);
  } catch (err) {
    return NextResponse.json(
      { error: "Unexpected error occurred", details: err },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { friendshipId: string } }
) {
  const { friendshipId } = params;
  const { content, senderId } = await req.json();

  if (!friendshipId || isNaN(Number(friendshipId)) || !content || !senderId) {
    return NextResponse.json(
      {
        error: "Invalid request data",
        params: { friendshipId, content, senderId },
      },
      { status: 400 }
    );
  }

  try {
    const { data: chatData, error: chatError } = await supabase
      .from("Chat")
      .select("Chat_ID")
      .eq("Friendship_ID", friendshipId)
      .single();

    if (chatError || !chatData?.Chat_ID) {
      return NextResponse.json(
        { error: "Chat not found for given Friendship ID" },
        { status: 404 }
      );
    }

    const chatId = chatData.Chat_ID;
    const { data: newMessage, error: insertError } = await supabase
      .from("Message")
      .insert({
        Chat_ID: chatId,
        Content: content,
        Sender_ID: senderId,
        Sent_At: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: "Failed to send message", details: insertError },
        { status: 500 }
      );
    }

    return NextResponse.json(newMessage, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Unexpected error occurred", details: err },
      { status: 500 }
    );
  }
}
