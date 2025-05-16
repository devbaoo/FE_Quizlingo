import { useState } from "react";
import { FaSignal } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const levels = ["Beginner", "Intermediate", "Advanced"];

const LevelForm = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const navigate = useNavigate();
  return (
  <div className="p-4 bg-white text-gray-900">
    {/* Khung giữa giới hạn chiều rộng cho các lựa chọn */}
    <div className="max-w-xl mx-auto">
      <div className="flex flex-col space-y-4 w-full">
        {levels.map((level, index) => {
          const isSelected = selectedIndex === index;
          return (
            <div
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`flex items-center px-4 py-3 border rounded-lg cursor-pointer shadow-sm w-full font-baloo transition
                ${
                  isSelected
                    ? "bg-gray-300 border-gray-400 text-gray-900"
                    : "bg-gray-50 border-gray-300 hover:bg-gray-100 text-gray-800"
                }
              `}
            >
              <FaSignal className="text-blue-500 text-lg mr-3" />
              <span className="font-medium">{level}</span>
            </div>
          );
        })}
      </div>
    </div>

    {/* Nút next nằm bên phải toàn màn hình */}
    <div className="flex justify-end mt-4 px-4">
      <button
        onClick={() => navigate("/choose-skill")}
        disabled={selectedIndex === null}
        className={`px-4 py-2 text-base rounded font-baloo
          ${
            selectedIndex === null
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

export default LevelForm;
