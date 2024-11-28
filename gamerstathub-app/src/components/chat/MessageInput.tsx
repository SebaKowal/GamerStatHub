import React, { useState } from "react";
import { MessageInputProps } from "../types";
import { Button } from "@nextui-org/button";

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [content, setContent] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    onSendMessage(content);
    setContent("");
  };

  return (
    <form className="flex" onSubmit={handleSendMessage}>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type a message..."
        className="border rounded px-4 py-2 w-full mr-2 bg-zinc-900"
      />
      <Button type="submit" variant="flat">
        Send
      </Button>
    </form>
  );
};

export default MessageInput;
