import ForgotPasswordPage from "@/page/Auth/ForgotPasswordPage";
import LoginPage from "@/page/Auth/LoginPage";
import LevelPage from "@/page/Choose/LevelPage";
import SkillPage from "@/page/Choose/SkillPage";
import TopicPage from "@/page/Choose/TopicPage";
import HomePage from "@/page/Home/HomePage";
import VerifyEmailPage from "@/page/Auth/VerifyEmailPage";
import ResendVerificationPage from "@/page/Auth/ResendVerificationPage";
import { Route, Routes } from "react-router-dom";


const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<LoginPage isRegister={true} />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/choose-level" element={<LevelPage />} />
            <Route path="/choose-topic" element={<TopicPage />} />
            <Route path="/choose-skill" element={<SkillPage />} />
            <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
            <Route path="/resend-verification" element={<ResendVerificationPage />} />

        </Routes>
    );
}

export default AppRouter;