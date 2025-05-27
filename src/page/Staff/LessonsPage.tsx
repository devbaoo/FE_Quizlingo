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
  InputNumber,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/services/store/store';
import { fetchLessons, createLesson, updateLesson, deleteLesson } from '@/services/features/lesson/lessonSlice';
import { fetchTopics } from '@/services/features/topic/topicSlice';
import { fetchLevels } from '@/services/features/level/levelSlice';
import { fetchSkills } from '@/services/features/skill/skillSlice';
import { ILesson } from '@/interfaces/ILesson';

const LessonsPage = () => {
  const dispatch = useAppDispatch();
  const { lessons, loading, error } = useAppSelector((state) => state.lesson);
  const { topics } = useAppSelector((state) => state.topic);
  const { levels } = useAppSelector((state) => state.level);
  const { skills } = useAppSelector((state) => state.skill);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingLesson, setEditingLesson] = useState<ILesson | null>(null);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchLessons({ page: currentPage, limit: 10 }));
    dispatch(fetchTopics());
    dispatch(fetchLevels());
    dispatch(fetchSkills());
  }, [dispatch, currentPage]);

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteLesson(id)).unwrap();
      message.success('Xóa bài học thành công');
    } catch (error) {
      message.error('Xóa bài học thất bại');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      // Validate required fields
      if (!values.topic || !values.level || !values.skills || values.skills.length === 0) {
        message.error('Vui lòng điền đầy đủ thông tin chủ đề, cấp độ và kỹ năng');
        return;
      }

      // Prepare the data structure with only IDs
      const lessonData = {
        title: values.title,
        type: values.type || 'multiple_choice',
        topic: values.topic, // This is already the ID from Select
        level: values.level, // This is already the ID from Select
        skills: values.skills, // This is already an array of IDs from Select
        maxScore: Number(values.maxScore) || 0,
        timeLimit: Number(values.timeLimit) || 0,
        questions: values.questions?.map((q: any) => ({
          content: q.content,
          type: values.type || 'multiple_choice',
          options: Array.isArray(q.options) ? q.options : [],
          correctAnswer: q.correctAnswer,
          score: Number(q.score) || 0
        })) || []
      };

      // Log the data being sent
      console.log('Sending lesson data:', lessonData);

      if (editingLesson) {
        await dispatch(updateLesson({ 
          id: editingLesson._id, 
          data: lessonData 
        })).unwrap();
        message.success('Cập nhật bài học thành công');
      } else {
        await dispatch(createLesson(lessonData)).unwrap();
        message.success('Thêm bài học thành công');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      setEditingLesson(null);
    } catch (error: any) {
      console.error('Error submitting lesson:', error);
      message.error(error.message || (editingLesson ? 'Cập nhật bài học thất bại' : 'Thêm bài học thất bại'));
    }
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => type === 'multiple_choice' ? 'Trắc nghiệm' : 'Nhập text',
    },
    {
      title: 'Chủ đề',
      dataIndex: ['topic', 'name'],
      key: 'topic',
    },
    {
      title: 'Cấp độ',
      dataIndex: ['level', 'name'],
      key: 'level',
    },
    {
      title: 'Kỹ năng',
      dataIndex: 'skills',
      key: 'skills',
      render: (skills: any[]) => skills.map(skill => skill.name).join(', '),
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
              // Ensure we're setting the correct data structure for the form
              const formData = {
                title: record.title,
                type: record.type,
                topic: record.topic?._id,
                level: record.level?._id,
                skills: record.skills?.map(skill => skill._id) || [],
                maxScore: record.maxScore,
                timeLimit: record.timeLimit,
                questions: record.questions?.map(q => ({
                  content: q.content,
                  options: q.options || [],
                  correctAnswer: q.correctAnswer,
                  score: q.score || 0
                })) || []
              };
              form.setFieldsValue(formData);
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
        <h1 style={{ fontSize: 24, fontWeight: 'bold' }}>Quản lý Bài học</h1>
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
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: 10,
          total: lessons.length,
          onChange: (page) => setCurrentPage(page),
        }}
      />

      <Modal
        title={editingLesson ? 'Cập nhật bài học' : 'Thêm bài học'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={800}
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
            name="type"
            label="Loại bài học"
            rules={[{ required: true, message: 'Vui lòng chọn loại bài học!' }]}
          >
            <Select>
              <Select.Option value="multiple_choice">Multiple Choice</Select.Option>
              <Select.Option value="text_input">Text Input</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="topic"
            label="Chủ đề"
            rules={[{ required: true, message: 'Vui lòng chọn chủ đề!' }]}
          >
            <Select>
              {topics.map((topic) => (
                <Select.Option key={topic._id} value={topic._id}>
                  {topic.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="level"
            label="Cấp độ"
            rules={[{ required: true, message: 'Vui lòng chọn cấp độ!' }]}
          >
            <Select>
              {levels.map((level) => (
                <Select.Option key={level._id} value={level._id}>
                  {level.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="skills"
            label="Kỹ năng"
            rules={[{ required: true, message: 'Vui lòng chọn kỹ năng!' }]}
          >
            <Select mode="multiple" placeholder="Chọn kỹ năng">
              {skills.map((skill) => (
                <Select.Option key={skill._id} value={skill._id}>
                  {skill.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="maxScore"
            label="Điểm tối đa"
            rules={[{ required: true, message: 'Vui lòng nhập điểm tối đa!' }]}
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item
            name="timeLimit"
            label="Thời gian (giây)"
            rules={[{ required: true, message: 'Vui lòng nhập thời gian!' }]}
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.List name="questions">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} style={{ marginBottom: 16, padding: 16, border: '1px solid #d9d9d9', borderRadius: 4 }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Form.Item
                        {...restField}
                        name={[name, 'content']}
                        label="Câu hỏi"
                        rules={[{ required: true, message: 'Vui lòng nhập câu hỏi!' }]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.List name={[name, 'options']}>
                        {(optionFields, { add: addOption, remove: removeOption }) => (
                          <>
                            {optionFields.map(({ key: optionKey, name: optionName, ...restOptionField }) => (
                              <Form.Item
                                {...restOptionField}
                                name={[optionName]}
                                label={`Lựa chọn ${optionName + 1}`}
                                rules={[{ required: true, message: 'Vui lòng nhập lựa chọn!' }]}
                              >
                                <Input />
                              </Form.Item>
                            ))}
                            <Button type="dashed" onClick={() => addOption()} block>
                              Thêm lựa chọn
                            </Button>
                          </>
                        )}
                      </Form.List>

                      <Form.Item
                        {...restField}
                        name={[name, 'correctAnswer']}
                        label="Đáp án đúng"
                        rules={[{ required: true, message: 'Vui lòng nhập đáp án đúng!' }]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'score']}
                        label="Điểm"
                        rules={[{ required: true, message: 'Vui lòng nhập điểm!' }]}
                      >
                        <InputNumber min={0} />
                      </Form.Item>

                      <Button type="link" danger onClick={() => remove(name)}>
                        Xóa câu hỏi
                      </Button>
                    </Space>
                  </div>
                ))}
                <Button type="dashed" onClick={() => add()} block>
                  Thêm câu hỏi
                </Button>
              </>
            )}
          </Form.List>

          <Form.Item style={{ textAlign: 'right', marginTop: 16 }}>
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
