import { Outlet } from 'react-router-dom';
import Header from '@/components/Header/Header';
import Sidebar from '@/components/Layout/Sibar';

const UserLayout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-pink-50">
            <Header />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 ml-[224px]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default UserLayout; 