/* eslint-disable react/prop-types */

import { useState, useEffect } from "react";

const PublicVoteSlide = ({ publicVotes }) => {
  const [currentVoteIndex, setCurrentVoteIndex] = useState(0);

  // যদি API থেকে গণভোটের ডেটা না আসে
  const votes =
    publicVotes && publicVotes.length > 0
      ? publicVotes
      : [
          {
            id: 1,
            question: "API থেকে গণভোটের ডেটা লোড হচ্ছে...",
            yesVotes: 0,
            noVotes: 0,
            totalVotes: 0,
            color: "#4F46E5",
          },
        ];

  // প্রতি 15 সেকেন্ডে গণভোট পরিবর্তন
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVoteIndex((prev) => (prev + 1) % votes.length);
    }, 15000);

    return () => clearInterval(interval);
  }, [votes.length]);

  const currentVote = votes[currentVoteIndex];
  const yesPercentage =
    currentVote.totalVotes > 0
      ? ((currentVote.yesVotes / currentVote.totalVotes) * 100).toFixed(1)
      : 0;
  const noPercentage =
    currentVote.totalVotes > 0
      ? ((currentVote.noVotes / currentVote.totalVotes) * 100).toFixed(1)
      : 0;

  // বাংলা সংখ্যা কনভার্টার
  const toBengaliNumber = (num) => {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    const numStr = String(num || 0);
    return numStr.replace(/\d/g, (digit) => banglaDigits[digit]);
  };

  return (
    <div className="h-full w-full p-4">
      {/* স্লাইড হেডার */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-t-2xl mb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-4xl mr-4">📊</div>
            <div>
              <div className="text-3xl font-bold">গণভোট ফলাফল</div>
              <div className="text-xl">জনমত জরিপ - সরাসরি ফলাফল</div>
            </div>
          </div>

          <div className="text-2xl font-bold bg-white/20 p-3 rounded-xl">
            গণভোট #{currentVoteIndex + 1} / {votes.length}
          </div>
        </div>
      </div>

      {/* মেইন কন্টেন্ট */}
      <div className="h-[calc(100%-100px)] grid grid-cols-2 gap-6">
        {/* বাম পাশ: প্রশ্ন এবং ভোট ডিটেইল */}
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          {/* প্রশ্ন */}

          {/* ভোট সংখ্যা */}
          <div className="space-y-6">
            {/* হ্যাঁ ভোট */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-100 p-6 rounded-xl border-4 border-green-300">
              <div className="flex justify-between items-center mb-3">
                <div className="text-2xl font-bold text-green-800">
                  হ্যাঁ (Yes)
                </div>
                <div className="text-4xl">✅</div>
              </div>
              <div className="text-4xl font-bold text-green-900 mb-2">
                {toBengaliNumber(currentVote.yesVotes.toLocaleString())}
              </div>
              <div className="flex justify-between text-xl">
                <div className="text-gray-700">মোট ভোটের</div>
                <div className="font-bold text-green-700">{yesPercentage}%</div>
              </div>
              {/* প্রোগ্রেস বার */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-600 h-4 rounded-full transition-all duration-1000"
                    style={{ width: `${yesPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* না ভোট */}
            <div className="bg-gradient-to-r from-red-50 to-pink-100 p-6 rounded-xl border-4 border-red-300">
              <div className="flex justify-between items-center mb-3">
                <div className="text-2xl font-bold text-red-800">না (No)</div>
                <div className="text-4xl">❌</div>
              </div>
              <div className="text-4xl font-bold text-red-900 mb-2">
                {toBengaliNumber(currentVote.noVotes.toLocaleString())}
              </div>
              <div className="flex justify-between text-xl">
                <div className="text-gray-700">মোট ভোটের</div>
                <div className="font-bold text-red-700">{noPercentage}%</div>
              </div>
              {/* প্রোগ্রেস বার */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-red-500 to-pink-600 h-4 rounded-full transition-all duration-1000"
                    style={{ width: `${noPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* মোট ভোট */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-100 p-4 rounded-xl border-4 border-blue-300">
              <div className="flex justify-between items-center">
                <div className="text-xl font-bold text-blue-800">মোট গণভোট</div>
                <div className="text-3xl">🗳️</div>
              </div>
              <div className="text-3xl font-bold text-blue-900 text-center mt-2">
                {toBengaliNumber(currentVote.totalVotes.toLocaleString())}
              </div>
            </div>
          </div>
        </div>

        {/* ডান পাশ: পাই চার্ট */}
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          {/* পাই চার্ট হেডার */}
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              পাই চার্ট বিশ্লেষণ
            </div>
            <div className="text-xl text-gray-600">হ্যাঁ ও না ভোটের শতাংশ</div>
          </div>

          {/* পাই চার্ট */}
          <div className="flex items-center justify-center h-[300px]">
            <div className="relative w-[300px] h-[300px]">
              {/* পাই চার্ট SVG */}
              <svg
                width="300"
                height="300"
                viewBox="0 0 100 100"
                className="transform -rotate-90"
              >
                {/* হ্যাঁ ভোট আর্ক */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#10B981"
                  strokeWidth="15"
                  strokeDasharray={`${yesPercentage * 2.513} 251.3`}
                  strokeLinecap="round"
                />

                {/* না ভোট আর্ক */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="#EF4444"
                  strokeWidth="15"
                  strokeDasharray={`${noPercentage * 2.513} 251.3`}
                  strokeDashoffset={`-${yesPercentage * 2.513}`}
                  strokeLinecap="round"
                />
              </svg>

              {/* সেন্টার টেক্সট */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl font-bold text-gray-900">
                  {yesPercentage}%
                </div>
                <div className="text-xl text-gray-600">হ্যাঁ</div>
              </div>
            </div>
          </div>

          {/* লেজেন্ড */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="flex items-center p-4 bg-green-50 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-green-500 mr-4"></div>
              <div>
                <div className="text-lg font-bold text-gray-900">হ্যাঁ ভোট</div>
                <div className="text-sm text-gray-700">{yesPercentage}%</div>
                <div className="text-xs text-gray-600">
                  {toBengaliNumber(currentVote.yesVotes.toLocaleString())} ভোট
                </div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-red-50 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-red-500 mr-4"></div>
              <div>
                <div className="text-lg font-bold text-gray-900">না ভোট</div>
                <div className="text-sm text-gray-700">{noPercentage}%</div>
                <div className="text-xs text-gray-600">
                  {toBengaliNumber(currentVote.noVotes.toLocaleString())} ভোট
                </div>
              </div>
            </div>
          </div>

          {/* নেক্সট ভোট টাইমার */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
            <div className="text-center">
              <div className="text-lg text-gray-700 mb-2">পরবর্তী গণভোট</div>
              <div className="flex justify-center space-x-2">
                {votes.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentVoteIndex(index)}
                    className={`w-8 h-8 rounded-full ${index === currentVoteIndex ? "bg-blue-600" : "bg-gray-300"}`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600 mt-2">
                প্রতি 15 সেকেন্ডে পরিবর্তিত হবে
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicVoteSlide;
