import {
  chooseLevels,
  fetchLevels,
} from "@/services/features/level/levelSlice";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import { useEffect, useState } from "react";
import { FaSignal } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const LevelForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const { levels } = useAppSelector((state) => state.level);

  useEffect(() => {
    dispatch(fetchLevels());
  }, [dispatch]);

  const handleNext = () => {
    if (selectedIndex !== null && levels[selectedIndex]) {
      const selectedLevelName = levels[selectedIndex].name;
      dispatch(chooseLevels(selectedLevelName))
        .unwrap()
        .then(() => navigate("/choose-skill"))
        .catch((error) => alert(error.message));
    } else {
      alert("Vui lòng chọn cấp độ hợp lệ.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-10 px-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-600 text-center font-baloo">
        Bạn đang ở trình độ nào?
      </h1>

      <div className="w-full max-w-xl grid grid-cols-1 gap-4">
        {levels.map((level, index) => {
          const isSelected = selectedIndex === index;
          return (
            <div
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`flex items-center px-4 py-3 rounded-lg border cursor-pointer shadow-sm transition-all duration-200
                ${
                  isSelected
                    ? "bg-blue-100 border-blue-500"
                    : "bg-white border-gray-300 hover:bg-gray-50"
                }`}
            >
              <FaSignal className="text-blue-500 text-xl mr-4" />
              <span className="text-lg font-semibold text-gray-800 font-baloo">
                {level.name}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end w-full max-w-xl mt-8">
        <button
          onClick={handleNext}
          disabled={selectedIndex === null}
          className={`px-6 py-2 rounded-lg font-semibold text-base font-baloo transition
            ${
              selectedIndex === null
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow"
            }
          `}
        >
          Tiếp theo
        </button>
      </div>
    </div>
  );
};

export default LevelForm;
