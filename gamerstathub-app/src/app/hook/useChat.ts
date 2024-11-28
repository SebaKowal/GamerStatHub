import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Message } from "@/components/types";

const useChat = (friendshipId: number, currentUserId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const previousMessagesRef = useRef<Message[]>([]);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!currentUserId) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/messages/${friendshipId}`);
        const fetchedMessages: Message[] = response.data;

        setMessages(fetchedMessages);
        previousMessagesRef.current = fetchedMessages;

        fetchedMessages
          .filter(
            (msg) => !msg.Viewed_By_Recipient && msg.Sender_ID !== currentUserId
          )
          .forEach((msg) => markMessageAsRead(msg.Message_ID));
      } catch (error) {
        console.error("[useChat] Error fetching messages:", error);
      }
    };

    fetchMessages();
    pollingIntervalRef.current = setInterval(fetchMessages, 5000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [friendshipId, currentUserId]);

  const markMessageAsRead = async (messageId: number) => {
    if (!currentUserId) return; 
    try {
      await axios.post("/api/messages/markAsRead", {
        messageId,
        userId: currentUserId,
      });
      console.log("Message marked as read:", messageId);
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const sendMessage = async (content: string) => {
    if (!currentUserId || !content.trim()) return; 

    const temporaryMessage: Message = {
      Message_ID: Date.now(),
      Chat_ID: friendshipId,
      Content: content,
      Sender_ID: currentUserId,
      Sent_At: new Date().toISOString(),
      Viewed_By_Recipient: undefined,
    };

    setMessages((prev) => [...prev, temporaryMessage]);

    try {
      const response = await axios.post(`/api/messages/${friendshipId}`, {
        content,
        senderId: currentUserId,
      });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.Message_ID === temporaryMessage.Message_ID ? response.data : msg
        )
      );
    } catch (error) {
      console.error("[useChat] Error sending message:", error);
    }
  };

  return { messages, sendMessage };
};

export default useChat;
