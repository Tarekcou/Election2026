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
    <div className="h-full bg-gradient-to-r from-blue-50 via-white to-purple-50 border-b-4 border-blue-300">
      <div className="h-full flex flex-col">
        {/* টপ বার */}
        <div className="flex-1 flex items-center justify-between px-8 py-1">
          {/* লেফট সাইড */}
          <div className="flex items-center">
            <div className="text-4xl font-bold text-blue-900 mr-6">
              দ্বাদশ জাতীয় সংসদ নির্বাচন ২০২৪
            </div>
            <div className="text-3xl font-bold text-red-600">API লাইভ ডেটা</div>
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
            <div className="text-xl text-gray-700">
              {autoRotate ? "১ মিনিটে স্লাইড" : "ম্যানুয়াল"}
            </div>
          </div>
        </div>

        {/* স্ট্যাটস বার */}
        <div className="flex-1">
          <div className="h-full grid grid-cols-4 gap-2 px-6">
            {/* মোট ভোটকেন্দ্র */}
            <div className="h-full flex items-center justify-between bg-white rounded-xl p-3 shadow">
              <div>
                <div className="text-lg text-gray-600 font-bold">
                  মোট ভোটকেন্দ্র
                </div>
                <div className="text-3xl font-bold text-blue-700">২০০</div>
                <div className="text-sm text-blue-600">
                  API: {toBengaliNumber(countedCenters)} গণনা সম্পন্ন
                </div>
              </div>
              <div className="text-3xl">🏛️</div>
            </div>

            {/* ফলাফল প্রাপ্ত কেন্দ্র */}
            <div className="h-full flex items-center justify-between bg-white rounded-xl p-3 shadow">
              <div>
                <div className="text-lg text-gray-600 font-bold">
                  ফলাফল প্রাপ্ত কেন্দ্র
                </div>
                <div className="text-3xl font-bold text-green-700">
                  {toBengaliNumber(countedCenters)}
                </div>
                <div className="text-lg text-green-600">{countedPercent}%</div>
              </div>
              <div className="text-3xl">✅</div>
            </div>

            {/* মোট ভোট */}
            <div className="h-full flex items-center justify-between bg-white rounded-xl p-3 shadow">
              <div>
                <div className="text-lg text-gray-600 font-bold">মোট ভোট</div>
                <div className="text-3xl font-bold text-purple-700">
                  {toBengaliNumber(totalVotes)}
                </div>
                <div className="text-sm text-purple-600">API থেকে প্রাপ্ত</div>
              </div>
              <div className="text-3xl">🗳️</div>
            </div>

            {/* অগ্রণী প্রার্থী */}
            <div className="h-full flex items-center justify-between bg-white rounded-xl p-3 shadow">
              <div className="flex-1">
                <div className="text-lg text-gray-600 font-bold">
                  অগ্রণী প্রার্থী
                </div>
                <div className="text-xl font-bold text-yellow-700 truncate">
                  {leadingCandidate?.candidateName || "..."}
                </div>
                <div className="text-sm text-gray-600">
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
        <div className="h-10 bg-gradient-to-r from-blue-200 to-blue-100 flex items-center justify-between px-8 text-lg">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <span className="text-xl mr-2">📡</span>
              <span className="font-bold text-green-700">
                API লাইভ: {totalCandidates} প্রার্থী
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-xl mr-2">📊</span>
              <span className="font-bold">গণভোট: {totalPublicVotes}টি</span>
            </div>
            {leadingCandidate && leadingPublicVotes > 0 && (
              <div className="flex items-center">
                <span className="text-xl mr-2">👍</span>
                <span className="font-bold">
                  হ্যাঁ/না: {toBengaliNumber(leadingYesVotes)}/
                  {toBengaliNumber(leadingNoVotes)}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <span className="text-xl mr-2">⏰</span>
              <span className="font-bold">
                সর্বশেষ:{" "}
                {lastUpdated ? lastUpdated.toLocaleTimeString("bn-BD") : "..."}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-xl mr-2">🔄</span>
              <span className="font-bold">আপডেট: 10 সেকেন্ডে</span>
            </div>
          </div>

          <div className="flex items-center">
            <span className="text-xl mr-2">🎯</span>
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
