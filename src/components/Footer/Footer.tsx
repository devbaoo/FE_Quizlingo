const Footer = () => {
  return (
    <>
      <section className="w-full flex justify-center bg-white py-12 sm:py-16 md:py-20 px-4 sm:px-6">
        <div className="max-w-6xl flex flex-col md:flex-row items-center gap-12 md:gap-16 lg:gap-24">
          {/* Left Text Content */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="font-baloo text-3xl sm:text-4xl md:text-5xl font-bold text-blue-500 leading-tight">
              miễn phí. vui nhộn. <br className="hidden sm:block" /> hiệu quả
            </h2>
            <p className="font-baloo mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-700 max-w-xl leading-relaxed">
              Học cùng Quizlingo rất vui nhộn,{" "}
              <span className="text-green-500 font-bold font-baloo">
                các nghiên cứu đã chứng minh ứng dụng thật sự hiệu quả
              </span>
              ! Các bài học nhỏ gọn sẽ giúp bạn ghi điểm, mở khóa cấp độ mới và luyện tập kỹ năng giao tiếp hữu dụng.
            </p>
          </div>

          {/* Right Image */}
          <div className="flex-1 flex justify-center mt-6 md:mt-0">
            <img
              src="https://media.giphy.com/media/gtgdV9KXZpgUjswDS6/giphy.gif"
              alt="Quizlingo Characters"
              className="w-full max-w-[200px] sm:max-w-[250px] md:max-w-sm"
            />
          </div>
        </div>
      </section>

      <section className="w-full flex justify-center bg-white py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl w-full flex flex-col-reverse md:flex-row items-center gap-12 md:gap-16 lg:gap-20">
          {/* Left Image */}
          <div className="flex-1 flex justify-center mt-6 md:mt-0">
            <img
              src="https://media.giphy.com/media/cDvnVlETDQUl8xh5jK/giphy.gif"
              alt="Scientific Illustration"
              className="w-full max-w-[200px] sm:max-w-[250px] md:max-w-md"
            />
          </div>

          {/* Right Text */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="font-baloo text-3xl sm:text-4xl md:text-5xl font-bold text-blue-500 leading-tight">
              Dựa trên căn cứ <br className="hidden sm:block" /> khoa học
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-gray-700 max-w-xl leading-relaxed font-baloo">
              Chúng tôi kết hợp các phương pháp giảng dạy khoa học với nội dung học thú vị để tạo nên những khóa học hữu ích giúp bạn luyện tập nghe, nói, đọc và viết!
            </p>
          </div>
        </div>
      </section>

      <section className="w-full bg-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 flex justify-center">
        <div className="max-w-[988px] w-full flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16 lg:gap-[101px]">
          {/* Text content on the left */}
          <div className="flex-1 w-full text-center md:text-left flex flex-col justify-center items-center md:items-start">
            <h2 className="font-baloo text-3xl sm:text-4xl md:text-[2.5rem] leading-tight md:leading-[2.75rem] text-blue-500   font-bold">
              tiếp thêm động lực
            </h2>
            <p className="text-sm sm:text-base md:text-[1.15rem] leading-normal md:leading-[1.75rem] font-medium text-gray-700 mt-3 sm:mt-4 max-w-xl font-baloo mx-auto md:mx-0">
              Ứng dụng giúp người học dễ dàng xây dựng thói quen học tập, qua những tính năng mô phỏng trò chơi, các thử thách vui vẻ, và nhắc nhở từ người bạn thân thiện – cú Quiz.
            </p>
          </div>

          {/* Image on the right */}
          <div className="flex-1 flex justify-center w-full">
            <img
              src="https://media.giphy.com/media/kQulaQZ8vc6UUkBS6O/giphy.gif"
              alt="Quiz Motivation"
              className="w-full max-w-[320px] md:max-w-[360px]"
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-16 lg:gap-[101px] px-4 py-12 sm:py-16 md:py-20 max-w-[988px] mx-auto bg-white">
        {/* Image section */}
        <div className="flex-1 flex justify-center order-2 md:order-1 mt-6 md:mt-0">
          <img
            src="https://media.giphy.com/media/TkQAT5kmemGUp5Ok4U/giphy.gif"
            alt="Personalized learning"
            className="w-full max-w-[200px] sm:max-w-[250px] md:max-w-md"
          />
        </div>

        {/* Text section */}
        <div className="flex-1 text-center md:text-left order-1 md:order-2">
          <h2 className="text-3xl sm:text-4xl md:text-[2.5rem] leading-tight md:leading-[2.75rem] font-bold text-blue-500 font-baloo">
            cá nhân hóa trải <br className="hidden sm:block" /> nghiệm học
          </h2>
          <p className="text-gray-700 text-sm sm:text-base md:text-[1.25rem] leading-normal md:leading-[1.75rem] font-medium mt-3 sm:mt-4 font-baloo max-w-xl mx-auto md:mx-0">
            Kết hợp những điểm mạnh nhất của trí tuệ nhân tạo (AI) và khoa học về ngôn ngữ, các bài học được cá nhân hóa để giúp bạn tìm được cấp độ và nhịp độ học phù hợp nhất.
          </p>
        </div>
      </section>
    </>
  );
};

export default Footer;
