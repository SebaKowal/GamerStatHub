"use client";

import React, { useEffect, useState } from "react";
import useUser from "@/app/hook/useUser";
import useGamerInfo from "@/app/hook/useGamerInfo";
import useUpdateGamerInfo from "@/app/hook/useUpdateGamerInfo";

const ProfilePage = () => {
  const { data: user, isLoading: userLoading, error: userError } = useUser();
  const {
    data: gamerInfo,
    isLoading: gamerLoading,
    error: gamerError,
    refetch: refetchGamerInfo,
  } = useGamerInfo(user?.id);
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
    }
  }, [gamerInfo]);

  const handleUpsertGamerInfo = async () => {
    try {
      await upsertGamerInfo(user?.id, editedData);
      setIsEditing(false);
      refetchGamerInfo();
    } catch (error) {
      console.error("Error updating gamer info:", error);
    }
  };

  if (userLoading || gamerLoading)
    return (
      <p className="flex min-h-screen flex-col p-24 items-center justify-between">
        Loading...
      </p>
    );
  if (userError) return <p>Error loading user data: {userError.message}</p>;
  if (gamerError) console.error(gamerError);

  return (
    <div className="flex min-h-screen flex-col p-24 lg:px-80 xl:px-96">
      {user ? (
        <>
          <div className="space-y-6">
            <div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold w-28">Game Nick</span>
                  {isEditing ? (
                    <input
                      type="text"
                      maxLength={30}
                      value={editedData.GameNick}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          GameNick: e.target.value,
                        })
                      }
                      className="border p-1"
                    />
                  ) : (
                    <span>{editedData.GameNick}</span>
                  )}
                  <button
                    className="hover:underline"
                    onClick={
                      isEditing
                        ? handleUpsertGamerInfo
                        : () => setIsEditing(true)
                    }
                  >
                    {isEditing ? "Save" : "Edit"}
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-semibold w-28">Game Tag</span>
                  {isEditing ? (
                    <input
                      type="text"
                      maxLength={30}
                      value={editedData.GameTag}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          GameTag: e.target.value,
                        })
                      }
                      className="border p-1"
                    />
                  ) : (
                    <span>{editedData.GameTag}</span>
                  )}
                  <button
                    className="hover:underline"
                    onClick={
                      isEditing
                        ? handleUpsertGamerInfo
                        : () => setIsEditing(true)
                    }
                  >
                    {isEditing ? "Save" : "Edit"}
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <span className="font-semibold w-28">Description</span>
                  {isEditing ? (
                    <input
                      type="text"
                      maxLength={30}
                      value={editedData.Description}
                      onChange={(e) =>
                        setEditedData({
                          ...editedData,
                          Description: e.target.value,
                        })
                      }
                      className="border p-1"
                    />
                  ) : (
                    <span>{editedData.Description}</span>
                  )}
                  <button
                    className="hover:underline"
                    onClick={
                      isEditing
                        ? handleUpsertGamerInfo
                        : () => setIsEditing(true)
                    }
                  >
                    {isEditing ? "Save" : "Edit"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>No user found</p>
      )}
    </div>
  );
};

export default ProfilePage;
