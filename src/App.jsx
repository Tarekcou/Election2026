import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

import "./App.css";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";

/* ================= CONFIG ================= */
const CENTERS = {
  "04": "https://script.google.com/macros/s/AKfycbyE6DEJSHopU48seztgVYmDCKzMnZC7rgRCKZV8uzUsHZCx4qKCSsfXjqHlCeCiX_R-LQ/exec",
  "05": "https://script.google.com/macros/s/AKfycbxwJt6ig1yYxK_BVOPomMiYk6DZnMz62RUiXifak4wvVploJ35suSHrdalkkRKDMDku4A/exec",
  "08": "https://script.google.com/macros/s/AKfycbwsf6qjNYXAZ1vIFSZo09v6cBZoI_ZtUvuUH8jRJje0pCZeUxx2b01K3y9cR9eqeNLb/exec",
  "09": "https://script.google.com/macros/s/AKfycbzKxC7pFUd35bt9GbzafSp5nMPOdC4F7XGIgDgDv_wsghZ2JiqFSvLFWLLjCSd1Jw34/exec",
  "10": "https://script.google.com/macros/s/AKfycbwcc4o4cK6eso5vUBmRkR7Ioem53dnL9B00O643Cabr6rUriIpLd-9uH22f_XxnEg4l/exec",
};


const REFRESH_INTERVAL = 3 * 40 * 1000;
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
         axios.get(
           `${API_BASE}?route=candidates${manual ? "&refresh=true" : ""}`
         ),
         axios.get(
           `${API_BASE}?route=publicVote${manual ? "&refresh=true" : ""}`
         ),
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
  // useEffect(() => {
  //   const t = setInterval(
  //     () => setSlide((s) => (s === 0 ? 1 : 0)),
  //     SLIDE_INTERVAL
  //   );
  //   return () => clearInterval(t);
  // }, []);

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



  const candidatesWithPercent = useMemo(
    () =>
      Array.isArray(candidates)
        ? candidates.map((c) => ({
            ...c,
            percent: totalVotes ? ((c.votes / totalVotes) * 100).toFixed(2) : 0,
          }))
        : [],
    [candidates, totalVotes]
  );

  const maxVotes = Number(
    candidatesWithPercent.reduce((max, c) => Math.max(max, Number(c.votes)), 0)
  );

  const leader =
    candidatesWithPercent.filter((c) => Number(c.votes) === maxVotes).length ===
    1
      ? candidatesWithPercent.find((c) => Number(c.votes) === maxVotes)
          ?.candidateName
      : "  —";

  const yesVotes = Number(publicVote.yesVote || 0);
  const noVotes = Number(publicVote.noVote || 0);

  const pieData = [
    { name: "হ্যাঁ", value: yesVotes, color: "#16a34a" },
    { name: "না", value: noVotes, color: "#dc2626" },
  ];

  /* ================= UI ================= */
  if (loading)
    return (
      <div className="flex flex-col justify-center items-center space-y-2 bg-black min-h-screen">
        <div className="font-bold text-blue-600 text-xl md:text-5xl">
          আসন {toBanglaNum(center)}
        </div>
        <div className="text-gray-500 text-lg md:text-2xl animate-pulse">
          ফলাফল প্রদর্শন করা হচ্ছে…
        </div>
      </div>
    );
    if (!Array.isArray(candidates)) {
      return <div className="text-red-500 text-3xl">ডেটা ফরম্যাট ত্রুটি</div>;
    }


  return (
    <div className="flex flex-col bg-black min-h-screen text-white">
      {/* ===== HEADER SMALL HEIGHT ===== */}
      {/* ===== HEADER SMALL HEIGHT WITH PIE ===== */}
      <header className="bg-indigo-900 px-4 md:px-10 py-4">
        <div className="flex md:flex-row flex-col justify-between items-center gap-4 text-lg md:text-3xl">
          {/* Left: Title */}
          <div className="font-semibold md:text-left text-center">
            ত্রয়োদশ জাতীয় সংসদ নির্বাচন ২০২৬
          </div>

          {/* Middle: Dropdown + Refresh */}
          <div className="flex md:flex-row flex-col items-center gap-4 text-black text-md md:text-2xl">
            <select
              className="px-4"
              value={center}
              onChange={(e) => setCenter(e.target.value)}
            >
              {Object.keys(CENTERS).map((c) => (
                <option key={c} value={c}>
                  আসন {toBanglaNum(c)}
                </option>
              ))}
            </select>

            <button
              onClick={() => fetchData(true)}
              className="flex items-center gap-1 bg-blue-700 mx-auto px-2 py-2 rounded text-white text-center"
            >
              <RefreshCw
                size={18}
                className={refreshing ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>

        <div className="text-center">
          <span className="font-bold text-yellow-500 text-2xl md:text-4xl text-center">
            {" "}
            আসন নংঃ {toBanglaNum(center)}
          </span>
        </div>
      </header>

      {/* ===== INFO BAR ===== */}
      <div className="bg-gray-900 mx-auto border-gray-700 border-b w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 py-2 w-11/12 text-sm md:text-2xl text-center">
          <div>মোট কেন্দ্র: {toBanglaNum(publicVote.totalCenter)}</div>
          <div>
            গণনাকৃত কেন্দ্র : {toBanglaNum(candidates[0]?.countedCenter)}
          </div>
          <div>মোট ভোট: {toBanglaNum(totalVotes.toLocaleString())}</div>
          {/* <div className="text-yellow-400">ভোটে এগিয়ে:{leader}</div> */}
        </div>
      </div>

      {/* Right: PieChart */}
      <div className="bg-gray-900">
        <div>
          <h1 className="my-2 border-gray-700 border-b w-full font-bold text-red-600 text-2xl md:text-3xl text-center">
            গণভোট
          </h1>
        </div>
        <div className="flex md:flex-row flex-col items-center md:items-stretch gap-4 md:gap-8 shadow-lg p-2 rounded-xl w-full h-auto md:h-48">
          {/* ===== Vertical Bar Chart ===== */}

          <div className="w-full md:w-1/2 h-40 md:h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={pieData}
                layout="vertical"
                margin={{ top: 10, right: 100, left: 0, bottom: 5 }}
              >
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={60}
                  tick={{ fill: "#fff", fontSize: 14 }}
                />
                <Tooltip formatter={(value) => toBanglaNum(value)} />
                <Legend wrapperStyle={{ color: "#fff", fontSize: 14 }} />
                <Bar dataKey="value" radius={[4, 4, 4, 4]}>
                  {pieData.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                  <LabelList
                    dataKey="value"
                    position="right"
                    formatter={(val) => toBanglaNum(val)}
                    fill="#fff"
                    fontSize={14}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ===== Votes Numbers ===== */}
          <div className="flex flex-row md:flex-col justify-center items-center gap-3 md:gap-2 w-full md:w-1/2">
            <div className="flex flex-1 justify-center items-center font-bold text-green-400 text-xl md:text-3xl text-center">
              হ্যাঁ: {toBanglaNum(yesVotes)}
            </div>
            <div className="flex flex-1 justify-center items-center font-bold text-green-400 text-xl md:text-3xl text-center">
              না: {toBanglaNum(noVotes)}
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN ===== */}
      {/* ===== MAIN DISPLAY AREA ===== */}
      {/* ===== MAIN DISPLAY AREA ===== */}
      <main className="flex flex-col flex-1 bg-black px-2 md:px-6 py-2 min-h-0">
        <div className="flex-1 min-h-0 overflow-auto">
          {candidatesWithPercent && candidatesWithPercent.length > 0 ? (
            <table className="shadow-2xl rounded-xl w-full overflow-hidden text-sm md:text-xl border-collapse">
              <thead className="top-0 sticky bg-indigo-700 text-white">
                <tr>
                  <th className="p-3 border">ক্রম</th>
                  <th className="p-3 border">প্রার্থী</th>
                  <th className="p-3 border">দল</th>
                  <th className="p-3 border">প্রতীক</th>
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
                      className={`text-center border-b border-gray-700 ${
                        i % 2 === 0 ? "bg-gray-900" : "bg-gray-800"
                      }`}
                    >
                      <td className="p-3 text-center">{toBanglaNum(i + 1)}</td>
                      <td className="p-3">{c.candidateName}</td>
                      <td className="p-3">{c.partyName}</td>
                      <td className="p-3">{c.marka}</td>
                      <td className="p-3 font-bold text-yellow-400">
                        {toBanglaNum(c.votes)}
                      </td>
                      <td className="p-3">{toBanglaNum(c.percent)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div>
              <div className="mt-20 text-gray-500 text-lg md:text-2xl text-center animate-pulse">
                প্রদর্শন করা হচ্ছে…
              </div>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER SMALL */}
      <footer className="bg-indigo-900 mt-20 py-4 text-gray-300 md:text-md text-xs text-center">
        সফটওয়্যার পরিকল্পনা ও বাস্তবায়নঃ মোঃ শরিফুল ইসলাম (সহকারী প্রোগ্রামার,
        কমিশনারের কার্যালয় , চট্টগ্রাম বিভাগ, চট্টগ্রাম)
      </footer>
    </div>
  );
} 
