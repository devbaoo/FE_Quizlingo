import ForgotPasswordPage from "@/page/Auth/ForgotPasswordPage";
import LoginPage from "@/page/Auth/LoginPage";
import LevelPage from "@/page/Choose/LevelPage";
import SkillPage from "@/page/Choose/SkillPage";
import TopicPage from "@/page/Choose/TopicPage";
import HomePage from "@/page/Home/HomePage";
import { Route, Routes } from "react-router-dom";
import Process from "@/components/Process/Process";
import DonePage from "@/page/Choose/DoneChoose";


const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<LoginPage isRegister={true} />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
<<<<<<< HEAD
            <Route path="/choose-level" element={<LevelPage />} />
            <Route path="/choose-topic" element={<TopicPage />} />
            <Route path="/choose-skill" element={<SkillPage />} />
=======
            <Route path="/choose-topic" element={<Process currentStep={1} Page={<TopicPage />} />} />
            <Route path="/choose-level" element={<Process currentStep={2} Page={<LevelPage />} />} />
            <Route path="/choose-skill" element={<Process currentStep={3} Page={<SkillPage />} />} />
            <Route path="/done-page" element={<Process currentStep={4} Page={<DonePage />} />} />
            <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
            <Route path="/resend-verification" element={<ResendVerificationPage />} />
>>>>>>> 3b44d7c (Choose  form)
        </Routes>
    );
}

export default AppRouter;