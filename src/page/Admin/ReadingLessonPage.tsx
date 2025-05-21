import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

interface Lesson {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
}

const initialLessons: Lesson[] = [
  {
    _id: '1',
    title: 'Bài học từ vựng cơ bản',
    description: 'Học các từ vựng cơ bản cho người mới bắt đầu.',
    createdAt: new Date().toISOString(),
  },
  {
    _id: '2',
    title: 'Bài học ngữ pháp nâng cao',
    description: 'Ôn lại các thì và cấu trúc nâng cao trong tiếng Anh.',
    createdAt: new Date().toISOString(),
  },
];

const ReadingLessonPage = () => {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [form] = Form.useForm();

  const handleDelete = (id: string) => {
    setLessons(lessons.filter(lesson => lesson._id !== id));
    message.success('Xóa bài học thành công');
  };

  const handleSubmit = (values: Partial<Lesson>) => {
    if (editingLesson) {
      // Sửa
      const updated = lessons.map(item =>
        item._id === editingLesson._id
          ? { ...item, ...values }
          : item
      );
      setLessons(updated);
      message.success('Cập nhật bài học thành công');
    } else {
      // Thêm mới
      const newLesson: Lesson = {
        _id: Math.random().toString(36).substring(2, 9),
        title: values.title!,
        description: values.description!,
        createdAt: new Date().toISOString(),
      };
      setLessons([newLesson, ...lessons]);
      message.success('Thêm bài học thành công');
    }

    setIsModalVisible(false);
    form.resetFields();
    setEditingLesson(null);
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: Lesson) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingLesson(record);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
          />
          <Popconfirm
            title="Bạn chắc chắn muốn xóa bài học này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 'bold' }}>Quản lý Reading Lesson</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingLesson(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Thêm bài học
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={lessons}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingLesson ? 'Cập nhật bài học' : 'Thêm bài học'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsModalVisible(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {editingLesson ? 'Cập nhật' : 'Thêm'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReadingLessonPage;
