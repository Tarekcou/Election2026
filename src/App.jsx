import { useState, useEffect } from "react";
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

function App() {
  const [candidates, setCandidates] = useState([]);
  const [publicVote, setPublicVote] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const toBanglaNum = (num) => {
    if (!num && num !== 0) return "—";
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return String(num).replace(/[0-9]/g, (w) => banglaDigits[w]);
  };

  const fetchAllData = async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    try {
      const [candidatesRes, voteRes] = await Promise.all([
        axios.get(
          "https://sheetdb.io/api/v1/0v396gb6ooljh?sheet=FinalCandidateResult",
        ),
        axios.get(
          "https://sheetdb.io/api/v1/0v396gb6ooljh?sheet=PublicVoteResult",
        ),
      ]);

      setCandidates(candidatesRes.data);
      setPublicVote(voteRes.data[0] || {});
      setError(null);
    } catch (err) {
      setError("ডেটা লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
      if (isManual) setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();

    const interval = setInterval(
      () => {
        fetchAllData();
      },
      5 * 60 * 1000,
    );

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (candidates.length === 0) return;

    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
    }, 60000);

    return () => clearInterval(slideInterval);
  }, [candidates.length]);

  const goToNextSlide = () => setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
  const goToPrevSlide = () => setCurrentSlide((prev) => (prev === 0 ? 1 : 0));

  if (loading && candidates.length === 0) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="text-4xl font-bold text-blue-700 animate-pulse">
          লোড হচ্ছে...
        </div>
      </div>
    );
  }

  // প্রার্থীদের হিসাব
  const totalCandidateVotes = candidates.reduce(
    (sum, c) => sum + Number(c.votes || 0),
    0,
  );

  const sortedCandidates = [...candidates].sort(
    (a, b) => Number(b.votes) - Number(a.votes),
  );

  const maxVotes = sortedCandidates[0] ? Number(sortedCandidates[0].votes) : 0;
  const leadingCount = sortedCandidates.filter(
    (c) => Number(c.votes) === maxVotes,
  ).length;

  const leadingName =
    maxVotes > 0 && leadingCount === 1
      ? sortedCandidates[0].candidateName
      : "—";

  const candidatesWithPercent = sortedCandidates.map((c) => ({
    ...c,
    percent:
      totalCandidateVotes > 0
        ? ((Number(c.votes) / totalCandidateVotes) * 100).toFixed(2)
        : 0,
  }));

  // গণভোটের হিসাব
  const yesVotes = Number(publicVote.yesVote || 0);
  const noVotes = Number(publicVote.noVote || 0);
  const totalGanabhootVotes = yesVotes + noVotes;

  const ganabhootData = [
    { name: "হ্যাঁ", value: yesVotes, color: "#10b981" },
    { name: "না", value: noVotes, color: "#f87171" },
  ].filter((item) => item.value > 0);

  const hasGanabhootData = totalGanabhootVotes > 0;

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-50 font-sans">
      {/* হেডার – উচ্চতা কমানো */}
      <header className="bg-gradient-to-r from-indigo-800 to-blue-900 text-white relative shrink-0 py-3">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">
            ত্রয়োদশ জাতীয় সংসদ নির্বাচন ও গণভোট - ২০২৬ চট্টগ্রাম ১ মীরসরাই
          </h1>
          {/* <p className="mt-1 text-lg md:text-xl font-medium opacity-90">
            চট্টগ্রাম ১
          </p> */}
        </div>

        <button
          onClick={() => fetchAllData(true)}
          disabled={isRefreshing}
          className="absolute top-2 right-4 md:right-8 flex items-center gap-2 bg-indigo-700 hover:bg-indigo-600 text-white px-4 py-1.5 rounded-lg shadow-lg transition-all text-sm disabled:opacity-60"
        >
          <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
          <span>{isRefreshing ? "হচ্ছে..." : "রিফ্রেশ"}</span>
        </button>
      </header>

      {/* ইনফো বার – উচ্চতা আরও কমানো */}
      <div className="bg-white border-b shadow-sm shrink-0 py-2">
        <div className="container mx-auto px-4 py-2 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div>
            <p className="text-xs text-gray-600">মোট ভোটকেন্দ্র</p>
            <p className="text-xl md:text-2xl lg:text-6xl font-bold text-indigo-700">
              {toBanglaNum(publicVote.totalCenter || 106)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">গণনাকৃত কেন্দ্র</p>
            <p className="text-xl md:text-2xl lg:text-6xl font-bold text-green-700">
              {toBanglaNum(candidates[0]?.countedCenter || "—")}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">মোট ভোট</p>
            <p className="text-xl md:text-2xl lg:text-6xl font-bold text-indigo-700">
              {toBanglaNum(totalCandidateVotes.toLocaleString("en-US"))}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-600">অগ্রগণ্য</p>
            <p className="text-lg md:text-xl lg:text-6xl font-bold text-orange-700 truncate">
              {leadingName}
            </p>
          </div>
        </div>
      </div>

      {/* মূল কন্টেন্ট */}
      <main className="flex-1 relative overflow-hidden">
        {/* প্রার্থী স্লাইড */}
        <div
          className={`absolute inset-0 transition-opacity duration-800 ${
            currentSlide === 0 ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="h-full flex flex-col">
            {/* টেবিলের উপরের হেডিং – আরও ছোট করা */}
            <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white py-2 px-4">
              <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-center">
                প্রার্থীদের ফলাফল (ভোট অনুসারে)
              </h2>
            </div>

            {/* টেবিলের কন্টেইনার */}
            <div className="flex-1 overflow-y-auto px-3 md:px-5 py-3">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px] md:min-w-[1000px] border-collapse text-sm md:text-base">
                  <thead>
                    <tr className="bg-purple-100 text-purple-900">
                      <th className="p-3 text-left w-14">ক্রম</th>
                      <th className="p-3 text-left">প্রার্থী</th>
                      <th className="p-3 text-left">দল</th>
                      <th className="p-3 text-center">প্রতীক</th>
                      <th className="p-3 text-right">ভোট</th>
                      <th className="p-3 text-right">শতাংশ</th>
                      <th className="p-3 w-48">প্রগতি</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidatesWithPercent.map((candidate, index) => (
                      <tr
                        key={candidate.id}
                        className={`border-b hover:bg-gray-50 transition-colors ${
                          Number(candidate.votes) === maxVotes &&
                          leadingCount === 1
                            ? "bg-green-50 font-medium"
                            : ""
                        }`}
                      >
                        <td className="p-3 text-center font-bold">
                          {toBanglaNum(index + 1)}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden border border-gray-300">
                              <img
                                src={
                                  candidate.candidateImage ||
                                  `https://via.placeholder.com/48?text=${index + 1}`
                                }
                                alt={candidate.candidateName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="text-sm md:text-base">
                              {candidate.candidateName}
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-sm md:text-base text-gray-700">
                          {candidate.partyName}
                        </td>
                        <td className="p-3 text-center">
                          {candidate.symbolImage ? (
                            <img
                              src={candidate.symbolImage}
                              alt="প্রতীক"
                              className="w-10 h-10 mx-auto object-contain"
                            />
                          ) : (
                            <span className="text-2xl">{candidate.marka}</span>
                          )}
                        </td>
                        <td className="p-3 text-right font-bold text-xl md:text-2xl lg:text-3xl text-indigo-800">
                          {toBanglaNum(
                            Number(candidate.votes).toLocaleString("en-US"),
                          )}
                        </td>
                        <td className="p-3 text-right font-medium text-lg md:text-xl">
                          {toBanglaNum(candidate.percent)}%
                        </td>
                        <td className="p-3">
                          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                            <div
                              className={`h-4 rounded-full transition-all duration-700 ease-out ${
                                Number(candidate.votes) === maxVotes &&
                                leadingCount === 1
                                  ? "bg-green-600"
                                  : "bg-indigo-500"
                              }`}
                              style={{ width: `${candidate.percent}%` }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* গণভোট স্লাইড */}
        <div
          className={`absolute inset-0 transition-opacity duration-800 flex items-center justify-center px-4 ${
            currentSlide === 1 ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="w-full max-w-5xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 text-purple-800">
              গণভোটের সার্বিক ফলাফল
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              {/* পাই চার্ট */}
              <div className="h-[400px] md:h-[480px] lg:h-[540px]">
                {hasGanabhootData ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ganabhootData}
                        cx="40%"
                        cy="50%"
                        innerRadius={90}
                        outerRadius={140}
                        paddingAngle={5}
                        dataKey="value"
                        labelLine={true}
                        label={({
                          cx,
                          cy,
                          midAngle,
                          innerRadius,
                          outerRadius,
                          percent,
                          name,
                        }) => {
                          const RADIAN = Math.PI / 180;
                          const radius = outerRadius + 35;
                          const x = cx + radius * Math.cos(-midAngle * RADIAN);
                          const y = cy + radius * Math.sin(-midAngle * RADIAN);
                          return (
                            <text
                              x={x}
                              y={y}
                              fill="#1f2937"
                              textAnchor={x > cx ? "start" : "end"}
                              dominantBaseline="central"
                              fontSize="16"
                              fontWeight="bold"
                            >
                              {name}: {toBanglaNum((percent * 100).toFixed(1))}%
                            </text>
                          );
                        }}
                        animationDuration={1800}
                        animationBegin={400}
                        animationEasing="ease-out"
                        isAnimationActive={true}
                        startAngle={90}
                        endAngle={450}
                      >
                        {ganabhootData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke="#ffffff"
                            strokeWidth={3}
                            style={{ transition: "all 0.4s ease" }}
                          />
                        ))}
                      </Pie>

                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#111827",
                          border: "none",
                          borderRadius: "10px",
                          color: "white",
                          padding: "12px 16px",
                          fontSize: "15px",
                          fontWeight: "500",
                        }}
                        formatter={(value, name) => [
                          <span className="font-bold">
                            {toBanglaNum(value.toLocaleString("en-US"))}
                          </span>,
                          name,
                        ]}
                      />

                      <Legend
                        verticalAlign="bottom"
                        height={60}
                        iconSize={18}
                        iconType="circle"
                        wrapperStyle={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#1f2937",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-600 text-xl font-medium">
                    গণভোটের ডেটা এখনো পাওয়া যায়নি
                  </div>
                )}
              </div>

              {/* হ্যাঁ ও না */}
              <div className="space-y-8">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-2xl shadow-xl text-center border border-green-200">
                  <h3 className="text-2xl md:text-3xl font-bold text-green-800 mb-3">
                    হ্যাঁ
                  </h3>
                  <p className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-green-700">
                    {toBanglaNum(yesVotes.toLocaleString("en-US"))}
                  </p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl shadow-xl text-center border border-red-200">
                  <h3 className="text-2xl md:text-3xl font-bold text-red-800 mb-3">
                    না
                  </h3>
                  <p className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-red-700">
                    {toBanglaNum(noVotes.toLocaleString("en-US"))}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-center mt-10 text-xl text-gray-700 font-medium">
              গণনাকৃত কেন্দ্র:{" "}
              <strong className="text-indigo-800">
                {toBanglaNum(candidates[0]?.countedCenter || "—")}
              </strong>
            </p>
          </div>
        </div>

        {/* নেভিগেশন বাটন */}
        <button
          onClick={goToPrevSlide}
          className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-5 rounded-full transition-all z-20 shadow-2xl backdrop-blur-sm"
        >
          <ChevronLeft size={44} />
        </button>

        <button
          onClick={goToNextSlide}
          className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-5 rounded-full transition-all z-20 shadow-2xl backdrop-blur-sm"
        >
          <ChevronRight size={44} />
        </button>
      </main>

      {/* ফুটার – উচ্চতা কমানো */}
      <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white py-3 px-6 text-center text-base shrink-0">
        <div className="flex flex-wrap justify-center items-center gap-6">
          <span>মহিউদ্দিন জিলানী</span>
          <span>উপজেলা আইসিটি অফিসার</span>
          {/* <span>প্রার্থী: {toBanglaNum(candidates.length)}</span> */}
          <span>মীরসরাই, চট্টগ্রাম</span>
          {/* <span>গণভোট</span> */}
          <span>•</span>
          <span>পরবর্তী স্লাইড: ৬০ সেকেন্ডে</span>
        </div>
      </div>
    </div>
  );
}

export default App;
