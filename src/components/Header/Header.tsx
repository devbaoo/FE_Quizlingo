import { Typography, Dropdown, Avatar } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/services/store/store";
import { logout } from "@/services/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import type { MenuProps } from "antd";
import { Link } from "react-router-dom";

const Header = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <span className="font-baloo">Hồ sơ</span>,
      onClick: () => navigate("/profile"),
    },
    {
      key: "2",
      label: <span className="font-baloo">Cài đặt</span>,
      onClick: () => navigate("/settings"),
    },
    ...(user?.role === "admin" ? [{
      key: "3",
      label: <span className="font-baloo">Admin Dashboard</span>,
      onClick: () => navigate("/admin"),
    }] : []),
    {
      key: "4",
      label: <span className="font-baloo text-red-500">Đăng xuất</span>,
      onClick: handleLogout,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2">
        <Typography.Title level={2} style={{ margin: 0, color: "#1677ff" }} className="font-baloo">
          Quizlingo
        </Typography.Title>
      </Link>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <div className="hidden md:flex gap-2 items-center">
              <span className="font-baloo text-gray-600">XP: {user?.xp || 0}</span>
              <span className="font-baloo text-gray-600">Lives: {user?.lives || 0}</span>
              <span className="font-baloo text-gray-600">Streak: {user?.streak || 0}</span>
            </div>

            <Dropdown menu={{ items }} placement="bottomRight">
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar
                  src={user?.avatar || "https://api.dicebear.com/6.x/fun-emoji/svg?seed=" + user?.firstName}
                  alt={user?.firstName}
                />
                <span className="font-baloo hidden md:inline">{user?.firstName}</span>
              </div>
            </Dropdown>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <button className="rounded-2xl border-b-2 border-b-gray-300 bg-white px-4 py-2 font-bold text-blue-500 ring-2 ring-gray-300 hover:bg-gray-200 active:translate-y-[0.125rem] active:border-b-gray-200 font-baloo">
                Đăng nhập
              </button>
            </Link>
            <Link to="/register">
              <button className="rounded-2xl border-b-2 border-b-blue-300 bg-blue-500 px-4 py-2 font-bold text-white ring-2 ring-blue-300 hover:bg-blue-400 active:translate-y-[0.125rem] active:border-b-blue-200 font-baloo">
                Đăng ký
              </button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
