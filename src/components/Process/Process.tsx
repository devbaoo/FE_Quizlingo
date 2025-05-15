import { useState } from "react";

const Process = () => {
  const [progress, setProgress] = useState(0); 

  const handleNext = () => {
    setProgress((prev) => Math.min(prev + 33.3, 100)); 
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto px-4">
     <div className="flex items-center w-full mb-4">
        <div className="mr-2">
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="bg-green-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      <div className="flex justify-end mt-4 ">
        <button
          onClick={handleNext}
          className="bg-blue-500 text-white px-4 py-2 text-base rounded hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Process;
