const Footer = () => {
  return (
    <>
      <section className="w-full flex justify-center bg-white py-20 px-6">
        <div className="max-w-6xl flex flex-col md:flex-row items-center gap-24">
          {/* Left Text Content */}
          <div className="flex-1">
            <h2 className="font-baloo text-4xl md:text-5xl font-bold text-blue-500 leading-tight">
              miễn phí. vui nhộn. <br /> hiệu quả
            </h2>
            <p className="font-baloo mt-4 text-base md:text-lg text-gray-700 max-w-xl leading-relaxed">
              Học cùng Quizlingo rất vui nhộn,{" "}
              <span className="text-green-500 font-bold font-baloo">
                các nghiên cứu đã chứng minh ứng dụng thật sự hiệu quả
              </span>
              ! Các bài học nhỏ gọn sẽ giúp bạn ghi điểm, mở khóa cấp độ mới và luyện tập kỹ năng giao tiếp hữu dụng.
            </p>
          </div>

          {/* Right Image */}
          <div className="flex-1 flex justify-center">
            <img
              src="https://d35aaqx5ub95lt.cloudfront.net/images/splash/lottie/23ab11cb1e1a9aff54facdf57833373d.svg"
              alt="Quizlingo Characters"
              className="w-full max-w-sm"
            />
          </div>
        </div>
      </section>
      <section className="w-full flex justify-center bg-white py-16 px-6">
        <div className="max-w-6xl w-full flex flex-col-reverse md:flex-row items-center gap-20">
          {/* Left Image */}
          <div className="flex-1 flex justify-center">
            <img
              src="https://d35aaqx5ub95lt.cloudfront.net/images/splash/lottie/08ec8d0260c55c054e1b97bcbc96ea0f.svg"
              alt="Scientific Illustration"
              className="w-full max-w-md"
            />
          </div>

          {/* Right Text */}
          <div className="flex-1">
            <h2 className="font-baloo text-4xl md:text-5xl font-bold text-blue-500 leading-tight">
              Dựa trên căn cứ <br /> khoa học
            </h2>
            <p className="mt-4 text-base md:text-lg text-gray-700 max-w-xl leading-relaxed font-baloo">
              Chúng tôi kết hợp các phương pháp giảng dạy khoa học với nội dung học thú vị để tạo nên những khóa học hữu ích giúp bạn luyện tập nghe, nói, đọc và viết!
            </p>
          </div>
        </div>
      </section>
      <section className="w-full bg-white py-20 px-6 flex justify-center">
        <div className="max-w-[988px] w-full flex flex-col md:flex-row-reverse items-center gap-[101px]">
          {/* Image on the right */}
          <div className="flex-1 flex justify-center">
            <img
              src="https://d35aaqx5ub95lt.cloudfront.net/images/splash/lottie/833a22b2834050d139f266a29899bb00.svg"
              alt="Duo Motivation"
              className="w-full max-w-md"
            />
          </div>

          {/* Text content on the left */}
          <div className="flex-1">
            <h2 className="font-baloo text-[2.5rem] leading-[2.75rem] text-blue-500 font-bold">
              tiếp thêm động lực
            </h2>
            <p className="text-[1.25rem] leading-[1.75rem] font-medium text-gray-700 mt-4 max-w-xl font-baloo">
              Ứng dụng giúp người học dễ dàng xây dựng thói quen học tập, qua những tính năng mô phỏng trò chơi, các thử thách vui vẻ, và nhắc nhở từ người bạn thân thiện – cú Quiz.
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col-reverse md:flex-row items-center justify-center gap-16 md:gap-[101px] px-4 py-20 max-w-[988px] mx-auto bg-white">
        {/* Image section */}
        <div className="flex-1 flex justify-center">
          <img
            src="https://d35aaqx5ub95lt.cloudfront.net/images/splash/lottie/23ab11cb1e1a9aff54facdf57833373d.svg"
            alt="Personalized learning"
            className="w-full max-w-md"
          />
        </div>

        {/* Text section */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-[2.5rem] leading-[2.75rem] font-bold text-blue-500 font-baloo">
            cá nhân hóa trải <br /> nghiệm học
          </h2>
          <p className="text-gray-700 text-[1.25rem] leading-[1.75rem] font-medium mt-4 font-baloo max-w-xl mx-auto md:mx-0">
            Kết hợp những điểm mạnh nhất của trí tuệ nhân tạo (AI) và khoa học về ngôn ngữ, các bài học được cá nhân hóa để giúp bạn tìm được cấp độ và nhịp độ học phù hợp nhất.
          </p>
        </div>
      </section>
    </>

  );

};

export default Footer;
