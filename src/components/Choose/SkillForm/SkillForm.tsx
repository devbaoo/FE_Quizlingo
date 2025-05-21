import { chooseSkills, fetchSkills } from "@/services/features/skill/skillSlice";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import { useEffect, useState } from "react";
import { FaBookOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SkillForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const { skills } = useAppSelector((state) => state.skill);

  const handleNext = async () => {
    const selectedTopicIds = selectedIndexes.map((i) => skills[i].name);

    try {
      await dispatch(chooseSkills(selectedTopicIds)).unwrap();
      navigate("/done-page");
    } catch (error) {
      console.error("Failed to choose skills:", error);
      alert("Có lỗi xảy ra khi lưu lựa chọn. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    dispatch(fetchSkills());
  }, [dispatch]);

  const toggleSelect = (index: number) => {
    if (selectedIndexes.includes(index)) {
      setSelectedIndexes((prev) => prev.filter((i) => i !== index));
    } else {
      setSelectedIndexes((prev) => [...prev, index]);
    }
  };

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-blue-50 to-white px-4 py-8 flex flex-col items-center justify-start">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-blue-700 font-baloo">
        Bạn muốn cải thiện kỹ năng nào?
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
        {skills.map((skill, index) => {
          const isSelected = selectedIndexes.includes(index);
          return (
            <div
              key={skill._id || index}
              onClick={() => toggleSelect(index)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all duration-200
                ${
                  isSelected
                    ? "bg-blue-100 border-blue-500 shadow-md"
                    : "bg-white border-gray-300 hover:bg-gray-100 hover:shadow"
                }`}
            >
              <div className="text-blue-500 text-xl">
                <FaBookOpen />
              </div>
              <div className="text-base sm:text-lg font-medium text-gray-800 uppercase font-baloo">
                {skill.name}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleNext}
        disabled={selectedIndexes.length === 0}
        className={`mt-8 px-6 py-2 rounded-xl font-semibold text-base font-baloo transition-all duration-200
          ${
            selectedIndexes.length === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg"
          }
        `}
      >
        Tiếp theo
      </button>
    </div>
  );
};

export default SkillForm;
