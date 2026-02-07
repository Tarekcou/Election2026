/* eslint-disable react/prop-types */

const TopCandidates = ({ topCandidates }) => {
  // প্রতীকের জন্য ইমোজি ফাংশন
  const getSymbolEmoji = (symbol) => {
    if (!symbol) return "📊";

    const symbolText = symbol.toLowerCase();
    if (symbolText.includes("তারা")) return "⭐";
    if (symbolText.includes("আপেল")) return "🍎";
    if (symbolText.includes("দাঁড়িপাল্লা")) return "⚖️";
    if (symbolText.includes("ধান") || symbolText.includes("শীষ")) return "🌾";
    if (symbolText.includes("হাতপাখা")) return "🌀";
    if (symbolText.includes("হাত") || symbolText.includes("পাঞ্জা"))
      return "✋";
    if (symbolText.includes("লাঙ্গল")) return "🔨";
    return symbol;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h3 className="text-xl font-bold mb-6 text-gray-800 pb-3 border-b">
        শীর্ষ ৩ প্রার্থী
      </h3>
      <div className="space-y-4">
        {topCandidates.map((candidate, index) => (
          <div
            key={index}
            className={`flex items-center p-4 rounded-lg ${
              index === 0
                ? "bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-100"
                : index === 1
                  ? "bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-100"
                  : "bg-gradient-to-r from-orange-50 to-red-50 border border-orange-100"
            }`}
          >
            {/* অবস্থান নম্বর */}
            <div
              className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                index === 0
                  ? "bg-yellow-500 text-white"
                  : index === 1
                    ? "bg-gray-500 text-white"
                    : "bg-orange-500 text-white"
              }`}
            >
              <span className="font-bold">{index + 1}</span>
            </div>

            {/* প্রার্থীর ছবি */}
            <div className="flex-shrink-0 mr-3">
              <img
                className="h-12 w-12 rounded-full object-cover border-2 border-white shadow"
                src={candidate.image || candidate.candidateImage}
                alt={candidate.name || candidate.candidateName}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/48?text=প্র";
                }}
              />
            </div>

            {/* দলীয় প্রতীক */}
            <div className="flex-shrink-0 mr-3">
              {candidate.symbolImage ? (
                <img
                  src={candidate.symbolImage}
                  alt={candidate.marks || candidate.marka}
                  className="h-10 w-10 object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = "none";
                    e.target.parentElement.innerHTML = `<div class="text-2xl">${getSymbolEmoji(candidate.marks || candidate.marka)}</div>`;
                  }}
                />
              ) : (
                <div className="text-2xl">
                  {getSymbolEmoji(candidate.marks || candidate.marka)}
                </div>
              )}
            </div>

            {/* প্রার্থীর তথ্য */}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 truncate">
                {candidate.name || candidate.candidateName}
              </div>
              <div className="text-sm text-gray-600 truncate">
                {candidate.party || candidate.partyName || "স্বতন্ত্র"}
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                  {candidate.marks || candidate.marka}
                </span>
                <span className="font-bold text-green-700 text-sm">
                  {parseInt(candidate.votes).toLocaleString("bn-BD")} ভোট
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* প্রতীক সমূহের সংক্ষিপ্ত তথ্য */}
      <div className="mt-6 pt-4 border-t">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          প্রতীক সমূহ:
        </h4>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            <span className="mr-1">⭐</span> তারা
          </span>
          <span className="inline-flex items-center text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
            <span className="mr-1">🍎</span> আপেল
          </span>
          <span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
            <span className="mr-1">⚖️</span> দাঁড়িপাল্লা
          </span>
          <span className="inline-flex items-center text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
            <span className="mr-1">🌾</span> ধানের শীষ
          </span>
          <span className="inline-flex items-center text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
            <span className="mr-1">🌀</span> হাতপাখা
          </span>
          <span className="inline-flex items-center text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded">
            <span className="mr-1">✋</span> হাত
          </span>
          <span className="inline-flex items-center text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
            <span className="mr-1">🔨</span> লাঙ্গল
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopCandidates;
