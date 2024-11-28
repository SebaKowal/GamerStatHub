export type ChatPopupProps = {
  friendshipId: number;
  currentUserId: string;
  onClose: () => void;
};

export type MessageInputProps = {
  onSendMessage: (content: string) => void;
};

export type MessageListProps = {
  messages: Message[];
};

export type Props = {
  currentUserId: string;
  targetUserId: string;
};

export type Message = {
  Viewed_By_Recipient: any;
  Message_ID: number;
  Chat_ID: number; // Zmienione na number
  Content: string;
  Sender_ID: string;
  Sent_At: string;
};

export type FilterButtonProps = {
  currentFilter: "all" | "friends";
  onFilterChange: (filter: "all" | "friends") => void;
};
