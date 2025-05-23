import { useEffect } from 'react';
import { Table, Button, Space, Popconfirm, message } from 'antd';
import { DeleteOutlined, DashOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/services/store/store';
import { fetchUsers, deleteUser } from '@/services/features/admin/adminSlice';
import { IAdmin } from '@/interfaces/IAdmin';



const ManageUserPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading } = useSelector((state: RootState) => state.admin);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Handle delete user
  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteUser(id)).unwrap();
      message.success('User deleted successfully');
    } catch {
      message.error('Failed to delete user');
    }
  };

  const columns = [
    {
      title: <span style={{ fontFamily: "'Baloo 2', cursive" }}>First Name</span>,
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: <span style={{ fontFamily: "'Baloo 2', cursive" }}>Last Name</span>,
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: <span style={{ fontFamily: "'Baloo 2', cursive" }}>Email</span>,
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: <span style={{ fontFamily: "'Baloo 2', cursive" }}>Role</span>,
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: <span style={{ fontFamily: "'Baloo 2', cursive" }}>Last Login</span>,
      dataIndex: 'lastLoginDate',
      key: 'lastLoginDate',
      render: (date: string | null) => date ? new Date(date).toLocaleDateString() : <DashOutlined />,
    },
    {
      title: <span style={{ fontFamily: "'Baloo 2', cursive" }}>Actions</span>,
      key: 'actions',
      render: (_: unknown, record: IAdmin) => (
        <Space>
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "'Baloo 2', cursive" }}>User Management</h1>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="_id"
        loading={loading}
        className="font-baloo"
      />
    </div>
  );
};

export default ManageUserPage;
