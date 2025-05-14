import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "@/services/store/store";
import { loginUser } from "@/services/features/auth/authSlice";

const LoginForm = () => {
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await dispatch(loginUser(credentials)).unwrap();
            if (result.success) {
                navigate("/home");
            }
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <header className="mb-3 text-2xl font-bold font-baloo">Đăng nhập</header>

            <div className="w-full rounded-2xl bg-gray-50 px-4 ring-2 ring-gray-200 focus-within:ring-blue-400">
                <input
                    type="text"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    placeholder="Email hoặc tên người dùng"
                    className="my-3 w-full border-none bg-transparent outline-none focus:outline-none font-baloo"
                    required
                />
            </div>

            <div className="flex w-full items-center space-x-2 rounded-2xl bg-gray-50 px-4 ring-2 ring-gray-200 focus-within:ring-blue-400">
                <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Mật khẩu"
                    className="my-3 w-full border-none bg-transparent outline-none font-baloo"
                    required
                />
                <Link to="/forgot-password" className="font-medium text-gray-400 hover:text-gray-500 font-baloo">
                    Quên mật khẩu?
                </Link>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-2xl border-b-4 border-b-blue-600 bg-blue-500 py-3 font-bold text-white hover:bg-blue-400 active:translate-y-[0.125rem] active:border-b-blue-400 disabled:opacity-70 disabled:cursor-not-allowed font-baloo"
            >
                {isLoading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
        </form>
    );
};

export default LoginForm;
