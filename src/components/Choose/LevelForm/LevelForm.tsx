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
  useEffect(() => {
    dispatch(fetchLevels());
  }, [dispatch]);
  const { levels } = useAppSelector((state) => state.level);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const navigate = useNavigate();

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
    <div className="p-4 bg-white text-gray-900">
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
                <span className="font-medium">{level.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nút next nằm bên phải toàn màn hình */}
      <div className="flex justify-end mt-4 px-4">
        <button
          onClick={handleNext}
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
