import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import { completeLesson, retryLesson } from "@/services/features/lesson/lessonSlice";
import { CheckmarkSvg, StarSvg, CloseSvg } from "@/components/ui/Svgs";
import { Modal } from 'antd';
import { fetchUserProfile } from "@/services/features/user/userSlice";

interface LocationState {
    lessonId: string;
    score: number;
    questionResults: {
        questionId: string;
        answer: string;
        isCorrect: boolean;
        isTimeout: boolean;
    }[];
    isRetried: boolean;
}

const LessonSubmitPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { profile: userProfile } = useAppSelector((state) => state.user);
    const [showConfetti, setShowConfetti] = useState(false);

    const state = location.state as LocationState;

    useEffect(() => {
        if (!state) {
            navigate("/learn");
            return;
        }

        const submitLesson = async () => {
            try {
                const result = await dispatch(completeLesson({
                    lessonId: state.lessonId,
                    score: state.score,
                    questionResults: state.questionResults,
                    isRetried: state.isRetried,
                })).unwrap();

                if (result.status !== "COMPLETE") {
                    setShowConfetti(true);
                }
                dispatch(fetchUserProfile());
            } catch (error: unknown) {
                console.error("Failed to submit lesson:", error);
            }
        };

        submitLesson();
    }, [dispatch, state, navigate]);

    const handleExit = () => {
        Modal.confirm({
            title: <span className="font-baloo text-xl">Exit Lesson</span>,
            content: <span className="font-baloo text-lg">Your progress will be lost.</span>,
            okText: <span className="font-baloo">Yes, exit</span>,
            cancelText: <span className="font-baloo">Cancel</span>,
            centered: true,
            onOk: () => navigate("/learn"),
        });
    };

    const handleRetry = async () => {
        if (userProfile?.lives === 0) {
            Modal.info({
                title: <span className="font-baloo text-xl">Out of Lives</span>,
                content: <span className="font-baloo text-lg">Hiện tại số tim của bạn là 0, bạn không thể làm lại bài này. Hãy chờ hoặc mua thêm tim để tiếp tục!</span>,
                centered: true,
                okText: <span className="font-baloo">OK</span>,
            });
            return;
        }
        Modal.confirm({
            title: <span className="font-baloo text-xl">Try this lesson again?</span>,
            content: <span className="font-baloo text-lg">Your previous result will be reset.</span>,
            okText: <span className="font-baloo">Yes, try again</span>,
            cancelText: <span className="font-baloo">Cancel</span>,
            centered: true,
            onOk: async () => {
                if (!user?.id || !state?.lessonId) return;
                try {
                    await dispatch(retryLesson({
                        lessonId: state.lessonId,
                    })).unwrap();
                    dispatch(fetchUserProfile());
                    navigate(`/lesson/${state.lessonId}`);
                } catch (error) {
                    console.error("Failed to retry lesson:", error);
                }
            },
        });
    };

    const correctAnswers = state?.questionResults.filter(result => result.isCorrect).length || 0;
    const totalQuestions = state?.questionResults.length || 0;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    if (!state) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-2 sm:px-4 font-baloo">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-8 mb-4 sm:mb-8">
                    {showConfetti && (
                        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                            {/* Add confetti animation here if desired */}
                        </div>
                    )}

                    <div className="text-center mb-6 sm:mb-8">
                        <h1 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4 font-baloo">Lesson Complete!</h1>
                        <div className="flex justify-center mb-4 sm:mb-6">
                            <div className="relative">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-2xl sm:text-4xl font-bold text-blue-500 font-baloo">{percentage}%</span>
                                </div>
                                <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4">
                                    <StarSvg />
                                </div>
                            </div>
                        </div>
                        <p className="text-lg sm:text-xl text-gray-600 font-baloo">
                            You scored {state.score} points!
                        </p>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div className="bg-green-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                                <h3 className="font-semibold text-green-700 mb-1 sm:mb-2 text-sm sm:text-base font-baloo">Correct Answers</h3>
                                <p className="text-xl sm:text-2xl font-bold text-green-600 font-baloo">{correctAnswers}</p>
                            </div>
                            <div className="bg-red-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                                <h3 className="font-semibold text-red-700 mb-1 sm:mb-2 text-sm sm:text-base font-baloo">Incorrect Answers</h3>
                                <p className="text-xl sm:text-2xl font-bold text-red-600 font-baloo">{totalQuestions - correctAnswers}</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 sm:p-6 rounded-lg sm:rounded-xl">
                            <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base font-baloo">Question Results</h3>
                            <div className="space-y-3 sm:space-y-4">
                                {state.questionResults.map((result, index) => (
                                    <div
                                        key={result.questionId}
                                        className="flex items-center justify-between p-3 sm:p-4 bg-white rounded-lg text-sm sm:text-base"
                                    >
                                        <span className="font-medium font-baloo">Question {index + 1}</span>
                                        <div className="flex items-center gap-2">
                                            {result.isCorrect ? (
                                                <div className="w-7 h-7 flex items-center justify-center">
                                                    <CheckmarkSvg />
                                                </div>
                                            ) : (
                                                <div className="w-7 h-7 flex items-center justify-center text-red-500">
                                                    <CloseSvg />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 sm:mt-8 flex justify-center gap-3 sm:gap-4">
                        <button
                            onClick={handleExit}
                            className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 rounded-lg sm:rounded-xl hover:bg-gray-300 transition-colors text-sm sm:text-base font-baloo"
                        >
                            Exit Lesson
                        </button>
                        <button
                            onClick={handleRetry}
                            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base font-baloo ${userProfile?.lives === 0 ? 'bg-gray-300 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                            disabled={userProfile?.lives === 0}
                        >
                            {userProfile?.lives === 0 ? 'Try Again (Lives: 0)' : 'Try Again'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LessonSubmitPage; 