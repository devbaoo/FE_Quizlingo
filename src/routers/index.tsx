

import LoginPage from "@/page/Auth/LoginPage";
import HomePage from "@/page/Home/HomePage";
import { Route, Routes } from "react-router-dom";


const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
        </Routes>
    );
}

export default AppRouter;