import { Typography, Dropdown, Avatar } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "@/services/store/store";
import { logout, changePassword } from "@/services/features/auth/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import type { MenuProps } from "antd";
import { useEffect, useState } from "react";
import { fetchUserProfile } from "@/services/features/user/userSlice";
import { useAppDispatch } from "@/services/store/store";
import ChangePasswordModal from "@/components/Modal/ChangePasswordModal";
import { FaFire, FaHeart, FaCrown } from "react-icons/fa";
import NotificationButton from "@/components/Notification/NotificationButton";

function getStreakColor(streak: number) {
  if (streak >= 25) return "#b16cff";      // tím
  if (streak >= 15) return "#ff5ecb";      // hồng
  if (streak >= 8) return "#ff4e4e";      // đ
  if (streak >= 5) return "#ff9900";      // cam đậm
  if (streak >= 2) return "#ffb300";      // cam nhạt
  return "#bdbdbd";                         // xám (chưa có streak)
}

const Header = () => {
  const { isAuthenticated, user: authUser } = useSelector((state: RootState) => state.auth);
  const { profile: userProfile } = useSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const isInLesson = location.pathname.startsWith('/lesson/') && !location.pathname.startsWith('/lesson/submit');

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserProfile());
    }
  }, [isAuthenticated, dispatch]);

  const handleNavigation = (path: string) => {
    if (isInLesson) {
      if (window.confirm('Bạn có chắc chắn muốn rời khỏi trang? Tiến độ bài học của bạn sẽ không được lưu.')) {
        navigate(path);
      }
    } else {
      navigate(path);
    }
  };

  const handleLogout = () => {
    if (isInLesson) {
      if (window.confirm('Bạn có chắc chắn muốn rời khỏi trang? Tiến độ bài học của bạn sẽ không được lưu.')) {
        dispatch(logout());
        navigate("/");
      }
    } else {
      dispatch(logout());
      navigate("/");
    }
  };

  // Callback to handle password change
  const handlePasswordChange = async (oldPassword: string, newPassword: string, confirmPassword: string) => {
    try {
      await dispatch(changePassword({ oldPassword, newPassword, confirmPassword })).unwrap();
      setIsPasswordModalOpen(false);
    } catch {
      // Error is handled in the slice
    }
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <span className="font-baloo">Hồ sơ</span>,
      onClick: () => handleNavigation("/profile"),
    },
    {
      key: "2",
      label: <span className="font-baloo">Đổi mật khẩu</span>,
      onClick: () => setIsPasswordModalOpen(true),
    },
    ...(authUser?.role === "admin" ? [{
      key: "3",
      label: <span className="font-baloo">Admin Dashboard</span>,
      onClick: () => handleNavigation("/admin"),
    }] : []),
    {
      key: "4",
      label: <span className="font-baloo text-red-500">Đăng xuất</span>,
      onClick: handleLogout,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-md p-4 flex justify-between items-center font-baloo">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNavigation("/")}>
          <Typography.Title level={2} style={{ margin: 0, color: "#1677ff" }} className="font-baloo">
            Quizlingo
          </Typography.Title>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <div className="hidden md:flex gap-6 items-center">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="font-baloo text-gray-600">XP: {userProfile?.xp || 0}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, idx) => (
                      <FaHeart
                        key={idx}
                        color={(userProfile?.lives || 0) > idx ? "#ff4d6d" : "#e0e0e0"}
                        size={20}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FaFire style={{ color: getStreakColor(userProfile?.streak || 0) }} size={22} />
                  <span className="font-baloo text-gray-600">Streak: {userProfile?.streak || 0}</span>
                </div>
              </div>

              <NotificationButton />

              <Dropdown menu={{ items }} placement="bottomRight">
                <div className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <Avatar
                      src={userProfile?.avatar || "https://api.dicebear.com/6.x/fun-emoji/svg?seed=" + userProfile?.firstName}
                      alt={userProfile?.firstName}
                      className="w-10 h-10 border-2 border-gray-200 group-hover:border-blue-400 transition-all duration-300"
                    />
                    {userProfile?.activePackage && (
                      <div className="absolute -top-3 -right-0.5 transform rotate-12">
                        <span className="inline-flex items-center gap-0.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-1 py-[1px] rounded-full text-[10px] font-bold shadow-sm">
                          <FaCrown className="text-yellow-300 text-[8px]" />
                          <span>VIP</span>
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="font-baloo hidden md:inline text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                    Hi, <span className="font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">{userProfile?.firstName} {userProfile?.lastName}</span>
                  </span>
                </div>
              </Dropdown>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNavigation("/login")}
                className="rounded-2xl border-b-2 border-b-gray-300 bg-white px-4 py-2 font-bold text-blue-500 ring-2 ring-gray-300 hover:bg-gray-200 active:translate-y-[0.125rem] active:border-b-gray-200 font-baloo"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => handleNavigation("/register")}
                className="rounded-2xl border-b-2 border-b-blue-300 bg-blue-500 px-4 py-2 font-bold text-white ring-2 ring-blue-300 hover:bg-blue-400 active:translate-y-[0.125rem] active:border-b-blue-200 font-baloo"
              >
                Đăng ký
              </button>
            </div>
          )}
        </div>
      </header>
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handlePasswordChange}
      />
    </>
  );
};

export default Header;
