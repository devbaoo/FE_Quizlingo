import SkillForm from "@/components/Choose/SkillForm/SkillForm";
import { useEffect, useState } from "react";

const SkillPage = () => {
  const [showFirstImage, setShowFirstImage] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFirstImage(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      {/* image */}
      <div className="flex items-start mt-4 px-4">
        {showFirstImage ? (
          <img
            src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXkwcjVkczRqdmgzcXZxeWp4cGw1NGJtYmRvdWJ5NXNpdjJhbzN3MCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/6nTJybC8T6sqGTgPfo/giphy.gif"
            alt="Quizlingo Character 1"
            className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32"
          />
        ) : (
          <img
            src="https://media.giphy.com/media/dTk4cy7T71mFjkFBVq/giphy.gif"
            alt="Quizlingo Character 2"
            className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32"
          />
        )}
        <div className="ml-4 text-base bg-blue-100 text-blue-900 px-4 py-2 rounded-lg shadow font-baloo">
          Bạn thích học những kỹ năng nào nhất ?
        </div>
      </div>
      <SkillForm/>
    </div>
  );
};

export default SkillPage;
