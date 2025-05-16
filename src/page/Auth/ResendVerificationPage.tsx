import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch } from "@/services/store/store";
import { resendVerification, logout } from "@/services/features/auth/authSlice";
import { Link } from "react-router-dom";

const ResendVerificationPage = () => {
    const location = useLocation();
    const initialEmail = location.state?.email || "";
    const [email, setEmail] = useState(initialEmail);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!initialEmail) {
            navigate("/login");
        }
    }, [initialEmail, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await dispatch(resendVerification({ email })).unwrap();
            setIsSuccess(result.success);
            setMessage(result.message || "Email xác thực đã được gửi lại");
            if (result.success) {
                setTimeout(() => {
                    navigate("/login");
                    dispatch(logout());
                }, 5000);
            }
        } catch (error) {
            if (error && typeof error === 'object' && 'message' in error) {
                setMessage((error as { message: string }).message);
            } else {
                setMessage("Gửi lại email xác thực thất bại");
            }
            setIsSuccess(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToLogin = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-white px-2 py-6">
            <div className="w-full max-w-md mx-auto p-4 sm:p-8 bg-white rounded-xl shadow-md space-y-6">
                <header className="flex w-full justify-between items-center mb-2">
                    <Link to="/login" onClick={handleBackToLogin}>
                        <svg
                            className="h-6 w-6 sm:h-7 sm:w-7 cursor-pointer text-gray-400 hover:text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                            stroke="currentColor"
                        >
                            <path
                                strokeWidth="1"
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                    </Link>
                </header>

                <div className="space-y-4 text-center">
                    {isSuccess ? (
                        <div className="space-y-6">
                            <svg
                                className="h-16 w-16 text-green-500 mx-auto"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 font-baloo">Email đã được gửi!</h2>
                                <p className="mt-2 text-gray-600 font-baloo text-sm sm:text-base">{message}</p>
                                <p className="mt-4 text-xs sm:text-sm text-gray-500 font-baloo">
                                    Bạn sẽ được chuyển hướng đến trang đăng nhập trong vài giây...
                                </p>
                            </div>
                            <button
                                onClick={() => navigate("/login")}
                                className="w-full rounded-2xl border-b-4 border-b-blue-600 bg-blue-500 px-6 py-2.5 text-sm sm:text-base font-bold text-white hover:bg-blue-400 active:translate-y-[0.125rem] active:border-b-blue-400 font-baloo"
                            >
                                Quay lại đăng nhập
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                            <header className="mb-2 sm:mb-3 text-xl sm:text-2xl font-bold font-baloo">
                                Xác thực tài khoản
                            </header>

                            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 font-baloo">
                                Chúng tôi đã gửi email xác thực. Vui lòng kiểm tra hộp thư đến hoặc thư rác.
                            </p>

                            {message && !isSuccess && (
                                <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm font-baloo">
                                    {message}
                                </div>
                            )}

                            <div className="w-full rounded-2xl bg-gray-100 px-3 sm:px-4 ring-2 ring-gray-200 focus-within:ring-blue-400">
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    className="my-3 w-full border-none bg-transparent outline-none focus:outline-none text-sm sm:text-base font-baloo"
                                    required
                                    disabled
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full rounded-2xl border-b-4 border-b-blue-600 bg-blue-500 py-2.5 sm:py-3 text-sm sm:text-base font-bold text-white hover:bg-blue-400 active:translate-y-[0.125rem] active:border-b-blue-400 disabled:opacity-70 disabled:cursor-not-allowed font-baloo"
                            >
                                {isLoading ? "Đang xử lý..." : "Gửi lại email xác thực"}
                            </button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={handleBackToLogin}
                                    className="text-sm font-medium text-blue-500 hover:text-blue-700 font-baloo"
                                >
                                    Quay lại đăng nhập
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </main>
    );
};

export default ResendVerificationPage;