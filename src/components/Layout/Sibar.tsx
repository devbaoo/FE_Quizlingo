import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "@/services/features/auth/authSlice";
import { Link } from "react-router-dom";

const menuItems = [
    {
        icon: "https://d35aaqx5ub95lt.cloudfront.net/vendor/784035717e2ff1d448c0f6cc4efc89fb.svg",
        label: "Học",
        href: "/learn",
    },

    {
        icon: null,
        label: "Hồ sơ",
        href: "/profile",
        profileInitial: "P",
    },
    {
        icon: "https://d35aaqx5ub95lt.cloudfront.net/vendor/7159c0b5d4250a5aea4f396d53f17f0c.svg",
        label: "Xem thêm",
        href: "#",
        hasDropdown: true,
    },
];

export default function Sidebar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <aside className="fixed top-0 left-0 h-screen w-[224px] bg-white border-r-2 border-gray-200 px-4 py-6 overflow-y-auto z-[210]">
            <nav className="flex flex-col gap-3">
                <Link
                    to="/learn"
                    className="mb-5 ml-5 mt-5 text-3xl font-bold text-blue-500 hidden lg:block"
                >
                    Quizlingo
                </Link>
                {menuItems.map((item, index) => (
                    <div key={index} className="relative">
                        <a
                            href={item.href}
                            onClick={(e) => {
                                if (item.hasDropdown) {
                                    e.preventDefault();
                                    setIsDropdownOpen(!isDropdownOpen);
                                }
                            }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold 
                            ${item.href === window.location.pathname ? "bg-gray-100 text-blue-600 border border-blue-300" : "hover:bg-gray-100 text-gray-700"}`}
                        >
                            <div className="w-8 h-8 flex items-center justify-center">
                                {item.icon ? (
                                    <img src={item.icon} alt={item.label} className="w-10 h-10" />
                                ) : (
                                    <div className="bg-gray-200 text-gray-600 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs">
                                        {item.profileInitial}
                                    </div>
                                )}
                            </div>
                            <span>{item.label}</span>
                        </a>

                        {/* Dropdown Menu */}
                        {
                            item.hasDropdown && isDropdownOpen && (
                                <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-100 font-bold"
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            )
                        }
                    </div>
                ))}
            </nav>
        </aside >
    );
}
