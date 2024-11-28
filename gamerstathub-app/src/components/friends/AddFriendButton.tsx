import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUserPlus,
  FaComments,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import ChatPopup from "../chat/ChatPopUp";
import { Props } from "../types";

const AddFriendButton: React.FC<Props> = ({ currentUserId, targetUserId }) => {
  const [status, setStatus] = useState<
    "none" | "friends" | "pending_sent" | "pending_received" | "rejected"
  >("none");
  const [friendshipId, setFriendshipId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get("/api/friends/status", {
          params: { user1Id: currentUserId, user2Id: targetUserId },
        });

        const { status, role, friendshipId: id } = response.data;

        setFriendshipId(id || null);
        if (status === "pending") {
          setStatus(role === "inviter" ? "pending_sent" : "pending_received");
        } else {
          setStatus(status);
        }
      } catch (error) {
        console.error("Error fetching friendship status:", error);
      }
    };

    fetchStatus();
  }, [currentUserId, targetUserId]);

  const handleAddFriend = async () => {
    setLoading(true);
    try {
      await axios.post("/api/friends/request", {
        userId: currentUserId,
        friendId: targetUserId,
      });
      setStatus("pending_sent");
    } catch (error) {
      console.error("Error sending friend request:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async () => {
    if (!friendshipId) return;

    setLoading(true);
    try {
      await axios.post("/api/friends/respond", {
        friendshipId,
        accepted: true,
      });
      setStatus("friends");
    } catch (error) {
      console.error("Error accepting invitation:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectInvitation = async () => {
    if (!friendshipId) return;

    setLoading(true);
    try {
      await axios.post("/api/friends/respond", {
        friendshipId,
        accepted: false,
      });
      setStatus("none");
    } catch (error) {
      console.error("Error rejecting invitation:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChat = () => {
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-x-2 gap-y-4">
        <FaUserPlus
          className={`cursor-pointer ${
            status === "none" && !loading ? "text-blue-500" : "text-gray-600"
          }`}
          onClick={status === "none" && !loading ? handleAddFriend : undefined}
          title="Add Friend"
        />

        <FaComments
          className={`cursor-pointer ${
            status === "friends" ? "text-blue-500" : "text-gray-600"
          }`}
          onClick={status === "friends" ? handleOpenChat : undefined}
          title="Open Chat"
        />

        <FaCheckCircle
          className={`cursor-pointer ${
            status === "pending_received" && !loading
              ? "text-green-500"
              : "text-gray-600"
          }`}
          onClick={
            status === "pending_received" && !loading
              ? handleAcceptInvitation
              : undefined
          }
          title="Accept Friend Request"
        />

        <FaTimesCircle
          className={`cursor-pointer ${
            status === "pending_received" && !loading
              ? "text-red-500"
              : "text-gray-600"
          }`}
          onClick={
            status === "pending_received" && !loading
              ? handleRejectInvitation
              : undefined
          }
          title="Reject Friend Request"
        />
      </div>

      {showChat && friendshipId && (
        <ChatPopup
          friendshipId={friendshipId}
          currentUserId={currentUserId}
          onClose={handleCloseChat}
        />
      )}
    </div>
  );
};

export default AddFriendButton;
