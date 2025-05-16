import { useSelector } from 'react-redux';
import { RootState } from '@/services/store/store';

const AdminDashboard = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 font-baloo">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-xl font-bold mb-2 text-blue-600 font-baloo">Người dùng</div>
                    <div className="text-3xl font-bold">1,234</div>
                    <div className="text-sm text-gray-500 mt-2">Tổng số người dùng</div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-xl font-bold mb-2 text-green-600 font-baloo">Kỹ năng</div>
                    <div className="text-3xl font-bold">24</div>
                    <div className="text-sm text-gray-500 mt-2">Tổng số kỹ năng</div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-xl font-bold mb-2 text-orange-600 font-baloo">Chủ đề</div>
                    <div className="text-3xl font-bold">36</div>
                    <div className="text-sm text-gray-500 mt-2">Tổng số chủ đề</div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
                <h2 className="text-xl font-bold mb-4 font-baloo">Thông tin tài khoản</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <div className="text-sm text-gray-500 mb-1">Tên</div>
                        <div className="font-medium">{user?.firstName} {user?.lastName}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500 mb-1">Email</div>
                        <div className="font-medium">{user?.email}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500 mb-1">Vai trò</div>
                        <div className="font-medium uppercase">{user?.role}</div>
                    </div>
                    <div>
                        <div className="text-sm text-gray-500 mb-1">Trạng thái xác thực</div>
                        <div className="font-medium">{user?.isVerify ? 'Đã xác thực' : 'Chưa xác thực'}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard; 