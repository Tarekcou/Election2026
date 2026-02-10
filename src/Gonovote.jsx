import React from 'react'
import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
const Gonovote = () => {
  return (
    <div>
      <div className="flex md:flex-row flex-col flex-1 justify-center items-center gap-10">
        <div className="w-full md:w-1/2 h-[300px] md:h-[500px]">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                innerRadius={90}
                outerRadius={160}
              >
                {pieData.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-6 font-bold text-3xl md:text-7xl">
          <div className="text-green-400">হ্যাঁ: {toBanglaNum(yesVotes)}</div>
          <div className="text-red-500">না: {toBanglaNum(noVotes)}</div>
        </div>
      </div>
    </div>
  );
}

export default Gonovote