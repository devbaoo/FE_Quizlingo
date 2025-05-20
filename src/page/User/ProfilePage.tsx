import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import { fetchUserProfile } from "@/services/features/user/userSlice";
import Sidebar from "@/components/Layout/Sibar";
import { FaPlus, FaMedal, FaStar } from "react-icons/fa";
import { BsStars } from "react-icons/bs";
import { FaUserGraduate, FaHeart } from "react-icons/fa";
import { setAvatar } from "@/services/features/auth/authSlice";

const AVATAR_STORAGE_KEY = "quizlingo_user_avatar";

const ProfilePage = () => {
    const dispatch = useAppDispatch();
    const { profile, loading, error } = useAppSelector((state) => state.user);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        dispatch(fetchUserProfile());
        const savedAvatar = localStorage.getItem(AVATAR_STORAGE_KEY);
        if (savedAvatar) {
            setAvatarPreview(savedAvatar);
        }
    }, [dispatch]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setAvatarPreview(result);
                localStorage.setItem(AVATAR_STORAGE_KEY, result);
                dispatch(setAvatar(result));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleClickAvatar = () => {
        fileInputRef.current?.click();
    };

    if (loading) {
        return <div className="text-center p-10">Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center p-10">Lỗi: {error}</div>;
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-indigo-200 via-pink-100 to-yellow-100">
            <Sidebar />
            <div className="flex-1 ml-[224px] px-10 py-14">
                <div className="flex items-center gap-3 mb-8">
                    <BsStars className="text-5xl text-yellow-400 drop-shadow-glow" />
                    <h1 className="text-6xl font-baloo font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-pink-500 to-yellow-500 drop-shadow-lg">
                        Hồ sơ của bạn
                    </h1>
                </div>

                {profile && (
                    <div className="bg-white/80 backdrop-blur-md rounded-[40px] shadow-2xl p-12 max-w-5xl mx-auto space-y-10 border-4 border-pink-200">
                        <div className="flex flex-col md:flex-row items-center gap-10">
                            <div
                                onClick={handleClickAvatar}
                                className="relative w-48 h-48 bg-gradient-to-br from-indigo-200 via-pink-200 to-yellow-100 rounded-full flex items-center justify-center overflow-hidden cursor-pointer hover:ring-8 hover:ring-pink-200 transition-all shadow-2xl"
                            >
                                {avatarPreview || profile.avatar ? (
                                    <img
                                        src={avatarPreview || profile.avatar}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <FaPlus className="text-pink-400 text-5xl" />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </div>

                            <div className="text-center md:text-left">
                                <h2 className="text-4xl font-baloo font-bold text-indigo-700 mb-1 drop-shadow">
                                    {profile.firstName} {profile.lastName}
                                </h2>
                                <p className="text-pink-500 text-xl mb-3 font-semibold">{profile.email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-gradient-to-br from-indigo-100 via-indigo-50 to-pink-100 rounded-2xl p-8 text-center shadow-lg border-2 border-indigo-200">
                                <div className="flex justify-center mb-2">
                                    <FaMedal className="text-4xl text-yellow-500 drop-shadow-glow" /> {/* Đổi icon cấp độ */}
                                </div>
                                <h3 className="font-baloo text-indigo-600 mb-1 text-xl">Cấp độ</h3>
                                <p className="text-3xl font-extrabold text-indigo-700">{profile.userLevel}</p>
                            </div>
                            <div className="bg-gradient-to-br from-green-100 via-green-50 to-yellow-100 rounded-2xl p-8 text-center shadow-lg border-2 border-green-200">
                                <div className="flex justify-center mb-2">
                                    <FaStar className="text-4xl text-green-500 drop-shadow-glow" /> {/* Đổi icon XP */}
                                </div>
                                <h3 className="font-baloo text-green-600 mb-1 text-xl">XP</h3>
                                <p className="text-3xl font-extrabold text-green-700">{profile.xp}</p>
                            </div>
                            <div className="bg-gradient-to-br from-red-100 via-pink-50 to-yellow-100 rounded-2xl p-8 text-center shadow-lg border-2 border-red-200">
                                <div className="flex justify-center mb-2">
                                    <FaHeart className="text-4xl text-red-400 drop-shadow-glow" />
                                </div>
                                <h3 className="font-baloo text-red-500 mb-1 text-xl">Lives</h3>
                                <p className="text-3xl font-extrabold text-red-600">{profile.lives}</p>
                            </div>
                            <div className="bg-gradient-to-br from-orange-100 via-yellow-50 to-pink-100 rounded-2xl p-8 text-center shadow-lg border-2 border-orange-200">
                                <div className="flex justify-center mb-2">
                                    <FaUserGraduate className="text-4xl text-orange-400 drop-shadow-glow" />
                                </div>
                                <h3 className="font-baloo text-orange-500 mb-1 text-xl">Trình độ</h3>
                                <p className="text-3xl font-extrabold capitalize text-orange-600">{profile.level}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;