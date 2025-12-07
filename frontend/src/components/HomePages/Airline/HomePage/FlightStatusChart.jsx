import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0284c7", "#06b6d4", "#0ea5e9", "#00d9ff"];

export default function FlightStatusChart({ flightData }) {
  if (!flightData || flightData.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No flight status data available
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 p-6"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">
        Flight Status Overview
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={flightData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
              >
                {flightData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
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
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col justify-center gap-3">
          {flightData.map((item, idx) => (
            <motion.div
              key={idx}
              className="bg-gradient-to-br from-sky-50 to-cyan-50 p-4 rounded-lg border border-sky-200 flex items-center justify-between"
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-sm font-semibold text-gray-700">{item.name}</p>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <p className="text-lg font-bold text-sky-600">{item.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
