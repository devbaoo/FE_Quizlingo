import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/services/store/store";
import { registerUser } from "@/services/features/auth/authSlice";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await dispatch(registerUser(formData)).unwrap();
            if (result.success) {
                navigate("/home");
            }
        } catch {
            //error
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <header className="mb-3 text-2xl font-bold font-baloo">Tạo tài khoản</header>

            <div className="w-full rounded-2xl bg-gray-50 px-4 ring-2 ring-gray-200 focus-within:ring-blue-400">
                <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="my-3 w-full border-none bg-transparent outline-none focus:outline-none font-baloo"
                    required
                />
            </div>

            <div className="w-full rounded-2xl bg-gray-50 px-4 ring-2 ring-gray-200 focus-within:ring-blue-400">
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="my-3 w-full border-none bg-transparent outline-none focus:outline-none font-baloo"
                    required
                />
            </div>

            <div className="w-full rounded-2xl bg-gray-50 px-4 ring-2 ring-gray-200 focus-within:ring-blue-400">
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="my-3 w-full border-none bg-transparent outline-none focus:outline-none font-baloo"
                    required
                />
            </div>

            <div className="w-full rounded-2xl bg-gray-50 px-4 ring-2 ring-gray-200 focus-within:ring-blue-400 flex items-center">
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mật khẩu"
                    className="my-3 w-full border-none bg-transparent outline-none focus:outline-none font-baloo"
                    required
                />
                <div
                    onClick={togglePasswordVisibility}
                    className="cursor-pointer text-gray-500 hover:text-gray-700"
                >
                    {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-2xl border-b-4 border-b-blue-600 bg-blue-500 py-3 font-bold text-white hover:bg-blue-400 active:translate-y-[0.125rem] active:border-b-blue-400 disabled:opacity-70 disabled:cursor-not-allowed font-baloo"
            >
                {isLoading ? "Đang xử lý..." : "Đăng ký"}
            </button>
        </form>
    );
};

export default RegisterForm;
