import React, { useEffect, useRef } from "react";
import MessageInput from "./MessageInput";
import useChat from "@/app/hook/useChat";
import { ChatPopupProps } from "../types";

const ChatPopup: React.FC<ChatPopupProps> = ({
  friendshipId,
  currentUserId,
  onClose,
}) => {
  const { messages, sendMessage } = useChat(friendshipId, currentUserId);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-stone-950 w-96 h-[80vh] rounded-lg shadow-lg flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Chat</h2>
          <button onClick={onClose} className="text-red-500 hover:text-red-700">
            X
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.Message_ID}
              className={`flex ${
                message.Sender_ID === currentUserId
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] p-2 rounded-lg text-white ${
                  message.Sender_ID === currentUserId
                    ? "bg-[#4A4A4A]"
                    : "bg-[#333333]"
                }`}
              >
                <span>{message.Content}</span>
                <div className="text-xs text-gray-300 flex items-center">
                  <div className="flex">
                    {new Date(message.Sent_At).toLocaleDateString([], {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}{" "}
                    {new Date(message.Sent_At).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  {message.Sender_ID === currentUserId && (
                    <div className="flex ml-auto">
                      <span className="ml-2">
                        {message.Viewed_By_Recipient ? (
                          <svg
                            className="w-3 h-3 text-blue-500 "
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M9 16.2l-4.2-4.2-1.4 1.4L9 19l12-12-1.4-1.4z" />
                          </svg>
                        ) : (
                          <svg
                            className="w-3 h-3 text-blue-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <circle cx="12" cy="12" r="10" />
                          </svg>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>

        <div className="p-4 border-t">
          <MessageInput onSendMessage={sendMessage} />
        </div>
      </div>
    </div>
  );
};

export default ChatPopup;
