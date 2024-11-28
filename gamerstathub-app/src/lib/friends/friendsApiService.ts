import axios from "axios";

export const fetchChatMessages = async (chatId: string) => {
  try {
    const response = await axios.get(`/api/chats/fetch`, {
      params: { chatId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    throw error;
  }
};

export const sendMessage = async (
  chatId: string,
  senderId: string,
  message: string
) => {
  try {
    const response = await axios.post("/api/chats/send", {
      chatId,
      senderId,
      message,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const sendFriendRequest = async (userId: string, friendId: string) => {
  try {
    const response = await axios.post("/api/friends/request", {
      userId,
      friendId,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending friend request:", error);
    throw error;
  }
};

export const respondToFriendRequest = async (
  friendshipId: string,
  accepted: boolean
) => {
  try {
    const response = await axios.post("/api/friends/respond", {
      friendshipId,
      accepted,
    });
    return response.data;
  } catch (error) {
    console.error("Error responding to friend request:", error);
    throw error;
  }
};

export const respondToInvitation = async (
  friendshipId: number,
  accepted: boolean
) => {
  try {
    return await respondToFriendRequest(friendshipId.toString(), accepted);
  } catch (error) {
    console.error("Error responding to invitation:", error);
    throw error;
  }
};

export const checkFriendshipStatus = async (
  user1Id: string,
  user2Id: string
): Promise<
  "none" | "friends" | "pending_sent" | "pending_received" | "rejected"
> => {
  try {
    const response = await axios.get("/api/friends/status", {
      params: { user1Id, user2Id },
    });
    return response.data.status;
  } catch (error) {
    console.error("Error checking friendship status:", error);
    return "none";
  }
};
