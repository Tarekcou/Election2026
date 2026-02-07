/* eslint-disable react/prop-types */

import CandidateRow from "./CandidateRow";

const CandidateTable = ({
  sortedCandidates,
  leadingCandidate,
  totalVotes,
  useMockData,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
      <div className="px-6 py-4 border-b bg-gray-50">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              প্রার্থীদের ফলাফল
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              সর্বশেষ আপডেট: {new Date().toLocaleString("bn-BD")}
              {useMockData && " (ডেমো ডেটা)"}
            </p>
          </div>
          <div className="mt-2 md:mt-0">
            <div className="text-sm text-gray-500">
              <span className="inline-flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                স্বয়ংক্রিয় রিফ্রেশ (৩০ সেকেন্ড)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">
                অবস্থান
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                প্রার্থী
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">
                দলীয় প্রতীক
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">
                ভোট সংখ্যা
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 uppercase tracking-wider">
                শতাংশ
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedCandidates.map((candidate, index) => (
              <CandidateRow
                key={candidate.id || index}
                candidate={candidate}
                index={index}
                isLeading={
                  leadingCandidate && candidate.id === leadingCandidate.id
                }
                totalVotes={totalVotes}
              />
            ))}
          </tbody>
          <tfoot className="bg-gray-50">
            <tr>
              <td
                colSpan="3"
                className="px-4 py-3 text-right text-sm font-semibold text-gray-700"
              >
                মোট:
              </td>
              <td className="px-4 py-3 text-right text-sm font-bold text-green-800">
                {totalVotes.toLocaleString("bn-BD")}
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-700">
                100%
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default CandidateTable;
