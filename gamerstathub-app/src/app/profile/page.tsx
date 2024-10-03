"use client"; // Important for Next.js Client Components

import React, { useEffect, useState } from "react";
import useUser from "@/app/hook/useUser"; // Hook to get user data
import useGamerInfo from "@/app/hook/useGamerInfo"; // Hook to fetch gamer info
import useUpdateGamerInfo from "@/app/hook/useUpdateGamerInfo"; // Hook for upserting gamer info
import { Divider } from "@nextui-org/divider";

const ProfilePage = () => {
  const { data: user, isLoading: userLoading, error: userError } = useUser();
  const { data: gamerInfo, isLoading: gamerLoading, error: gamerError, refetch } = useGamerInfo(user?.id);
  const { upsertGamerInfo } = useUpdateGamerInfo();

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    PageUsername: "Fill in your information",
    GameNick: "Fill in your information",
    GameTag: "Fill in your information",
    Description: "Fill in your information",
  });

  useEffect(() => {
    if (gamerInfo) {
      setEditedData({
        PageUsername: gamerInfo.PageUsername || "Fill in your information",
        GameNick: gamerInfo.GameNick || "Fill in your information",
        GameTag: gamerInfo.GameTag || "Fill in your information",
        Description: gamerInfo.Description || "Fill in your information",
      });
    } else {
      setEditedData({
        PageUsername: "Fill in your information",
        GameNick: "Fill in your information",
        GameTag: "Fill in your information",
        Description: "Fill in your information",
      });
    }
  }, [gamerInfo]);

  const handleUpsertGamerInfo = async () => {
    try {
      await upsertGamerInfo(user?.id, editedData);
      setIsEditing(false);
      refetch(); // Refetch gamer info after updating or inserting
    } catch (error) {
      console.error('Error updating gamer info:', error);
    }
  };

  if (userLoading || gamerLoading) return <p className="flex min-h-screen flex-col p-24 items-center justify-between">Loading...</p>;
  if (userError) return <p>Error loading user data: {userError.message}</p>;
  if (gamerError) console.error(gamerError);

  return (
    <div className="flex min-h-screen flex-col p-24 lg:px-80 xl:px-96">
      {user ? (
        <>
          {gamerInfo || gamerError ? (
            <div>
              <div className="space-y-4">
                {/* PageUsername */}
                <div className="flex justify-between items-center">
                  <span className="font-semibold w-28">Username</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.PageUsername}
                      onChange={(e) =>
                        setEditedData({ ...editedData, PageUsername: e.target.value })
                      }
                      className="border p-1"
                    />
                  ) : (
                    <span>{editedData.PageUsername}</span>
                  )}
                  <button
                    className="hover:underline"
                    onClick={isEditing ? handleUpsertGamerInfo : () => setIsEditing(true)}
                  >
                    {isEditing ? "Save" : "Edit"}
                  </button>
                </div>
                <Divider className="my-4" />

                {/* GameNick */}
                <div className="flex justify-between items-center">
                  <span className="font-semibold w-28">Game Nick</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.GameNick}
                      onChange={(e) =>
                        setEditedData({ ...editedData, GameNick: e.target.value })
                      }
                      className="border p-1"
                    />
                  ) : (
                    <span>{editedData.GameNick}</span>
                  )}
                  <button
                    className="hover:underline"
                    onClick={isEditing ? handleUpsertGamerInfo : () => setIsEditing(true)}
                  >
                    {isEditing ? "Save" : "Edit"}
                  </button>
                </div>
                <Divider className="my-4" />

                {/* GameTag */}
                <div className="flex justify-between items-center">
                  <span className="font-semibold w-28">Game Tag</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.GameTag}
                      onChange={(e) =>
                        setEditedData({ ...editedData, GameTag: e.target.value })
                      }
                      className="border p-1"
                    />
                  ) : (
                    <span>{editedData.GameTag}</span>
                  )}
                  <button
                    className="hover:underline"
                    onClick={isEditing ? handleUpsertGamerInfo : () => setIsEditing(true)}
                  >
                    {isEditing ? "Save" : "Edit"}
                  </button>
                </div>
                <Divider className="my-4" />

                {/* Description */}
                <div className="flex justify-between items-center">
                  <span className="font-semibold w-28">Description</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.Description}
                      onChange={(e) =>
                        setEditedData({ ...editedData, Description: e.target.value })
                      }
                      className="border p-1"
                    />
                  ) : (
                    <span>{editedData.Description}</span>
                  )}
                  <button
                    className="hover:underline"
                    onClick={isEditing ? handleUpsertGamerInfo : () => setIsEditing(true)}
                  >
                    {isEditing ? "Save" : "Edit"}
                  </button>
                </div>
                <Divider className="my-4" />
              </div>
            </div>
          ) : (
            <p>No gamer information found. Please fill in your details.</p>
          )}
        </>
      ) : (
        <p>No user found</p>
      )}
    </div>
  );
};

export default ProfilePage;
