import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  chooseTopics,
  fetchTopics,
} from "@/services/features/topic/topicSlice";
import { useAppDispatch, useAppSelector } from "@/services/store/store";

const TopicForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchTopics());
  }, [dispatch]);

  const { topics } = useAppSelector((state) => state.topic);
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);

  const toggleSelect = (index: number) => {
    setSelectedIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleNext = async () => {
    const selectedTopicIds = selectedIndexes.map((i) => topics[i].name);
    try {
      await dispatch(chooseTopics(selectedTopicIds)).unwrap();
      navigate("/choose-level");
    } catch (error) {
      console.error("Failed to choose topics:", error);
      alert("Có lỗi xảy ra khi lưu lựa chọn. Vui lòng thử lại.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[80vh] bg-gradient-to-br from-blue-50 to-white px-6 py-6 text-gray-900">
      <h1 className="text-2xl font-bold font-baloo mb-6 text-center">
        📚 Bạn muốn học chủ đề nào?
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl w-full">
        {topics.map((topic, index) => {
          const isSelected = selectedIndexes.includes(index);
          return (
            <div
              key={topic._id}
              onClick={() => toggleSelect(index)}
              className={`flex items-center p-5 rounded-2xl border transition-shadow cursor-pointer duration-200 font-baloo
                ${
                  isSelected
                    ? "bg-blue-100 border-blue-400 shadow-lg"
                    : "bg-white border-gray-300 hover:shadow-md"
                }
              `}
            >
              <div className="mr-4 text-xl">📌</div>
              <div className="font-semibold text-lg">{topic.name}</div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end w-full max-w-4xl mt-8">
        <button
          onClick={handleNext}
          disabled={selectedIndexes.length === 0}
          className={`px-6 py-3 rounded-xl text-base font-semibold font-baloo transition-all duration-200
            ${
              selectedIndexes.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 shadow-md"
            }
          `}
        >
          NEXT 
        </button>
      </div>
    </div>
  );
};

export default TopicForm;
