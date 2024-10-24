"use client";

import Link from "next/link";
import useAllGamerInfo from "./hook/useAllGamerInfo";

const MainPage = () => {
  const { data: users, isLoading, error } = useAllGamerInfo();

  if (isLoading) return <div className="p-12 min-h-screen">Loading...</div>;
  if (error)
    return <div className="p-12 min-h-screen">Error: {error.message}</div>;

  return (
    <div className="p-12 min-h-screen">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {users?.map((user) => (
          <Link
            key={user.GamerInfo_ID}
            href={`/userHistory/${user.GameNick}#${user.GameTag}`}
            passHref
          >
            <div className="border border-gray-300 p-4 rounded-lg shadow-md bg-white dark:bg-gray-800 dark:border-gray-700 cursor-pointer hover:shadow-lg transition-shadow duration-200">
              <h2 className="text-xl font-semibold mb-2">
                {user.PageUsername}
              </h2>
              <p className="mb-1">{user.GameNick}</p>
              <p className="mb-1">{user.GameTag}</p>
              <p className="mb-3">{user.Description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default MainPage;
