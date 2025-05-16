import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import { fetchUserProfile } from "@/services/features/user/userSlice";
import Sidebar from "@/components/Layout/Sibar";

const ProfilePage = () => {
    const dispatch = useAppDispatch();
    const { profile, loading, error } = useAppSelector((state) => state.user);

    useEffect(() => {
        dispatch(fetchUserProfile());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
                <Sidebar />
                <div className="flex-1 ml-[224px] px-8 py-10">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                        <div className="space-y-4">
                            <div className="h-32 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
                <Sidebar />
                <div className="flex-1 ml-[224px] px-8 py-10">
                    <div className="text-red-500">Error: {error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
            <Sidebar />
            <div className="flex-1 ml-[224px] px-8 py-10">
                <h1 className="text-4xl font-baloo font-extrabold text-blue-600 mb-8">
                    Hồ sơ của bạn
                </h1>

                {profile && (
                    <div className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl">
                        <div className="flex items-center gap-6 mb-8">
                            <img
                                src={profile.avatar}
                                alt={`${profile.firstName} ${profile.lastName}`}
                                className="w-24 h-24 rounded-full border-4 border-blue-100"
                            />
                            <div>
                                <h2 className="text-2xl font-baloo font-bold text-gray-800">
                                    {profile.firstName} {profile.lastName}
                                </h2>
                                <p className="text-gray-600">{profile.email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-blue-50 rounded-xl p-4">
                                <h3 className="font-baloo text-blue-600 mb-2">Cấp độ</h3>
                                <p className="text-2xl font-bold">{profile.userLevel}</p>
                            </div>
                            <div className="bg-green-50 rounded-xl p-4">
                                <h3 className="font-baloo text-green-600 mb-2">XP</h3>
                                <p className="text-2xl font-bold">{profile.xp}</p>
                            </div>
                            <div className="bg-purple-50 rounded-xl p-4">
                                <h3 className="font-baloo text-purple-600 mb-2">Lives</h3>
                                <p className="text-2xl font-bold">{profile.lives}</p>
                            </div>
                            <div className="bg-orange-50 rounded-xl p-4">
                                <h3 className="font-baloo text-orange-600 mb-2">Trình độ</h3>
                                <p className="text-2xl font-bold capitalize">{profile.level}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage; 