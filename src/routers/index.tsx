import ForgotPasswordPage from "@/page/Auth/ForgotPasswordPage";
import LoginPage from "@/page/Auth/LoginPage";
import LevelPage from "@/page/Choose/LevelPage";
import SkillPage from "@/page/Choose/SkillPage";
import TopicPage from "@/page/Choose/TopicPage";
import HomePage from "@/page/Home/HomePage";
import VerifyEmailPage from "@/page/Auth/VerifyEmailPage";
import ResendVerificationPage from "@/page/Auth/ResendVerificationPage";
import ResetPasswordPage from "@/page/Auth/ResetPasswordPage";
import NotFoundPage from "@/page/Error/NotFoundPage";
import UnauthorizedPage from "@/page/Error/UnauthorizedPage";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";
import AdminLayout from "@/components/Layout/AdminLayout";
import UserLayout from "@/components/Layout/UserLayout";
import AdminDashboard from "@/page/Admin/AdminDashboard";
import { Route, Routes } from "react-router-dom";
import Process from "@/components/Process/Process";
import DonePage from "@/page/Choose/DoneChoose";

const AppRouter = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<LoginPage isRegister={true} />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            <Route path="/choose-topic" element={<Process currentStep={1} Page={<TopicPage />} />} />
            <Route path="/choose-level" element={<Process currentStep={2} Page={<LevelPage />} />} />
            <Route path="/choose-skill" element={<Process currentStep={3} Page={<SkillPage />} />} />
            <Route path="/done-page" element={<Process currentStep={4} Page={<DonePage />} />} />
            <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
            <Route path="/resend-verification" element={<ResendVerificationPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
            <Route path="/resend-verification" element={<ResendVerificationPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />


            <Route element={<UserLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/choose-level" element={<LevelPage />} />
                <Route path="/choose-topic" element={<TopicPage />} />
                <Route path="/choose-skill" element={<SkillPage />} />
                <Route path="/profile" element={<div>Profile Page</div>} />
                <Route path="/settings" element={<div>Settings Page</div>} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<div>User Management</div>} />
                    <Route path="content" element={<div>Content Management</div>} />
                    <Route path="skills" element={<div>Skills Management</div>} />
                    <Route path="topics" element={<div>Topics Management</div>} />
                </Route>
            </Route>

            {/* 404 route */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}

export default AppRouter;