
const RegisterForm = () => {
    return (
        <div className="space-y-4">
            <header className="mb-3 text-2xl font-bold">Tạo tài khoản</header>

            <div className="w-full rounded-2xl bg-gray-50 px-4 ring-2 ring-gray-200 focus-within:ring-blue-400">
                <input
                    type="text"
                    placeholder="Tên"
                    className="my-3 w-full border-none bg-transparent outline-none focus:outline-none"
                />
            </div>

            <div className="w-full rounded-2xl bg-gray-50 px-4 ring-2 ring-gray-200 focus-within:ring-blue-400">
                <input
                    type="text"
                    placeholder="Tên người dùng"
                    className="my-3 w-full border-none bg-transparent outline-none focus:outline-none"
                />
            </div>

            <div className="w-full rounded-2xl bg-gray-50 px-4 ring-2 ring-gray-200 focus-within:ring-blue-400">
                <input
                    type="text"
                    placeholder="Email"
                    className="my-3 w-full border-none bg-transparent outline-none focus:outline-none"
                />
            </div>

            <div className="w-full rounded-2xl bg-gray-50 px-4 ring-2 ring-gray-200 focus-within:ring-blue-400">
                <input
                    type="password"
                    placeholder="Mật khẩu"
                    className="my-3 w-full border-none bg-transparent outline-none focus:outline-none"
                />
            </div>

            <button className="w-full rounded-2xl border-b-4 border-b-blue-600 bg-blue-500 py-3 font-bold text-white hover:bg-blue-400 active:translate-y-[0.125rem] active:border-b-blue-400">
                Đăng ký
            </button>
        </div>
    );
};

export default RegisterForm;
