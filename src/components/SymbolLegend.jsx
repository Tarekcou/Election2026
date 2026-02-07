/* eslint-disable react/prop-types */

const SymbolLegend = ({ candidates }) => {
  console.log(candidates);
  // আপনার ৭টি মৌলিক প্রতীক
  const basicSymbols = [
    { name: "তারা", emoji: "⭐", description: "তারা (Star)" },
    { name: "আপেল", emoji: "🍎", description: "আপেল (Apple)" },
    { name: "দাঁড়িপাল্লা", emoji: "⚖️", description: "দাঁড়িপাল্লা (Scale)" },
    { name: "ধানের শীষ", emoji: "🌾", description: "ধানের শীষ (Paddy)" },
    { name: "হাতপাখা", emoji: "🌀", description: "হাতপাখা (Hand Fan)" },
    { name: "হাত (পাঞ্জা)", emoji: "✋", description: "হাত/পাঞ্জা (Hand)" },
    { name: "লাঙ্গল", emoji: "🔨", description: "লাঙ্গল (Plough)" },
  ];

  // ক্যান্ডিডেটদের কাছ থেকে আসল চিত্র সংগ্রহ
  const candidateSymbols = candidates.reduce((acc, candidate) => {
    const symbol = candidate.marks || candidate.marka;
    const symbolImage = candidate.symbolImage;

    if (symbol && !acc.find((item) => item.name === symbol)) {
      acc.push({
        name: symbol,
        image: symbolImage,
        emoji: getFallbackEmoji(symbol),
      });
    }
    return acc;
  }, []);

  // মৌলিক প্রতীকগুলোর সাথে ক্যান্ডিডেটদের প্রতীক মিলিয়ে দেখুন
  const allSymbols = [...basicSymbols];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h3 className="text-xl font-bold mb-6 text-gray-800 pb-3 border-b">
        দলীয় প্রতীক সমূহ
      </h3>

      {/* মৌলিক ৭টি প্রতীক */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          প্রধান প্রতীক সমূহ:
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {basicSymbols.map((symbol, index) => (
            <div
              key={index}
              className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100"
            >
              <div className="text-2xl mr-3">{symbol.emoji}</div>
              <div>
                <div className="text-sm font-medium text-gray-800">
                  {symbol.name}
                </div>
                <div className="text-xs text-gray-600">
                  {symbol.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ক্যান্ডিডেটদের আসল প্রতীক (যদি থাকে) */}
      {candidateSymbols.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            নির্বাচনী প্রতীক:
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {candidateSymbols.map((symbol, index) => (
              <div
                key={index}
                className="flex items-center p-3 bg-gray-50 rounded-lg"
              >
                {symbol.image ? (
                  <img
                    src={symbol.image}
                    alt={symbol.name}
                    className="h-8 w-8 mr-3 object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.parentElement.innerHTML = `<div class="text-2xl mr-3">${symbol.emoji}</div>`;
                    }}
                  />
                ) : (
                  <div className="text-2xl mr-3">{symbol.emoji}</div>
                )}
                <span className="text-sm font-medium text-gray-800">
                  {symbol.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
        <p className="text-sm text-gray-600">
          <span className="font-medium">মোট প্রতীক:</span> ৭টি প্রধান দলীয়
          প্রতীক এই নির্বাচনে অংশগ্রহণ করছে। প্রতিটি প্রতীক আলাদা রাজনৈতিক দল বা
          জোটকে প্রতিনিধিত্ব করে।
        </p>
      </div>
    </div>
  );
};

// ইমোজি ফাংশন (উপরের মতোই)
const getFallbackEmoji = (symbol) => {
  if (!symbol) return "📊";

  const symbolText = symbol.toLowerCase();

  if (symbolText.includes("তারা") || symbolText.includes("star")) return "⭐";
  if (symbolText.includes("আপেল") || symbolText.includes("apple")) return "🍎";
  if (
    symbolText.includes("দাঁড়িপাল্লা") ||
    symbolText.includes("scale") ||
    symbolText.includes("balance")
  )
    return "⚖️";
  if (
    symbolText.includes("ধান") ||
    symbolText.includes("শীষ") ||
    symbolText.includes("paddy")
  )
    return "🌾";
  if (
    symbolText.includes("হাতপাখা") ||
    symbolText.includes("fan") ||
    symbolText.includes("handfan")
  )
    return "🌀";
  if (
    symbolText.includes("হাত") ||
    symbolText.includes("পাঞ্জা") ||
    symbolText.includes("hand")
  )
    return "✋";
  if (symbolText.includes("লাঙ্গল") || symbolText.includes("plough"))
    return "🔨";

  return symbol;
};

export default SymbolLegend;
