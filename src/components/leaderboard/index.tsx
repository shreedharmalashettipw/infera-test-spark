import { useEffect, useState } from "react";
import Podium from "./Podium.tsx";
import axios from "axios";
import { useQueryParam } from "@/hooks/useQueryParam.tsx";

const podiumInitialData = [
  {
    position: "2nd",
    gradient: "bg-gradient-to-b from-purple-500 to-purple-700",
  },
  {
    position: "1st",
    gradient: "bg-gradient-to-b from-yellow-500 to-yellow-600",
  },
  {
    position: "3rd",
    gradient: "bg-gradient-to-b from-purple-700 to-purple-900",
  },
];

const LeaderboardScreen = () => {
  const [leaders, setLeaders] = useState([]);
  const [podiumData, setPodiumData] = useState([]);
  const testId = useQueryParam("testId") as string;
  const userId = useQueryParam("userId") as string;

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const response = await axios.get(
          "https://stage-api.penpencil.co/v3/test-service/infera-practice/leaderboard",
          {
            params: {
              testId,
              userId,
            },
            headers: {
              Authorization:
                "Bearer 2044b922-7482-4a98-b1ae-bcb178e3957c-1748445717978",
            },
          }
        );
        const data = response?.data?.data?.leaderboard ?? [];
        setLeaders(data);
        const topThree = data.slice(0, 3);
        const updatedPodiumData = podiumInitialData.map((podium, index) => ({
          ...podium,
          name: topThree[index]?.name || "N/A",
        }));
        setPodiumData(updatedPodiumData);
      } catch (error) {
        console.error("Error fetching leaders data:", error);
      }
    };

    fetchLeaders();
  }, []);

  if (leaders.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white ml-4">Loading...</p>
      </div>
    );
  }

  if (leaders.length < 3) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <p className="text-white text-lg">Leaderboard is not ready yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <div>
        <Podium data={podiumData} />
      </div>
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4"></div>
        <table className="w-full text-left table-auto">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2 px-4">Rank</th>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Correct Questions</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((leader, idx) => (
              <tr key={idx} className="border-b border-gray-700">
                <td className="py-3 px-4">{leader.rank}</td>
                <td className="py-3 px-4 flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center text-white font-bold text-xs">
                    {leader.name
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <span>{leader.name}</span>
                </td>

                <td className="py-3 px-4">{leader.correctQuestion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default LeaderboardScreen;
