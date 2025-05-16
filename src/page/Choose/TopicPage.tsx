import TopicForm from "@/components/Choose/TopicForm/TopicForm";

const TopicPage = () => {

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      {/* image */}
      <div className="flex items-start mt-4 px-4">
        <img
          src="https://media.giphy.com/media/dTk4cy7T71mFjkFBVq/giphy.gif"
          alt="Quizlingo Characters"
          className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32"
        />
        <div className="ml-4 text-base bg-blue-100 text-blue-900 px-4 py-2 rounded-lg shadow font-baloo">
          Bạn muốn học theo chủ đề nào ?
        </div>
      </div>
      <TopicForm />
    </div>
  );
};

export default TopicPage;
