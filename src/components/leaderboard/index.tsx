import Podium from "./Podium.tsx";

const traders = [
  { rank: "1", userName: "Harpreet", profit: "$0", winRate: "0%" },
  { rank: "2", userName: "Rishabh", profit: "$0", winRate: "0%" },
  { rank: "3", userName: "Dhrishti", profit: "$0", winRate: "0%" },
  { rank: "4", userName: "Shreedhar", profit: "$0", winRate: "0%" },
  { rank: "5", userName: "Raja", profit: "$0", winRate: "0%" },
  { rank: "6", userName: "Dhaaradhar", profit: "$0", winRate: "0%" },
  { rank: "5", userName: "Sampath", profit: "$0", winRate: "0%" },
];

function LeaderboardScreen() {
  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      {/* Podium Section */}
      <div>
        <Podium />
      </div>

      {/* Top Traders Table */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4"></div>
        <table className="w-full text-left table-auto">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2 px-4">Rank</th>
              <th className="py-2 px-4">User Name</th>
              <th className="py-2 px-4">Profit</th>
              <th className="py-2 px-4">Win Rate</th>
              <th className="py-2 px-4">Performance</th>
            </tr>
          </thead>
          <tbody>
            {traders.map((trader, idx) => (
              <tr key={idx} className="border-b border-gray-700">
                <td className="py-3 px-4">{trader.rank}</td>
                <td className="py-3 px-4 flex items-center space-x-2">
                  <img
                    src={`https://i.pravatar.cc/32?img=${32 + idx}`}
                    alt="avatar"
                    className="w-6 h-6 rounded-full"
                  />
                  <span>{trader.userName}</span>
                </td>

                <td className="py-3 px-4">{trader.profit}</td>
                <td className="py-3 px-4">{trader.winRate}</td>
                <td className="py-3 px-4">
                  <p> Needs improvement in Thermodynamics </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default LeaderboardScreen;
