import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <Header />

      <main className="flex flex-row items-center justify-center gap-12 md:gap-[80px] px-6 h-screen max-w-[988px] mx-auto">

        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="https://media.giphy.com/media/5me0l9ZR8SpG0N1UxZ/giphy.gif"
            alt="Quizlingo Characters"
            className="w-64 h-64 mx-auto"
          />
        </div>

        {/* Nội dung bên phải */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <h1 className="text-center text-[22px] md:text-[26px] font-bold text-gray-700 leading-snug mb-6 font-baloo">
            Vừa học vừa chơi, ngoại ngữ&nbsp;lên&nbsp;đời!
          </h1>

          <div className="flex flex-col gap-4 w-full max-w-xs items-center">
            <button className="rounded-2xl border-b-2 border-b-blue-300 bg-blue-500 px-4 py-3 font-bold text-white ring-2 ring-blue-300 hover:bg-blue-400 active:translate-y-[0.125rem] active:border-b-blue-200 font-baloo w-full">
              Bắt Đầu
            </button>
            <a href="/login" className="w-full">
              <button className="rounded-2xl border-b-2 border-b-gray-300 bg-white px-4 py-3 font-bold text-blue-500 ring-2 ring-gray-300 hover:bg-gray-200 active:translate-y-[0.125rem] active:border-b-gray-200 font-baloo w-full">
                Tôi Đã Có Tài Khoản
              </button>
            </a>
          </div>
        </div>
      </main>
      <section className="absolute top-[867px] left-0 w-[1900px] h-20 flex items-center justify-center border-y-2 border-[#e5e5e5] px-10">
      </section>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;