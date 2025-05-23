import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import { fetchUserProfile, uploadUserAvatar } from "@/services/features/user/userSlice";
import Sidebar from "@/components/Layout/SidebarUser";
import { FaPlus, FaMedal, FaStar, FaBullseye, FaUserGraduate, FaHeart } from "react-icons/fa";
import { TbVocabulary } from "react-icons/tb";

const mainColor = "bg-gradient-to-br from-blue-100 via-pink-50 to-yellow-100";
const cardColor = "bg-white border border-blue-200 shadow rounded-xl";

const ProfilePage = () => {
    const dispatch = useAppDispatch();
    const { profile, loading, error } = useAppSelector((state) => state.user);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        dispatch(fetchUserProfile());
    }, [dispatch]);

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith("image/")) {
            const formData = new FormData();
            formData.append("avatar", file);

            try {
                const resultAction = await dispatch(uploadUserAvatar(formData));
                if (uploadUserAvatar.rejected.match(resultAction)) {
                    alert("Upload avatar failed: " + (resultAction.payload || "Unknown error"));
                }
            } catch (err) {
                alert("Lỗi khi upload avatar: " + err);
            }
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
        <div className={`${mainColor} min-h-screen flex`}>
            <Sidebar />
            <div className="flex-1 ml-[224px] px-8 py-12">
                {profile && (
                    <div className={`${cardColor} max-w-5xl ml-8 mr-0 p-10 space-y-10`}>
                        <h1 className="text-3xl font-bold text-blue-600 mb-8 font-baloo">Hồ sơ cá nhân</h1>
                        <div className="flex flex-col items-center gap-6">
                            <div
                                onClick={handleClickAvatar}
                                className="relative w-36 h-36 rounded-full border-4 border-blue-200 flex items-center justify-center overflow-hidden cursor-pointer hover:ring-4 hover:ring-blue-300 transition"
                            >
                                {profile.avatar ? (
                                    <img
                                        src={profile.avatar}
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <FaPlus className="text-blue-400 text-3xl" />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </div>
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-blue-700 font-baloo">
                                    {profile.firstName} {profile.lastName}
                                </h2>
                                <p className="text-blue-500 text-base font-semibold">{profile.email}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className={`${cardColor} p-4 flex flex-col items-center`}>
                                <FaMedal className="text-blue-400 text-2xl mb-1" />
                                <div className="font-baloo text-blue-700">Cấp độ</div>
                                <div className="font-bold text-lg">{profile.userLevel}</div>
                            </div>
                            <div className={`${cardColor} p-4 flex flex-col items-center`}>
                                <FaStar className="text-yellow-400 text-2xl mb-1" />
                                <div className="font-baloo text-yellow-700">XP</div>
                                <div className="font-bold text-lg">{profile.xp}</div>
                            </div>
                            <div className={`${cardColor} p-4 flex flex-col items-center`}>
                                <FaHeart className="text-pink-400 text-2xl mb-1" />
                                <div className="font-baloo text-pink-700">Lives</div>
                                <div className="font-bold text-lg">{profile.lives}</div>
                            </div>
                            <div className={`${cardColor} p-4 flex flex-col items-center`}>
                                <FaUserGraduate className="text-orange-400 text-2xl mb-1" />
                                <div className="font-baloo text-orange-700">Trình độ</div>
                                <div className="font-bold text-lg capitalize">{profile.level}</div>
                            </div>
                            <div className={`${cardColor} p-4 flex flex-col items-center`}>
                                <TbVocabulary className="text-blue-400 text-2xl mb-1" />
                                <div className="font-baloo text-blue-700">Từ vựng đã hoàn thành</div>
                                <div className="font-bold text-lg">{profile.completedBasicVocab?.length || 0}</div>
                            </div>
                            <div className={`${cardColor} p-4 flex flex-col items-center`}>
                                <FaBullseye className="text-purple-400 text-2xl mb-1" />
                                <div className="font-baloo text-purple-700">Kỹ năng ưu tiên</div>
                                <div className="font-bold text-lg capitalize">
                                    {(profile.preferredSkills && profile.preferredSkills.length > 0)
                                        ? profile.preferredSkills.join(", ")
                                        : "Chưa chọn"}
                                </div>
                            </div>
                            {profile.activePackage && (
                                <div className={`${cardColor} p-4 flex flex-col items-center border-yellow-300`}>
                                    <FaStar className="text-yellow-500 text-2xl mb-1" />
                                    <div className="font-baloo text-yellow-700">Gói Premium</div>
                                    <div className="font-bold text-lg text-yellow-700">{profile.activePackage.name}</div>
                                    <div className="text-gray-600 text-sm">
                                        Hiệu lực: {new Date(profile.activePackage.startDate).toLocaleDateString()} - {new Date(profile.activePackage.endDate).toLocaleDateString()}
                                    </div>
                                    <div className="font-bold text-pink-600 mt-1">
                                        Còn lại: {profile.activePackage.daysRemaining} ngày
                                    </div>
                                    {profile.activePackage.isExpiringSoon && (
                                        <div className="text-red-500 font-bold mt-1">Sắp hết hạn!</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;