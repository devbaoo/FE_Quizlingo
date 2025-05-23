import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  Select,
  message,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { apiMethods } from '@/services/constant/axiosInstance';
import { GET_ALL_LESSONS_ENDPOINT } from '@/services/constant/apiConfig';
import { ILesson } from '@/interfaces/IAdmin';

const { Option } = Select;

const LessonsPage = () => {
  const [lessons, setLessons] = useState<ILesson[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingLesson, setEditingLesson] = useState<ILesson | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const fetchLessons = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const response = await apiMethods.get(
        `${GET_ALL_LESSONS_ENDPOINT}?page=${page}&limit=${limit}&sortBy=createdAt&sortOrder=desc`
      );
      const data = response.data.data as { lessons: ILesson[] };
      const lessons = data.lessons || [];
      setLessons(lessons);
      setPagination({
        current: page,
        pageSize: limit,
        total: lessons.length,
      });
    } catch (error) {
      message.error('Failed to fetch lessons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const handleTableChange = (pagination: any) => {
    fetchLessons(pagination.current, pagination.pageSize);
  };

  const handleDelete = async (id: string) => {
    try {
      // TODO: Implement delete API call
      setLessons(lessons.filter((lesson) => lesson._id !== id));
      message.success('Xóa bài học thành công');
    } catch (error) {
      message.error('Failed to delete lesson');
    }
  };

  const handleSubmit = async (values: Partial<ILesson>) => {
    try {
      // TODO: Implement create/update API call
      const newLesson: ILesson = {
        _id: editingLesson?._id || Math.random().toString(36).substring(2, 9),
        title: values.title!,
        type: values.type as 'multiple_choice' | 'text_input',
        topic: values.topic as any,
        level: values.level as any,
        skill: values.skill as any,
        maxScore: values.maxScore || 100,
        timeLimit: values.timeLimit || 60,
        questions: [],
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      if (editingLesson) {
        setLessons(
          lessons.map((l) => (l._id === editingLesson._id ? newLesson : l))
        );
        message.success('Cập nhật bài học thành công');
      } else {
        setLessons([newLesson, ...lessons]);
        message.success('Thêm bài học thành công');
      }

      setIsModalVisible(false);
      form.resetFields();
      setEditingLesson(null);
    } catch (error) {
      message.error('Failed to save lesson');
    }
  };

  const columns = [
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { 
      title: 'Chủ đề', 
      dataIndex: ['topic', 'name'], 
      key: 'topic' 
    },
    { 
      title: 'Trình độ', 
      dataIndex: ['level', 'name'], 
      key: 'level',
      render: (text: string) => text || 'N/A'
    },
    { title: 'Loại', dataIndex: 'type', key: 'type' },
    { 
      title: 'Số câu hỏi', 
      key: 'questions', 
      render: (record: ILesson) => record.questions.length 
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
      render: (_: any, record: ILesson) => (
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
        pagination={pagination}
        onChange={handleTableChange}
        loading={loading}
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
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Loại câu hỏi" rules={[{ required: true }]}>
            <Select>
              <Option value="multiple_choice">Multiple Choice</Option>
              <Option value="text_input">Text Input</Option>
            </Select>
          </Form.Item>
          <Form.Item name="maxScore" label="Điểm tối đa" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="timeLimit" label="Thời gian (giây)" rules={[{ required: true }]}>
            <Input type="number" />
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

export default LessonsPage;
