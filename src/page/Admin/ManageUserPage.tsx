import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { User } from '@/interfaces/IUser';
import { apiMethods } from '@/services/constant/axiosInstance';

const ManageUserPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiMethods.get<User[]>('/users');
      if (response.data.success) {
        setUsers(response.data.data || []);
      }
    } catch (error) {
      message.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle update user
  const handleSubmit = async (values: Partial<User>) => {
    try {
      const response = await apiMethods.put(`/users/${editingUser?.id}`, values);
      if (response.data.success) {
        message.success('User updated successfully');
        fetchUsers();
      }
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Operation failed');
    }
  };

  // Handle delete user
  const handleDelete = async (id: string) => {
    try {
      const response = await apiMethods.delete(`/users/${id}`);
      if (response.data.success) {
        message.success('User deleted successfully');
        fetchUsers();
      }
    } catch (error) {
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
      title: <span style={{ fontFamily: "'Baloo 2', cursive" }}>Streak</span>,
      dataIndex: 'streak',
      key: 'streak',
    },
    {
      title: <span style={{ fontFamily: "'Baloo 2', cursive" }}>User Level</span>,
      dataIndex: 'userLevel',
      key: 'userLevel',
    },
    {
      title: <span style={{ fontFamily: "'Baloo 2', cursive" }}>Level</span>,
      dataIndex: 'level',
      key: 'level',
    },
    {
      title: <span style={{ fontFamily: "'Baloo 2', cursive" }}>Actions</span>,
      key: 'actions',
      render: (_: any, record: User) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingUser(record);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
          />
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(record.id)}
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
        rowKey="id"
        loading={loading}
        className="font-baloo"
      />

      <Modal
        title={<span style={{ fontFamily: "'Baloo 2', cursive" }}>Edit User</span>}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="font-baloo"
        >
          <Form.Item
            name="firstName"
            label={<span style={{ fontFamily: "'Baloo 2', cursive" }}>First Name</span>}
            rules={[{ required: true, message: 'Please input first name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label={<span style={{ fontFamily: "'Baloo 2', cursive" }}>Last Name</span>}
            rules={[{ required: true, message: 'Please input last name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label={<span style={{ fontFamily: "'Baloo 2', cursive" }}>Email</span>}
            rules={[
              { required: true, message: 'Please input email!' },
              { type: 'email', message: 'Please input valid email!' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label={<span style={{ fontFamily: "'Baloo 2', cursive" }}>Role</span>}
            rules={[{ required: true, message: 'Please input role!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item className="mb-0 text-right">
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ManageUserPage;
