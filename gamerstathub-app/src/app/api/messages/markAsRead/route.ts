import { NextResponse } from "next/server";
import { createSupabaseBrowser } from "@/lib/supabase/client";

export async function POST(req: Request) {
  const supabase = createSupabaseBrowser();
  const { messageId, userId } = await req.json();

  if (!messageId || !userId) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("Message")
      .update({ Viewed_By_Recipient: true })
      .eq("Message_ID", messageId)
      .neq("Sender_ID", userId);

    if (error) {
      console.error("Error marking message as read:", error);
      return NextResponse.json(
        { error: "Failed to mark message as read" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}
