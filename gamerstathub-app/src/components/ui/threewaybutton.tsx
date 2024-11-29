import React from "react";

interface ThreeWayButtonProps {
  filter: "all" | "friends" | "none";
  onFilterChange: (newFilter: "all" | "friends" | "none") => void;
}

const ThreeWayButton: React.FC<ThreeWayButtonProps> = ({
  filter,
  onFilterChange,
}) => {
  return (
    <div className="relative w-48 h-10 rounded-full flex items-center">
      <div
        className={`absolute top-0 left-0 h-full w-1/3 rounded-full transition-transform duration-300 ${
          filter === "all"
            ? "translate-x-0 bg-blue-700"
            : filter === "friends"
            ? "translate-x-full bg-green-600"
            : "translate-x-[200%] bg-blue-700"
        }`}
      ></div>
      <button
        className={`w-1/3 text-sm text-center z-10 ${
          filter === "all" ? "text-white" : "text-gray-200"
        }`}
        onClick={() => onFilterChange("all")}
      >
        All
      </button>
      <button
        className={`w-1/3 text-sm text-center z-10 ${
          filter === "friends" ? "text-white" : "text-gray-200"
        }`}
        onClick={() => onFilterChange("friends")}
      >
        Friends
      </button>
      <button
        className={`w-1/3 text-sm text-center z-10 ${
          filter === "none" ? "text-white" : "text-gray-200"
        }`}
        onClick={() => onFilterChange("none")}
      >
        Others
      </button>
    </div>
  );
};

export default ThreeWayButton;
