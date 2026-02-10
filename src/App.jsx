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

/* ================= CONFIG ================= */
const CENTERS = {
  "04": "https://script.google.com/macros/s/AKfycbwfHELKrGVCiP9TMwRsvOZfdjF8ObIUxtwOujZBl2ddPrlm7loJ-nlxNVWmhLGXs4h-Rg/exec",
  "05": "https://script.google.com/macros/s/AKfycbyz-M_klRMYk7Cny0H_ALg6lcjX1dihnE7Z1bMM6bpRsKd66fJ4iPdBnYvd3tQMLfXcuA/exec",
  "08": "https://script.google.com/macros/s/AKfycbxpp0Ll4TTyYyU7bxAyq6gWH472DtVTJ_TS3NrE_4TQCFOMs7mZK3SbxWHcP3ZPhYdX/exec",
  "09": "https://script.google.com/macros/s/AKfycbwM7Out06tGOEguuxfBPT1lqAEEsrjKVokGidpWLaO8U2fvfdtu0P14UBeQ9hhw2QM-/exec",
  "10": "https://script.google.com/macros/s/AKfycbzUH12Z9jG993bGk5y-ujPNPRTGKTqAqprWmblZxrh16RUvYNBtKPG3TRlD8UA3Yuk/exec",
};


const REFRESH_INTERVAL = 3 * 60 * 1000;
const SLIDE_INTERVAL = 60 * 1000;
const CENTER_ROTATE_INTERVAL = 90 * 1000;

/* ================= UTILS ================= */
const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const toBanglaNum = (n) =>
  n === null || n === undefined
    ? "—"
    : String(n).replace(/[0-9]/g, (d) => banglaDigits[d]);

export default function App() {
  const [center, setCenter] = useState("04");
  const [candidates, setCandidates] = useState([]);
  const [publicVote, setPublicVote] = useState({});
  const [slide, setSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const API_BASE = CENTERS[center];
useEffect(() => {
  setCandidates([]);
  setPublicVote({});
  setLoading(true);
}, [center]);

  /* ================= FETCH DATA ================= */
  const fetchData = useCallback(
    
    async (manual = false) => {
        if (!API_BASE) return;

      manual && setRefreshing(true);
      
      try {
        const [cRes, vRes] = await Promise.all([
          axios.get(`${API_BASE}?route=candidates`),
          axios.get(`${API_BASE}?route=publicVote`),
        ]);

        setCandidates(cRes.data || []);
        setPublicVote(vRes.data || {});
      } catch (e) {
        console.error("Fetch error:", e);
      } finally {
        setLoading(false);
        manual && setRefreshing(false);
      }
    },
    [API_BASE]
  );


  useEffect(() => {
    fetchData();
    const t = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(t);
  }, [fetchData]);

  /* ================= SLIDE AUTO SWITCH ================= */
  useEffect(() => {
    const t = setInterval(
      () => setSlide((s) => (s === 0 ? 1 : 0)),
      SLIDE_INTERVAL
    );
    return () => clearInterval(t);
  }, []);

  /* ================= CENTER AUTO ROTATE ================= */
  useEffect(() => {
    const keys = Object.keys(CENTERS);
    const t = setInterval(() => {
      setCenter((prev) => keys[(keys.indexOf(prev) + 1) % keys.length]);
    }, CENTER_ROTATE_INTERVAL);
    return () => clearInterval(t);
  }, []);

  /* ================= COMPUTE DATA ================= */
  const totalVotes = useMemo(() => {
    if (!Array.isArray(candidates)) return 0;
    return candidates.reduce((s, c) => s + Number(c.votes || 0), 0);
  }, [candidates]);



  const sorted = useMemo(
    () =>
      Array.isArray(candidates)
        ? [...candidates].sort((a, b) => Number(b.votes) - Number(a.votes))
        : [],
    [candidates]
  );


  const maxVotes = Number(sorted[0]?.votes || 0);
  const leader =
    sorted.filter((c) => Number(c.votes) === maxVotes).length === 1
      ? sorted[0]?.candidateName
      : "—";

  const candidatesWithPercent = useMemo(
    () =>
      Array.isArray(sorted)
        ? sorted.map((c) => ({
            ...c,
            percent: totalVotes ? ((c.votes / totalVotes) * 100).toFixed(2) : 0,
          }))
        : [],
    [sorted, totalVotes]
  );

  const yesVotes = Number(publicVote.yesVote || 0);
  const noVotes = Number(publicVote.noVote || 0);

  const pieData = [
    { name: "হ্যাঁ", value: yesVotes, color: "#16a34a" },
    { name: "না", value: noVotes, color: "#dc2626" },
  ];

  /* ================= UI ================= */
  if (loading)
    return (
      <div className="flex justify-center items-center bg-black h-screen font-bold text-green-400 text-4xl animate-pulse">
        ডেটা লোড হচ্ছে...
      </div>
    );
    if (!Array.isArray(candidates)) {
      return <div className="text-red-500 text-3xl">ডেটা ফরম্যাট ত্রুটি</div>;
    }


  return (
    <div className="flex flex-col bg-black min-h-screen text-white">
      {/* ===== HEADER SMALL HEIGHT ===== */}
      <header className="flex justify-between items-center bg-indigo-900 px-10 py-4 text-lg md:text-3xl">
        <div className="font-bold">
          ত্রয়োদশ জাতীয় সংসদ নির্বাচন ২০২৬ |
          <span className="text-yellow-500">
            {" "}
            কেন্দ্র নংঃ {toBanglaNum(center)}
          </span>
        </div>

        <div className="flex md:flex-row flex-col gap-4 text-black text-md md:text-2xl">
          <select value={center} onChange={(e) => setCenter(e.target.value)}>
            {Object.keys(CENTERS).map((c) => (
              <option key={c} value={c}>
                কেন্দ্র {toBanglaNum(c)}
              </option>
            ))}
          </select>

          <button
            onClick={() => fetchData(true)}
            className="flex items-center gap-1 bg-blue-700 mx-auto px-2 py-1 rounded text-white text-center"
          >
            <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
          </button>
        </div>
      </header>

      {/* ===== INFO BAR ===== */}
      <div className="bg-gray-900 mx-auto border-gray-700 border-b w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 py-2 w-11/12 text-sm md:text-2xl text-center">
          <div>মোট কেন্দ্র: {toBanglaNum(publicVote.totalCenter)}</div>
          <div>গণনাকৃত: {toBanglaNum(candidates[0]?.countedCenter)}</div>
          <div>মোট ভোট: {toBanglaNum(totalVotes.toLocaleString())}</div>
          <div className="text-yellow-400">অগ্রগণ্য: {leader}</div>
        </div>
      </div>

      {/* ===== MAIN ===== */}
      {/* ===== MAIN DISPLAY AREA ===== */}
      <main className="flex flex-col flex-1 bg-black px-6 py-2 min-h-0">
        {/* TABLE / PIE AREA */}
        <div className="flex-1 min-h-0 overflow-auto">
          {" "}
          {/* ===== SLIDE 1: RESULT TABLE ===== */}
          {slide === 0 && (
            <div className="flex-1 min-h-0 overflow-auto">
              <table className="shadow-2xl rounded-xl w-full overflow-hidden text-sm md:text-xl border-collapse">
                <thead className="top-0 sticky bg-indigo-700 text-white">
                  <tr>
                    <th className="p-3 border">ক্রম</th>
                    <th className="p-3 border">প্রার্থী</th>
                    <th className="p-3 border">দল</th>
                    <th className="p-3 border">ভোট</th>
                    <th className="p-3 border">%</th>
                  </tr>
                </thead>

                <tbody>
                  {candidatesWithPercent.map((c, i) => {
                    const isLeader = Number(c.votes) === maxVotes;

                    return (
                      <tr
                        key={i}
                        className={` text-center
                  border-b border-gray-700 
                  ${i % 2 === 0 ? "bg-gray-900" : "bg-gray-800"}
                  ${
                    isLeader
                      ? "bg-green-700 text-white font-bold animate-pulse"
                      : ""
                  }
                `}
                      >
                        <td className="p-3 text-center">
                          {toBanglaNum(i + 1)}
                        </td>
                        <td className="p-3">{c.candidateName}</td>
                        <td className="p-3">{c.partyName}</td>
                        <td className="p-3 font-bold text-yellow-400">
                          {toBanglaNum(c.votes)}
                        </td>
                        <td className="p-3">{toBanglaNum(c.percent)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {/* ===== SLIDE 2: PIE CHART ===== */}
          {slide === 1 && (
            <div className="flex md:flex-row flex-col flex-1 justify-center items-center gap-10 px-4 w-full">
              {/* Pie Chart */}
              <div className="w-full md:w-1/2 h-64 md:h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      innerRadius="40%"
                      outerRadius="80%"
                      paddingAngle={2}
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

              {/* Votes Text */}
              <div className="flex flex-col justify-center items-center space-y-4 md:space-y-6 font-bold text-2xl md:text-5xl">
                <div className="text-green-400">
                  হ্যাঁ: {toBanglaNum(yesVotes)}
                </div>
                <div className="text-red-500">না: {toBanglaNum(noVotes)}</div>
              </div>
            </div>
          )}
        </div>

        {/* ===== CHEVRON CONTROLS BELOW ===== */}
        {/* CHEVRON BAR FIXED HEIGHT */}
        {/* CHEVRON BAR FIXED */}
        <div className="flex justify-center items-center gap-6 bg-black py-2 border-gray-700 border-t">
          <button
            onClick={() => setSlide(0)}
            className="bg-indigo-700 px-6 py-2 rounded-full"
          >
            <ChevronLeft size={28} />
          </button>

          <button
            onClick={() => setSlide(1)}
            className="bg-indigo-700 px-6 py-2 rounded-full"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      </main>

      {/* FOOTER SMALL */}
      <footer className="bg-indigo-900 py-1 text-xs md:text-lg text-center">
        মোঃ শরিফুল ইসলাম • সহকারী প্রোগ্রামার • কমিশনার অফিস • চট্টগ্রাম
      </footer>
    </div>
  );
}
