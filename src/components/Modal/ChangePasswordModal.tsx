import { Modal, Form, Input, message } from 'antd';
import { useAppDispatch } from '@/services/store/store';
import { updateProfile } from '@/services/features/user/userSlice';

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const ChangePasswordModal = ({ isOpen, onClose, onSuccess }: ChangePasswordModalProps) => {
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (values.password !== values.confirmPassword) {
                message.error('Mật khẩu xác nhận không khớp');
                return;
            }

            await dispatch(updateProfile({ password: values.password })).unwrap();
            message.success('Đổi mật khẩu thành công');
            form.resetFields();
            onClose();
            if (onSuccess) onSuccess();
        } catch {
            message.error('Đổi mật khẩu thất bại');
        }
    };

    return (
        <Modal
            title="Đổi mật khẩu"
            open={isOpen}
            onCancel={onClose}
            onOk={handleSubmit}
            okText="Xác nhận"
            cancelText="Hủy"
        >
            <Form
                form={form}
                layout="vertical"
                className="mt-4"
            >
                <Form.Item
                    name="password"
                    label="Mật khẩu mới"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                        { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                    ]}
                >
                    <Input.Password placeholder="Nhập mật khẩu mới" />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    label="Xác nhận mật khẩu"
                    rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="Nhập lại mật khẩu mới" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ChangePasswordModal; 