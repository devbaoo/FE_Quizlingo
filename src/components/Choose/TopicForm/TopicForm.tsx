import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  chooseTopics,
  fetchTopics,
} from "@/services/features/topic/topicSlice";
import { useAppDispatch, useAppSelector } from "@/services/store/store";

const TopicForm = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchTopics());
  }, [dispatch]); 

  const { topics } = useAppSelector((state) => state.topic);
  
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  
  const navigate = useNavigate();
  const toggleSelect = (index: number) => {
    if (selectedIndexes.includes(index)) {
      setSelectedIndexes(selectedIndexes.filter((i) => i !== index));
    } else {
      setSelectedIndexes([...selectedIndexes, index]);
    }
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
    <div className="flex flex-col items-center justify-center bg-white text-gray-900 px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl w-full">
        {topics.map((topic, index) => {
          const isSelected = selectedIndexes.includes(index);
          return (
            <div
              key={topic._id}
              onClick={() => toggleSelect(index)}
              className={`flex items-center px-7 py-6 border rounded-xl cursor-pointer shadow-md font-baloo
            transition
            ${
              isSelected
                ? "bg-gray-300 text-gray-700 border-gray-500"
                : "bg-white border-gray-300 hover:bg-gray-100 text-gray-900"
            }
          `}
            >
              <div className="mr-4 text-gray-700">📌</div>
              <div className="font-semibold">{topic.name}</div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-end w-full mt-6 px-4">
        <button
           onClick={handleNext}
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

export default TopicForm;
