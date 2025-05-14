import { Typography } from "antd";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md p-4 flex justify-between items-center">
      <Typography.Title level={3} style={{ margin: 0, color: "#1677ff" }}>
        Quizlingo
      </Typography.Title>
      <a href="/register">
        <button
          className="rounded-2xl border-b-2 border-b-gray-300 bg-white px-4 py-3 font-bold text-blue-500 ring-2 ring-gray-300 hover:bg-gray-200 active:translate-y-[0.125rem] active:border-b-gray-200"
        >
          Đăng ký
        </button>
      </a>
    </header>
  );
}

export default Header;
