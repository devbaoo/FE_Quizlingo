import { useState } from "react";
import {
  FaHeadphones,
  FaMicrophone,
  FaBookOpen,
  FaPenFancy,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const sources = [
  { icon: <FaPenFancy className="text-2xl" />, label: "WRITING" },
  { icon: <FaBookOpen className="text-2xl" />, label: "READING" },
  { icon: <FaHeadphones className="text-2xl" />, label: "LISTENING" },
  { icon: <FaMicrophone className="text-2xl" />, label: "SPEAKING" },
];

const SkillForm = () => {
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const navigate = useNavigate();

  const toggleSelect = (index: number) => {
    if (selectedIndexes.includes(index)) {
      setSelectedIndexes(selectedIndexes.filter((i) => i !== index));
    } else {
      setSelectedIndexes([...selectedIndexes, index]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 bg-white text-gray-900">
      {/* Grid các kỹ năng */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sources.map((source, index) => {
          const isSelected = selectedIndexes.includes(index);
          return (
            <div
              key={index}
              onClick={() => toggleSelect(index)}
              className={`flex items-center px-4 py-3 border rounded-md cursor-pointer text-sm font-baloo transition 
                ${
                  isSelected
                    ? "bg-gray-300 border-gray-400"
                    : "border-gray-300 hover:bg-gray-100"
                }
              `}
            >
              <div className="mr-4 text-gray-700">{source.icon}</div>
              <div className="font-semibold">{source.label}</div>
            </div>
          );
        })}
      </div>

      {/* Nút Next căn giữa */}
      <div className="flex justify-end w-full mt-6 px-4">
        <button
          onClick={() => navigate("/done-page")}
          disabled={selectedIndexes.length === 0}
          className={`px-6 py-2 text-base rounded font-baloo shadow
            ${
              selectedIndexes.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }
          `}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SkillForm;
