import Process from "@/components/Process/Process";

const SkillPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <Process />
    <div className="ml-4 sm:ml-6 md:ml-10">
      <img
        src="https://media.giphy.com/media/5me0l9ZR8SpG0N1UxZ/giphy.gif"
        alt="Quizlingo Characters"
        className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32"
      />
    </div>
    </div>
  );
};

export default SkillPage;