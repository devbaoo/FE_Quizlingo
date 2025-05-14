import LoginForm from "@/components/Auth/LoginForm/LoginForm";
import RegisterForm from "@/components/Auth/RegisterForm/RegisterForm";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

interface LoginPageProps {
    isRegister?: boolean;
}

const LoginPage = ({ isRegister = false }: LoginPageProps) => {
    const [isLoginPage, setIsLoginPage] = useState(!isRegister);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoginPage(!isRegister);
    }, [isRegister]);

    const handleLoginClick = () => {
        navigate("/login");
    };

    const handleRegisterClick = () => {
        navigate("/register");
    };

    return (
        <main className="relative min-h-screen w-full bg-white">
            <div className="p-6">
                <header className="flex w-full justify-between">
                    <Link to="/home">
                        <svg
                            className="h-7 w-7 cursor-pointer text-gray-400 hover:text-gray-300"
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
                    <div>
                        {isLoginPage ? (
                            <button
                                onClick={handleRegisterClick}
                                className="rounded-2xl border-b-2 border-b-gray-300 bg-white px-4 py-3 font-bold text-blue-500 ring-2 ring-gray-300 hover:bg-gray-200 active:translate-y-[0.125rem] active:border-b-gray-200 font-baloo"
                            >
                                Đăng Ký
                            </button>
                        ) : (
                            <button
                                onClick={handleLoginClick}
                                className="rounded-2xl border-b-2 border-b-gray-300 bg-white px-4 py-3 font-bold text-blue-500 ring-2 ring-gray-300 hover:bg-gray-200 active:translate-y-[0.125rem] active:border-b-gray-200 font-baloo"
                            >
                                Đăng Nhập
                            </button>
                        )}
                    </div>
                </header>

                <div className="absolute left-1/2 top-1/2 mx-auto max-w-sm -translate-x-1/2 -translate-y-1/2 transform space-y-4 text-center">
                    {isLoginPage ? <LoginForm /> : <RegisterForm />}

                    <div className="flex items-center space-x-4">
                        <hr className="w-full border border-gray-300" />
                        <div className="font-semibold text-gray-400">OR</div>
                        <hr className="w-full border border-gray-300" />
                    </div>

                    <footer>
                        <div className="grid grid-cols-2 gap-4">
                            <a
                                href="#"
                                className="rounded-2xl border-b-2 border-b-gray-300 bg-white px-4 py-2.5 font-bold text-blue-700 ring-2 ring-gray-300 hover:bg-gray-200 active:translate-y-[0.125rem] active:border-b-gray-200 font-baloo"
                            >
                                FACEBOOK
                            </a>
                            <a
                                href="#"
                                className="rounded-2xl border-b-2 border-b-gray-300 bg-white px-4 py-2.5 font-bold text-blue-500 ring-2 ring-gray-300 hover:bg-gray-200 active:translate-y-[0.125rem] active:border-b-gray-200 font-baloo"
                            >
                                GOOGLE
                            </a>
                        </div>

                        <div className="mt-8 text-sm text-gray-400 font-baloo">
                            By signing in to Quizlingo, you agree to our{" "}
                            <a href="#" className="font-medium text-gray-500 ">
                                Terms
                            </a>{" "}
                            and{" "}
                            <a href="#" className="font-medium text-gray-500">
                                Privacy Policy
                            </a>

                        </div>
                    </footer>
                </div>
            </div>
        </main>
    );
};

export default LoginPage;
