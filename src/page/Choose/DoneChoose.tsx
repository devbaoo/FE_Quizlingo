import { useNavigate } from "react-router-dom";
const DonePage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center min-h-screen bg-white text-gray-800 p-4">
      <div className="flex flex-row items-center space-x-6">
        <img
          src="https://media.giphy.com/media/Y9D5NK4NePSxaJLsOS/giphy.gif"
          alt="Quizlingo Characters"
          className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 mx-auto"
        />
        <div className="ml-4 text-base bg-blue-100 text-blue-900 px-4 py-2 rounded-lg shadow font-baloo">
          Bạn đã hoàn thành rất tốt những câu hỏi rồi !!! 
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <button
          onClick={() => navigate("/home-screen")}
          className="bg-blue-500 text-white px-4 py-2 text-base rounded hover:bg-blue-600 font-baloo"
        >
          Đến với bài học nào ^^
        </button>
      </div>
    </div>
<<<<<<< HEAD
    
=======
>>>>>>> 32dc4e4 (Api get choose)
  );
};

export default DonePage;
