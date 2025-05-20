import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/services/store/store';
import { Link } from 'react-router-dom';
import Sidebar from '../Sibebar/Sidebar';

const AdminLayout = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar/>
           

            {/* Main content */}
            <div className="flex-1 p-8">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout; 