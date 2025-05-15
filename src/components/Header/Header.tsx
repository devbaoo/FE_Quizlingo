import { Typography } from "antd";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md p-4 flex flex-col sm:flex-row justify-between items-center">
      <a href="/" className="mb-4 sm:mb-0">
        <Typography.Title level={2} style={{ margin: 0, color: "#1677ff" }} className="font-baloo text-center sm:text-left">
          Quizlingo
        </Typography.Title>
      </a>
      <a href="/register" className="w-full sm:w-auto">
        <button
          className="w-full sm:w-auto rounded-2xl border-b-2 border-b-gray-300 bg-white px-4 py-3 font-bold text-blue-500 ring-2 ring-gray-300 hover:bg-gray-200 active:translate-y-[0.125rem] active:border-b-gray-200 font-baloo"
        >
          Đăng ký
        </button>
      </a>
    </header>
  );
}

export default Header;
