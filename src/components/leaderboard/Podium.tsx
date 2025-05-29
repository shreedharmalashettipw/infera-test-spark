import React from "react";

type PodiumItem = {
  data: { gradient: string; position: string; avatar: string; name: string }[];
};

const Podium: React.FC<PodiumItem> = ({ data }) => {
  return (
    <div className="flex justify-center items-end bg-gray-900 px-8">
      {data.map((item, idx) => (
        <div
          key={idx}
          className={`flex flex-col items-center mx-4 ${
            idx === 1 ? "order-2" : idx === 0 ? "order-1" : "order-3"
          }`}
        >
          <div
            className={`${item.gradient} rounded-t-lg rounded-b-lg w-40 ${
              idx === 1 ? "h-64" : "h-52"
            } relative flex flex-col items-center pt-4`}
          >
            <div className="absolute top-2">
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                {item.position.toUpperCase()}
              </span>
            </div>
            <div
              className={`absolute w-20 h-20 rounded-full border-4 border-white shadow-lg bottom-[-2.5rem] bg-gray-500 flex items-center justify-center text-white font-bold text-lg`}
            >
              {item.name
                .split(" ")
                .map((word) => word[0])
                .join("")
                .toUpperCase()}
            </div>
            <span className="mt-16 text-sm font-medium text-white">
              {item.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Podium;
