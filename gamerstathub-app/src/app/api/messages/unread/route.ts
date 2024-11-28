import { NextResponse } from "next/server";
import { createSupabaseBrowser } from "@/lib/supabase/client";

export async function GET(req: Request) {
  const supabase = createSupabaseBrowser();
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("Message")
      .select("*")
      .eq("Viewed_By_Recipient", false)
      .neq("Sender_ID", userId);

    if (error) {
      console.error("Error fetching unread messages:", error);
      return NextResponse.json(
        { error: "Failed to fetch unread messages" },
        { status: 500 }
      );
    }

    return NextResponse.json({ messages: data });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}
