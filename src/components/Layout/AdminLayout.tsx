import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/services/store/store';
import { Link } from 'react-router-dom';

const AdminLayout = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-blue-600 text-white p-4">
                <div className="text-2xl font-bold mb-8 font-baloo">Quizlingo Admin</div>

                <div className="mb-6">
                    <div className="text-sm text-blue-200 mb-2">Xin chào</div>
                    <div className="font-bold">{user?.firstName} {user?.lastName}</div>
                </div>

                <nav className="space-y-1">
                    <Link to="/admin" className="block py-2.5 px-4 rounded hover:bg-blue-700 font-baloo">
                        Dashboard
                    </Link>
                    <Link to="/admin/users" className="block py-2.5 px-4 rounded hover:bg-blue-700 font-baloo">
                        Quản lý người dùng
                    </Link>
                    <Link to="/admin/content" className="block py-2.5 px-4 rounded hover:bg-blue-700 font-baloo">
                        Quản lý nội dung
                    </Link>
                    <Link to="/admin/skills" className="block py-2.5 px-4 rounded hover:bg-blue-700 font-baloo">
                        Quản lý kỹ năng
                    </Link>
                    <Link to="/admin/topics" className="block py-2.5 px-4 rounded hover:bg-blue-700 font-baloo">
                        Quản lý chủ đề
                    </Link>
                </nav>
            </div>

            {/* Main content */}
            <div className="flex-1 p-8">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout; 