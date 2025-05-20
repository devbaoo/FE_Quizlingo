import { useState } from "react";
import { useAppDispatch } from "@/services/store/store";
import { forgotPassword } from "@/services/features/auth/authSlice";
import { Link } from "react-router-dom";

const ForgotPasswordForm = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useAppDispatch();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await dispatch(forgotPassword({ email })).unwrap();
            if (result.success) {
                // setTimeout(() => {
                //     navigate("/login");
                // }, 3000);
                console.log("Email đã được gửi thành công!");

            }
        } catch {
            // error
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <header className="mb-2 sm:mb-3 text-xl sm:text-2xl font-bold font-baloo">Quên mật khẩu</header>

            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 font-baloo">
                Nhập email của bạn và chúng tôi sẽ gửi cho bạn hướng dẫn để đặt lại mật khẩu.
            </p>

            <div className="w-full rounded-2xl bg-gray-50 px-3 sm:px-4 ring-2 ring-gray-200 focus-within:ring-blue-400">
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="my-3 w-full border-none bg-transparent outline-none focus:outline-none text-sm sm:text-base font-baloo"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-2xl border-b-4 border-b-blue-600 bg-blue-500 py-2.5 sm:py-3 text-sm sm:text-base font-bold text-white hover:bg-blue-400 active:translate-y-[0.125rem] active:border-b-blue-400 disabled:opacity-70 disabled:cursor-not-allowed font-baloo"
            >
                {isLoading ? "Đang xử lý..." : "Gửi yêu cầu"}
            </button>

            <div className="text-center">
                <Link
                    to="/login"
                    className="text-sm font-medium text-blue-500 hover:text-blue-700 font-baloo"
                >
                    Quay lại đăng nhập
                </Link>
            </div>
        </form>
    );
};

export default ForgotPasswordForm; 