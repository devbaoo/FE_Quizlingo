import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
            <img
                src="https://media.giphy.com/media/3oxHQDK3VfMIYeWYx2/giphy.gif"
                alt="Unauthorized"
                className="w-48 h-48 mb-6"
            />
            <h1 className="text-3xl font-bold text-blue-500 mb-4 text-center font-baloo">
                Không Có Quyền Truy Cập!
            </h1>
            <p className="text-gray-600 mb-8 text-center max-w-md font-baloo">
                Bạn không có quyền truy cập vào trang này. Vui lòng quay lại trang chủ hoặc liên hệ với quản trị viên.
            </p>
            <Link to="/">
                <button className="rounded-2xl border-b-2 border-b-blue-300 bg-blue-500 px-6 py-3 font-bold text-white ring-2 ring-blue-300 hover:bg-blue-400 active:translate-y-[0.125rem] active:border-b-blue-200 font-baloo">
                    Về Trang Chủ
                </button>
            </Link>
        </div>
    );
};

export default UnauthorizedPage; 