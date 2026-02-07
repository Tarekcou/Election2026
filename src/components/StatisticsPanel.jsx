// import React from 'react';
// import './StatisticsPanel.css';

const StatisticsPanel = ({
  candidates,
  totalVotes,
  leadingCandidate,
  center,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h3 className="text-xl font-bold mb-6 text-gray-800 pb-3 border-b">
        পরিসংখ্যান
      </h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
          <span className="text-gray-700">মোট প্রার্থী</span>
          <span className="text-2xl font-bold text-blue-700">
            {candidates.length}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
          <span className="text-gray-700">গড় ভোট/প্রার্থী</span>
          <span className="text-2xl font-bold text-green-700">
            {Math.round(totalVotes / candidates.length).toLocaleString("bn-BD")}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
          <span className="text-gray-700">অগ্রণীর ভোট শতাংশ</span>
          <span className="text-2xl font-bold text-purple-700">
            {leadingCandidate && totalVotes > 0
              ? ((parseInt(leadingCandidate.votes) / totalVotes) * 100).toFixed(
                  2,
                ) + "%"
              : "0%"}
          </span>
        </div>
        <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
          <span className="text-gray-700">ফলাফল কেন্দ্র</span>
          <span className="text-2xl font-bold text-yellow-700">
            {center}/১০৬
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;
