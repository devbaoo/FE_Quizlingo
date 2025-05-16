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
            <div className="hidden md:flex gap-6 items-center">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="font-baloo text-gray-600">XP: {user?.xp || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="https://d35aaqx5ub95lt.cloudfront.net/images/hearts/8fdba477c56a8eeb23f0f7e67fdec6d9.svg" />
                <span className="font-baloo text-gray-600">Lives: {user?.lives || 0}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="24" height="24" viewBox="-33 0 255 255" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid" fill="#000000">
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <defs>
                      <style>{`.cls-3 { fill: url(#linear-gradient-1); } .cls-4 { fill: #fc9502; } .cls-5 { fill: #fce202; }`}</style>
                      <linearGradient id="linear-gradient-1" gradientUnits="userSpaceOnUse" x1="94.141" y1="255" x2="94.141" y2="0.188">
                        <stop offset="0" stopColor="#ff4c0d"></stop>
                        <stop offset="1" stopColor="#fc9502"></stop>
                      </linearGradient>
                    </defs>
                    <g id="fire">
                      <path d="M187.899,164.809 C185.803,214.868 144.574,254.812 94.000,254.812 C42.085,254.812 -0.000,211.312 -0.000,160.812 C-0.000,154.062 -0.121,140.572 10.000,117.812 C16.057,104.191 19.856,95.634 22.000,87.812 C23.178,83.513 25.469,76.683 32.000,87.812 C35.851,94.374 36.000,103.812 36.000,103.812 C36.000,103.812 50.328,92.817 60.000,71.812 C74.179,41.019 62.866,22.612 59.000,9.812 C57.662,5.384 56.822,-2.574 66.000,0.812 C75.352,4.263 100.076,21.570 113.000,39.812 C131.445,65.847 138.000,90.812 138.000,90.812 C138.000,90.812 143.906,83.482 146.000,75.812 C148.365,67.151 148.400,58.573 155.999,67.813 C163.226,76.600 173.959,93.113 180.000,108.812 C190.969,137.321 187.899,164.809 187.899,164.809 Z" id="path-1" className="cls-3" fillRule="evenodd"></path>
                      <path d="M94.000,254.812 C58.101,254.812 29.000,225.711 29.000,189.812 C29.000,168.151 37.729,155.000 55.896,137.166 C67.528,125.747 78.415,111.722 83.042,102.172 C83.953,100.292 86.026,90.495 94.019,101.966 C98.212,107.982 104.785,118.681 109.000,127.812 C116.266,143.555 118.000,158.812 118.000,158.812 C118.000,158.812 125.121,154.616 130.000,143.812 C131.573,140.330 134.753,127.148 143.643,140.328 C150.166,150.000 159.127,167.390 159.000,189.812 C159.000,225.711 129.898,254.812 94.000,254.812 Z" id="path-2" className="cls-4" fillRule="evenodd"></path>
                      <path d="M95.000,183.812 C104.250,183.812 104.250,200.941 116.000,223.812 C123.824,239.041 112.121,254.812 95.000,254.812 C77.879,254.812 69.000,240.933 69.000,223.812 C69.000,206.692 85.750,183.812 95.000,183.812 Z" id="path-3" className="cls-5" fillRule="evenodd"></path>
                    </g>
                  </g>
                </svg>
                <span className="font-baloo text-gray-600">Streak: {user?.streak || 0}</span>
              </div>
            </div>

            <Dropdown menu={{ items }} placement="bottomRight">
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar
                  src={user?.avatar || "https://api.dicebear.com/6.x/fun-emoji/svg?seed=" + user?.firstName}
                  alt={user?.firstName}
                />
                <span className="font-baloo hidden md:inline">Hi, {user?.firstName} {user?.lastName}</span>
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
