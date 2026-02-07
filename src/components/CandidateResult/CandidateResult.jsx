/* eslint-disable react/prop-types */

function CandidateResult({ candidate }) {
  const { name, marks, votes } = candidate;
  console.log(name, marks, votes);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">{name}</h2>
      <p className="text-gray-600">Marks: {marks}</p>
      <p className="text-gray-600">Votes: {votes}</p>
    </div>
  );
}

export default CandidateResult;
