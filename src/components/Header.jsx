/* eslint-disable react/prop-types */

const Header = ({
  countedCenters,
  leadingCandidate,
  totalVotes,
  currentSlide,
  onSlideChange,
  autoRotate,
  onAutoRotateChange,
  lastUpdated,
  totalCandidates,
  totalPublicVotes,
}) => {
  // বাংলা সংখ্যায় রূপান্তর
  const toBengaliNumber = (num) => {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    const numStr = String(num || 0);
    return numStr.replace(/\d/g, (digit) => banglaDigits[digit]);
  };

  const totalCenters = 200;
  const countedPercent =
    totalCenters > 0 ? ((countedCenters / totalCenters) * 100).toFixed(1) : 0;

  // লিডিং ক্যান্ডিডেটের yes/no ভোট (যদি থাকে)
  const leadingYesVotes = leadingCandidate
    ? parseInt(leadingCandidate.yes) || 0
    : 0;
  const leadingNoVotes = leadingCandidate
    ? parseInt(leadingCandidate.no) || 0
    : 0;
  const leadingPublicVotes = leadingCandidate
    ? parseInt(leadingCandidate.totalPublicVotes) || 0
    : 0;

  return (
    <div className="bg-gradient-to-r from-blue-50 via-white to-purple-50 border-blue-300 border-b-4 h-full">
      <div className="flex flex-col h-full">
        {/* টপ বার */}
        <div className="flex flex-1 justify-between items-center px-8 py-1">
          {/* লেফট সাইড */}
          <div className="flex items-center">
            <div className="mr-6 font-bold text-blue-900 text-4xl">
              দ্বাদশ জাতীয় সংসদ নির্বাচন ২০২৬ 
            </div>
            <div className="font-bold text-red-600 text-3xl">API লাইভ ডেটা</div>
          </div>

          {/* সেন্টার - স্লাইড ইন্ডিকেটর */}
          <div className="flex items-center space-x-4">
            <div
              onClick={() => onSlideChange(0)}
              className={`text-3xl px-6 py-2 rounded-xl cursor-pointer transition-all ${
                currentSlide === 0
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <span className="font-bold">স্লাইড ১:</span> প্রার্থী
            </div>
            <div className="text-3xl">⇄</div>
            <div
              onClick={() => onSlideChange(1)}
              className={`text-3xl px-6 py-2 rounded-xl cursor-pointer transition-all ${
                currentSlide === 1
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <span className="font-bold">স্লাইড ২:</span> গণভোট
            </div>
          </div>

          {/* রাইট সাইড */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => onAutoRotateChange(!autoRotate)}
              className={`text-xl px-4 py-2 rounded-xl transition-all ${
                autoRotate
                  ? "bg-green-100 text-green-800 border-2 border-green-500 hover:bg-green-200"
                  : "bg-gray-100 text-gray-600 border-2 border-gray-400 hover:bg-gray-200"
              }`}
            >
              {autoRotate ? "🔄 স্বয়ংক্রিয়" : "⏸️ থামানো"}
            </button>
            <div className="text-gray-700 text-xl">
              {autoRotate ? "১ মিনিটে স্লাইড" : "ম্যানুয়াল"}
            </div>
          </div>
        </div>

        {/* স্ট্যাটস বার */}
        <div className="flex-1">
          <div className="gap-2 grid grid-cols-4 px-6 h-full">
            {/* মোট ভোটকেন্দ্র */}
            <div className="flex justify-between items-center bg-white shadow p-3 rounded-xl h-full">
              <div>
                <div className="font-bold text-gray-600 text-lg">
                  মোট ভোটকেন্দ্র
                </div>
                <div className="font-bold text-blue-700 text-3xl">২০০</div>
                <div className="text-blue-600 text-sm">
                  API: {toBengaliNumber(countedCenters)} গণনা সম্পন্ন
                </div>
              </div>
              <div className="text-3xl">🏛️</div>
            </div>

            {/* ফলাফল প্রাপ্ত কেন্দ্র */}
            <div className="flex justify-between items-center bg-white shadow p-3 rounded-xl h-full">
              <div>
                <div className="font-bold text-gray-600 text-lg">
                  ফলাফল প্রাপ্ত কেন্দ্র
                </div>
                <div className="font-bold text-green-700 text-3xl">
                  {toBengaliNumber(countedCenters)}
                </div>
                <div className="text-green-600 text-lg">{countedPercent}%</div>
              </div>
              <div className="text-3xl">✅</div>
            </div>

            {/* মোট ভোট */}
            <div className="flex justify-between items-center bg-white shadow p-3 rounded-xl h-full">
              <div>
                <div className="font-bold text-gray-600 text-lg">মোট ভোট</div>
                <div className="font-bold text-purple-700 text-3xl">
                  {toBengaliNumber(totalVotes)}
                </div>
                <div className="text-purple-600 text-sm">API থেকে প্রাপ্ত</div>
              </div>
              <div className="text-3xl">🗳️</div>
            </div>

            {/* অগ্রণী প্রার্থী */}
            <div className="flex justify-between items-center bg-white shadow p-3 rounded-xl h-full">
              <div className="flex-1">
                <div className="font-bold text-gray-600 text-lg">
                  অগ্রণী প্রার্থী
                </div>
                <div className="font-bold text-yellow-700 text-xl truncate">
                  {leadingCandidate?.candidateName || "..."}
                </div>
                <div className="text-gray-600 text-sm">
                  {leadingCandidate
                    ? `${leadingCandidate.marka} - ${toBengaliNumber(parseInt(leadingCandidate.votes).toLocaleString())} ভোট`
                    : "..."}
                </div>
              </div>
              <div className="text-3xl">👑</div>
            </div>
          </div>
        </div>

        {/* ইনফো বার */}
        <div className="flex justify-between items-center bg-gradient-to-r from-blue-200 to-blue-100 px-8 h-10 text-lg">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <span className="mr-2 text-xl">📡</span>
              <span className="font-bold text-green-700">
                API লাইভ: {totalCandidates} প্রার্থী
              </span>
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-xl">📊</span>
              <span className="font-bold">গণভোট: {totalPublicVotes}টি</span>
            </div>
            {leadingCandidate && leadingPublicVotes > 0 && (
              <div className="flex items-center">
                <span className="mr-2 text-xl">👍</span>
                <span className="font-bold">
                  হ্যাঁ/না: {toBengaliNumber(leadingYesVotes)}/
                  {toBengaliNumber(leadingNoVotes)}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <span className="mr-2 text-xl">⏰</span>
              <span className="font-bold">
                সর্বশেষ:{" "}
                {lastUpdated ? lastUpdated.toLocaleTimeString("bn-BD") : "..."}
              </span>
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-xl">🔄</span>
              <span className="font-bold">আপডেট: 10 সেকেন্ডে</span>
            </div>
          </div>

          <div className="flex items-center">
            <span className="mr-2 text-xl">🎯</span>
            <span className="font-bold">
              স্লাইড:{" "}
              <span className="text-blue-700">
                {currentSlide === 0 ? "প্রার্থী ফলাফল" : "গণভোট ফলাফল"}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
