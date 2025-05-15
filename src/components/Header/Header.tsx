import { Typography } from "antd";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md p-4 flex justify-between items-center">
      <a href="/">
        <Typography.Title level={2} style={{ margin: 0, color: "#1677ff", width: "133.516px", transform: "translate(127px, 0px)" }} className="font-baloo">
          Quizlingo
        </Typography.Title>
      </a>
      <a href="/register">
        <button
          className="rounded-2xl border-b-2 border-b-gray-300 bg-white px-4 py-3 font-bold text-blue-500 ring-2 ring-gray-300 hover:bg-gray-200 active:translate-y-[0.125rem] active:border-b-gray-200 font-baloo"
          style={{ width: "146.938px", transform: "translate(-127px, 0px)" }}
        >
          Đăng ký
        </button>
      </a>
    </header>
  );
}

export default Header;
