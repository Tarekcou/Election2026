import { useState, useEffect, useCallback } from "react";

const useElectionData = () => {
  const [candidates, setCandidates] = useState([]);
  const [publicVotes, setPublicVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching election data from API...");

      // প্রার্থীর ডেটা
      const response = await fetch("https://sheetdb.io/api/v1/0v396gb6ooljh", {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      console.log("API Response Status:", response.status);

      if (!response.ok) {
        throw new Error(
          `API Error: ${response.status} - ${response.statusText}`,
        );
      }

      const data = await response.json();
      console.log("API Data received:", data);

      if (Array.isArray(data) && data.length > 0) {
        // প্রার্থীর ডেটা প্রসেসিং - আপনার API প্রপার্টি অনুযায়ী
        const processedCandidates = data
          .filter(
            (item) => item.candidateName && item.candidateName.trim() !== "",
          )
          .map((item, index) => {
            const candidate = {
              id: item.id || index,
              candidateName: item.candidateName || `প্রার্থী ${index + 1}`,
              candidateImage:
                item.candidateImage ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(item.candidateName || `Candidate ${index + 1}`)}&background=random&size=256`,
              partyName: item.partyName || "অজানা দল",
              marka: item.marka || "প্রতীক নেই",
              votes: item.votes || "0",
              yes: item.yes || "0",
              no: item.no || "0",
              totalPublicVotes: item.totalPublicVotes || "0",
              countedCenter: item.countedCenter || "0",
              symbolImage: item.symbolImage || getSymbolImage(item.marka),
            };

            return candidate;
          });

        setCandidates(processedCandidates);

        // গণভোটের ডেটা প্রসেসিং - API থেকে yes/no/totalPublicVotes প্রপার্টি ব্যবহার
        const processedPublicVotes = processPublicVotes(data);
        setPublicVotes(processedPublicVotes);

        setError(null);
        setLastUpdated(new Date());
      } else {
        throw new Error("API থেকে ডেটা পাওয়া যায়নি বা ডেটা ফর্ম্যাট সঠিক নয়");
      }
    } catch (err) {
      console.error("Error fetching election data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // API ডেটা থেকে গণভোট প্রসেস করার ফাংশন
  const processPublicVotes = (data) => {
    // API ডেটায় গণভোটের জন্য আলাদা এন্ট্রি বা candidate ডেটায় গণভোট থাকতে পারে
    const voteData = data.filter(
      (item) =>
        (item.yes || item.no || item.totalPublicVotes) && item.candidateName, // যেসব এন্ট্রিতে candidateName আছে সেগুলো গণভোট হিসেবে ধরব
    );

    if (voteData.length > 0) {
      return voteData.map((item, index) => ({
        id: item.id || index,
        question: item.candidateName || `গণভোট প্রশ্ন ${index + 1}`,
        yesVotes: parseInt(item.yes) || 0,
        noVotes: parseInt(item.no) || 0,
        totalVotes:
          parseInt(item.totalPublicVotes) ||
          (parseInt(item.yes) || 0) + (parseInt(item.no) || 0),
        color: getVoteColor(index),
      }));
    }

    // যদি API-তে গণভোটের ডেটা না থাকে, ডিফল্ট ডেটা
  };

  useEffect(() => {
    fetchData();

    // প্রতি 10 সেকেন্ডে ডেটা রিফ্রেশ
    const interval = setInterval(fetchData, 1000 * 3600);
    return () => clearInterval(interval);
  }, [fetchData]);

  // হিসাবগুলো
  const totalVotes = candidates.reduce((sum, candidate) => {
    return sum + (parseInt(candidate.votes) || 0);
  }, 0);

  const totalCenters = 106;
  const countedCenters = parseInt(candidates.countedCenter);

  const leadingCandidate =
    candidates.length > 0
      ? candidates.reduce((prev, current) => {
          const prevVotes = parseInt(prev.votes) || 0;
          const currentVotes = parseInt(current.votes) || 0;
          return prevVotes > currentVotes ? prev : current;
        })
      : null;

  // ভোটের ভিত্তিতে সাজান
  const sortedCandidates = [...candidates].sort((a, b) => {
    const votesA = parseInt(a.votes) || 0;
    const votesB = parseInt(b.votes) || 0;
    return votesB - votesA;
  });

  return {
    candidates,
    sortedCandidates,
    publicVotes,
    loading,
    error,
    totalVotes,
    totalCenters,
    countedCenters,
    leadingCandidate,
    lastUpdated,
    fetchData,
  };
};

// গণভোটের রঙ
const getVoteColor = (index) => {
  const colors = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];
  return colors[index % colors.length];
};

// প্রতীকের ছবির URL
const getSymbolImage = (marka) => {
  if (!marka) return "https://via.placeholder.com/100?text=প্রতীক";

  const symbol = marka.toLowerCase();
  if (symbol.includes("তারা"))
    return "https://cdn-icons-png.flaticon.com/512/1828/1828884.png";
  if (symbol.includes("আপেল"))
    return "https://cdn-icons-png.flaticon.com/512/415/415733.png";
  if (symbol.includes("দাঁড়িপাল্লা"))
    return "https://cdn-icons-png.flaticon.com/512/2997/2997897.png";
  if (symbol.includes("ধান") || symbol.includes("শীষ"))
    return "https://cdn-icons-png.flaticon.com/512/2194/2194770.png";
  if (symbol.includes("হাতপাখা"))
    return "https://cdn-icons-png.flaticon.com/512/3208/3208720.png";
  if (symbol.includes("হাত"))
    return "https://cdn-icons-png.flaticon.com/512/3429/3429083.png";
  if (symbol.includes("লাঙ্গল"))
    return "https://cdn-icons-png.flaticon.com/512/2972/2972545.png";

  return "https://via.placeholder.com/100?text=প্রতীক";
};

export default useElectionData;
