/* eslint-disable react/prop-types */

import CandidateRow from "./CandidateRow";

const CandidatesSlide = ({
  sortedCandidates,
  leadingCandidate,
  totalVotes,
}) => {
  // বাংলা সংখ্যা কনভার্টার
  const toBengaliNumber = (num) => {
    const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    const numStr = String(num || 0);
    return numStr.replace(/\d/g, (digit) => banglaDigits[digit]);
  };

  return (
    <div className="h-full w-full p-4">
      {/* স্লাইড হেডার */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-2xl mb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-4xl mr-4">👥</div>
            <div>
              <div className="text-3xl font-bold">প্রার্থীগণের ফলাফল</div>
              <div className="text-xl">API থেকে সরাসরি ডেটা</div>
            </div>
          </div>

          <div className="text-2xl font-bold bg-white/20 p-3 rounded-xl">
            API মোট ভোট: {toBengaliNumber(totalVotes.toLocaleString())}
          </div>
        </div>
      </div>

      {/* টেবিল কন্টেন্ট - নির্দিষ্ট হাইট */}
      <div className="h-[calc(100%-100px)] bg-white rounded-b-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* টেবিল হেডার */}
        <div className="flex-shrink-0 bg-gradient-to-r from-blue-50 to-blue-100 p-2">
          <div className="grid grid-cols-7 gap-2 px-4 text-lg font-bold text-gray-800">
            <div className="text-center">অবস্থান</div>
            <div className="text-center col-span-2">প্রার্থী</div>
            <div className="text-center">প্রতীক</div>
            <div className="text-center">ভোট</div>
            <div className="text-center">শতাংশ</div>
            <div className="text-center">প্রোগ্রেস</div>
          </div>
        </div>

        {/* টেবিল বডি - স্ক্রলযোগ্য */}
        <div className="flex-1 overflow-auto">
          <div className="px-2">
            {sortedCandidates.map((candidate, index) => (
              <div key={candidate.id || index} className="mb-2">
                <CandidateRow
                  candidate={candidate}
                  index={index}
                  isLeading={
                    leadingCandidate && candidate.id === leadingCandidate.id
                  }
                  totalVotes={totalVotes}
                />
              </div>
            ))}
          </div>
        </div>

        {/* টেবিল ফুটার */}
        <div className="flex-shrink-0 bg-gradient-to-r from-gray-100 to-gray-200 p-4 border-t border-gray-300">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg text-gray-700">API থেকে মোট প্রার্থী</div>
              <div className="text-2xl font-bold text-blue-700">
                {sortedCandidates.length}
              </div>
            </div>

            <div className="text-center">
              <div className="text-lg text-gray-700">অগ্রণী ভোট</div>
              <div className="text-2xl font-bold text-green-700">
                {leadingCandidate
                  ? toBengaliNumber(
                      parseInt(leadingCandidate.votes).toLocaleString(),
                    )
                  : "০"}
              </div>
            </div>

            <div className="text-center">
              <div className="text-lg text-gray-700">গড় ভোট</div>
              <div className="text-2xl font-bold text-purple-700">
                {sortedCandidates.length > 0
                  ? toBengaliNumber(
                      Math.round(
                        totalVotes / sortedCandidates.length,
                      ).toLocaleString(),
                    )
                  : "০"}
              </div>
            </div>

            <div className="text-center">
              <div className="text-lg text-gray-700">API গণনা কেন্দ্র</div>
              <div className="text-2xl font-bold text-yellow-700">
                {sortedCandidates.length > 0
                  ? toBengaliNumber(
                      Math.round(
                        sortedCandidates.reduce(
                          (sum, c) => sum + (parseInt(c.countedCenter) || 0),
                          0,
                        ) / sortedCandidates.length,
                      ),
                    )
                  : "০"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatesSlide;
