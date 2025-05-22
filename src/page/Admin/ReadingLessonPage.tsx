import { useState } from 'react';
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

const { Option } = Select;

interface Question {
  content: string;
  options: string[];
  correctAnswer: string;
  score: number;
}


interface Lesson {
  _id: string;
  title: string;
  type: 'multiple_choice' | 'text_input';
  topic: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  skill: 'reading';
  questions: Question[];
  createdAt: string;
}

const initialLessons: Lesson[] = [
  {
    _id: '1',
    title: 'L Khoa',
    type: 'multiple_choice',
    topic: 'education',
    level: 'intermediate',
    skill: 'reading',
    questions: [
      {
        content: 'Đây là câu hỏi được cập nhật?',
        options: ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D'],
        correctAnswer: 'Đáp án A',
        score: 150,
      },
    ],
    createdAt: new Date().toISOString(),
  },
];

const ReadingLessonPage = () => {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [form] = Form.useForm();

  const handleDelete = (id: string) => {
    setLessons(lessons.filter((lesson) => lesson._id !== id));
    message.success('Xóa bài học thành công');
  };

  const handleSubmit = (values: Partial<Lesson>) => {
    const newLesson: Lesson = {
      _id: editingLesson?._id || Math.random().toString(36).substring(2, 9),
      title: values.title!,
      type: values.type as 'multiple_choice' | 'text_input',
      topic: values.topic!,
      level: values.level as 'beginner' | 'intermediate' | 'advanced',
      skill: 'reading',
      questions: [
        {
          content: 'Câu hỏi mẫu',
          options: ['A', 'B', 'C', 'D'],
          correctAnswer: 'A',
          score: 100,
        },
      ],
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
  };

  const columns = [
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { title: 'Chủ đề', dataIndex: 'topic', key: 'topic' },
    { title: 'Trình độ', dataIndex: 'level', key: 'level' },
    { title: 'Loại', dataIndex: 'type', key: 'type' },
    { title: 'Số câu hỏi', key: 'questions', render: (record: Lesson) => record.questions.length },
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

      <Table columns={columns} dataSource={lessons} rowKey="_id" pagination={{ pageSize: 5 }} />

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
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}> <Input /> </Form.Item>
          <Form.Item name="type" label="Loại câu hỏi" rules={[{ required: true }]}> <Select>
            <Option value="multiple_choice">Multiple Choice</Option>
            <Option value="text_input">Text Input</Option>
          </Select> </Form.Item>
          <Form.Item name="topic" label="Chủ đề" rules={[{ required: true }]}> <Input placeholder="education" /> </Form.Item>
          <Form.Item name="level" label="Trình độ" rules={[{ required: true }]}> <Select>
            <Option value="beginner">Beginner</Option>
            <Option value="intermediate">Intermediate</Option>
            <Option value="advanced">Advanced</Option>
          </Select> </Form.Item>
          <Form.Item name="skill" label="Kỹ năng" initialValue="reading" hidden>
            <Input />
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
