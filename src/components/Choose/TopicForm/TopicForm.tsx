import { useState } from "react";
import { FaInstagram, FaTv, FaSuitcaseRolling } from "react-icons/fa";
import { MdFamilyRestroom } from "react-icons/md";
import { BsNewspaper } from "react-icons/bs";
import { IoMdMore } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const sources = [
  { icon: <BsNewspaper className="text-2xl" />, label: "TIN TỨC" },
  { icon: <FaInstagram className="text-2xl" />, label: "XÃ HỘI" },
  { icon: <MdFamilyRestroom className="text-2xl" />, label: "BẠN BÈ/GIA ĐÌNH" },
  { icon: <FaTv className="text-2xl" />, label: "TRUYỀN HÌNH" },
  { icon: <FaSuitcaseRolling className="text-2xl" />, label: "DU LỊCH" },
  { icon: <IoMdMore className="text-2xl" />, label: "KHÁC" },
];

const TopicForm = () => {
  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const navigate = useNavigate();

  const toggleSelect = (index: number) => {
    if (selectedIndexes.includes(index)) {
      setSelectedIndexes(selectedIndexes.filter(i => i !== index));
    } else {
      setSelectedIndexes([...selectedIndexes, index]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white text-gray-900 px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl w-full">
        {sources.map((source, index) => {
          const isSelected = selectedIndexes.includes(index);
          return (
            <div
              key={index}
              onClick={() => toggleSelect(index)}
              className={`
                flex items-center px-7 py-6 border rounded-xl cursor-pointer shadow-md font-baloo
                transition
                ${isSelected 
                  ? "bg-gray-300 text-gray-700 border-gray-500"  
                  : "bg-white border-gray-300 hover:bg-gray-100 text-gray-900"
                }
              `}
            >
              <div className="mr-4 text-gray-700">{source.icon}</div>
              <div className="font-semibold">{source.label}</div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-end w-full mt-6 px-4">
        <button
          onClick={() => navigate("/choose-level")}
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
