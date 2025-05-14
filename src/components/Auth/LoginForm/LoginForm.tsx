
const LoginForm = () => {
    return (
        <div className="space-y-4">
            <header className="mb-3 text-2xl font-bold">Đăng nhập</header>

            <div className="w-full rounded-2xl bg-gray-50 px-4 ring-2 ring-gray-200 focus-within:ring-blue-400">
                <input
                    type="text"
                    placeholder="Email hoặc tên người dùng"
                    className="my-3 w-full border-none bg-transparent outline-none focus:outline-none"
                />
            </div>

            <div className="flex w-full items-center space-x-2 rounded-2xl bg-gray-50 px-4 ring-2 ring-gray-200 focus-within:ring-blue-400">
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    className="my-3 w-full border-none bg-transparent outline-none"
                />
                <a href="#" className="font-medium text-gray-400 hover:text-gray-500">
                    Quên mật khẩu?
                </a>
            </div>

            <button className="w-full rounded-2xl border-b-4 border-b-blue-600 bg-blue-500 py-3 font-bold text-white hover:bg-blue-400 active:translate-y-[0.125rem] active:border-b-blue-400">
                Đăng nhập
            </button>
        </div>
    );
};

export default LoginForm;
