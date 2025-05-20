import { useSelector } from 'react-redux';
import { RootState } from '@/services/store/store';

const AdminDashboard = () => {
    const { user } = useSelector((state: RootState) => state.auth);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 font-baloo">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <SummaryCard title="Người dùng" count="1,234" color="blue" subtitle="Tổng số người dùng" />
                <SummaryCard title="Bài học" count="320" color="purple" subtitle="Tổng số bài học" />
                <SummaryCard title="Cấp độ" count="6" color="red" subtitle="Tổng số cấp độ" />
                <SummaryCard title="Kỹ năng" count="24" color="green" subtitle="Tổng số kỹ năng" />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
                <h2 className="text-xl font-bold mb-4 font-baloo">Thông tin tài khoản</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoRow label="Tên" value={`${user?.firstName} ${user?.lastName}`} />
                    <InfoRow label="Email" value={user?.email} />
                    <InfoRow label="Vai trò" value={user?.role?.toUpperCase()} />
                    <InfoRow label="Trạng thái xác thực" value={user?.isVerify ? 'Đã xác thực' : 'Chưa xác thực'} />
                </div>
            </div>
        </div>
    );
};

const SummaryCard = ({ title, count, color, subtitle }: { title: string, count: string, color: string, subtitle: string }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className={`text-xl font-bold mb-2 text-${color}-600 font-baloo`}>{title}</div>
        <div className="text-3xl font-bold">{count}</div>
        <div className="text-sm text-gray-500 mt-2">{subtitle}</div>
    </div>
);

const InfoRow = ({ label, value }: { label: string, value?: string }) => (
    <div>
        <div className="text-sm text-gray-500 mb-1">{label}</div>
        <div className="font-medium">{value || '-'}</div>
    </div>
);

export default AdminDashboard;
