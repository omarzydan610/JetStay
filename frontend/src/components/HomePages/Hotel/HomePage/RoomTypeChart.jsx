import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#0284c7", "#06b6d4"];

export default function RoomTypeChart({ roomTypeData }) {
  if (!roomTypeData || roomTypeData.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No room type data available
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="space-y-6"
    >
      <h3 className="text-xl font-bold text-gray-900 border-b border-gray-200 pb-3">
        Room Type Distribution
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {roomTypeData.map((roomType, idx) => {
          const occupiedCount = roomType.occupiedRooms;
          const availableCount = roomType.totalRooms - roomType.occupiedRooms;
          const chartData = [
            { name: "Occupied", value: occupiedCount },
            { name: "Available", value: availableCount },
          ];

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6"
            >
              <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">
                {roomType.name} Rooms
              </h4>

              <div className="flex flex-col items-center gap-6">
                {/* Pie Chart */}
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={60}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        color: "#111",
                        border: "2px solid #0284c7",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Legend and Stats */}
                <div className="flex flex-col gap-3 w-full">
                  <motion.div
                    className="bg-gradient-to-br from-sky-50 to-cyan-50 p-3 rounded-lg border border-sky-200 flex items-center justify-between"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-sky-600" />
                      <span className="text-sm font-semibold text-gray-700">
                        Occupied
                      </span>
                    </div>
                    <p className="text-lg font-bold text-sky-600">
                      {occupiedCount}
                    </p>
                  </motion.div>

                  <motion.div
                    className="bg-gradient-to-br from-cyan-50 to-sky-50 p-3 rounded-lg border border-cyan-200 flex items-center justify-between"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-cyan-500" />
                      <span className="text-sm font-semibold text-gray-700">
                        Available
                      </span>
                    </div>
                    <p className="text-lg font-bold text-cyan-600">
                      {availableCount}
                    </p>
                  </motion.div>

                  <div className="text-center pt-2 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-gray-800">
                        Total: {roomType.totalRooms}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
