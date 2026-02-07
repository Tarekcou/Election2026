/* eslint-disable react/prop-types */

const CandidateRow = ({ candidate, index, isLeading, totalVotes }) => {
  const votes = parseInt(candidate.votes) || 0;
  const yesVotes = parseInt(candidate.yes) || 0;
  const noVotes = parseInt(candidate.no) || 0;
  const publicVotes = parseInt(candidate.totalPublicVotes) || 0;
  const countedCenters = parseInt(candidate.countedCenter) || 0;

  const votePercentage =
    totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : 0;
  const publicYesPercentage =
    publicVotes > 0 ? ((yesVotes / publicVotes) * 100).toFixed(1) : 0;
  const publicNoPercentage =
    publicVotes > 0 ? ((noVotes / publicVotes) * 100).toFixed(1) : 0;

  // অবস্থানের রঙ নির্ধারণ
  const getPositionStyle = (position) => {
    switch (position) {
      case 0:
        return {
          bg: "bg-gradient-to-r from-yellow-100 to-yellow-200",
          text: "text-yellow-800",
        };
      case 1:
        return {
          bg: "bg-gradient-to-r from-gray-100 to-gray-200",
          text: "text-gray-800",
        };
      case 2:
        return {
          bg: "bg-gradient-to-r from-orange-100 to-orange-200",
          text: "text-orange-800",
        };
      default:
        return {
          bg: "bg-gradient-to-r from-blue-100 to-blue-200",
          text: "text-blue-800",
        };
    }
  };

  const positionStyle = getPositionStyle(index);

  return (
    <div
      className={`grid grid-cols-7 gap-2 p-3 rounded-xl mb-2 ${isLeading ? "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300" : "bg-gray-50 hover:bg-gray-100"}`}
    >
      {/* অবস্থান */}
      <div className="flex items-center justify-center">
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-full ${positionStyle.bg} ${positionStyle.text} font-bold text-lg`}
        >
          {index + 1}
          {index < 3 && (
            <span className="text-xs ml-1">
              {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
            </span>
          )}
        </div>
      </div>

      {/* প্রার্থী */}
      <div className="col-span-2 flex items-center">
        <div className="flex items-center">
          <img
            src={candidate.candidateImage}
            alt={candidate.candidateName}
            className="h-14 w-14 rounded-full object-cover border-2 border-gray-300 mr-3"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.candidateName)}&background=random&size=112`;
            }}
          />
          <div>
            <div className="font-bold text-xl text-gray-900">
              {candidate.candidateName}
              {isLeading && (
                <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800">
                  👑 অগ্রণী
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600">{candidate.partyName}</div>
            <div className="text-xs text-gray-500">
              API কেন্দ্র: {countedCenters}/২০০
            </div>
          </div>
        </div>
      </div>

      {/* প্রতীক */}
      <div className="flex flex-col items-center justify-center">
        {candidate.symbolImage ? (
          <img
            src={candidate.symbolImage}
            alt={candidate.marka}
            className="h-10 w-10 object-contain mb-1"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.innerHTML = `
                <div class="text-2xl">${getSymbolEmoji(candidate.marka)}</div>
                <div class="text-xs font-medium text-gray-700">${candidate.marka}</div>
              `;
            }}
          />
        ) : (
          <div className="text-2xl">{getSymbolEmoji(candidate.marka)}</div>
        )}
        <div className="text-xs font-medium text-gray-700">
          {candidate.marka}
        </div>
      </div>

      {/* ভোট সংখ্যা */}
      <div className="flex flex-col justify-center">
        <div className="text-xl font-bold text-green-700 text-center">
          {votes.toLocaleString("bn-BD")}
        </div>
        <div className="text-sm text-gray-600 text-center">ভোট</div>
        <div className="text-xs text-gray-500 text-center">
          {publicVotes > 0 && `পাবলিক: ${publicVotes.toLocaleString("bn-BD")}`}
        </div>
      </div>

      {/* শতাংশ */}
      <div className="flex flex-col justify-center">
        <div className="text-lg font-bold text-blue-700 text-center">
          {votePercentage}%
        </div>
        {publicVotes > 0 && (
          <div className="text-xs text-gray-600 text-center">
            হ্যাঁ: {publicYesPercentage}%
          </div>
        )}
      </div>

      {/* প্রোগ্রেস বার */}
      <div className="flex flex-col justify-center space-y-1">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full ${isLeading ? "bg-gradient-to-r from-green-500 to-emerald-600" : "bg-gradient-to-r from-blue-500 to-cyan-600"}`}
            style={{ width: `${Math.min(votePercentage, 100)}%` }}
          ></div>
        </div>
        {publicVotes > 0 && (
          <div className="flex space-x-1">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-green-500"
                style={{ width: `${Math.min(publicYesPercentage, 100)}%` }}
              ></div>
            </div>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-red-500"
                style={{ width: `${Math.min(publicNoPercentage, 100)}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// প্রতীকের ইমোজি
const getSymbolEmoji = (marka) => {
  if (!marka) return "📊";

  const symbol = marka.toLowerCase();
  if (symbol.includes("তারা")) return "⭐";
  if (symbol.includes("আপেল")) return "🍎";
  if (symbol.includes("দাঁড়িপাল্লা")) return "⚖️";
  if (symbol.includes("ধান") || symbol.includes("শীষ")) return "🌾";
  if (symbol.includes("হাতপাখা")) return "🌀";
  if (symbol.includes("হাত")) return "✋";
  if (symbol.includes("লাঙ্গল")) return "🔨";
  return marka;
};

export default CandidateRow;
