import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import { LessonTopBarHeart, LessonTopBarEmptyHeart } from "@/components/ui/Svgs";
import confetti from "canvas-confetti";
import { fetchLessonById, completeLesson, retryLesson, clearCurrentLesson } from "@/services/features/lesson/lessonSlice";
import { updateUserProfileFromLesson } from "@/services/features/user/userSlice";

interface QuestionResult {
    questionId: string;
    answer: string;
    isCorrect: boolean;
    isTimeout: boolean;
}

const LessonPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { currentLesson, loading, error, userProgress } = useAppSelector((state) => state.lesson);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [timeLeft, setTimeLeft] = useState(45);
    const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [showRetryModal, setShowRetryModal] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(fetchLessonById(id));
        }
        return () => {
            dispatch(clearCurrentLesson());
        };
    }, [dispatch, id]);

    useEffect(() => {
        if (currentLesson) {
            setTimeLeft(currentLesson.timeLimit);
        }
    }, [currentLesson]);

    useEffect(() => {
        if (timeLeft > 0 && !isSubmitting && !isCompleted) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && !isSubmitting && !isCompleted) {
            handleTimeout();
        }
    }, [timeLeft, isSubmitting, isCompleted]);

    const handleTimeout = () => {
        const currentQuestion = currentLesson?.questions[currentQuestionIndex];
        if (currentQuestion) {
            handleAnswer(currentQuestion.correctAnswer, false, true);
        }
    };

    const handleAnswer = (answer: string, correct: boolean, timeout: boolean = false) => {
        setIsSubmitting(true);
        setIsCorrect(correct);
        setShowFeedback(true);

        const currentQuestion = currentLesson?.questions[currentQuestionIndex];
        if (currentQuestion) {
            setQuestionResults(prevResults => [
                ...prevResults,
                {
                    questionId: currentQuestion._id,
                    answer: answer || currentQuestion.correctAnswer,
                    isCorrect: correct,
                    isTimeout: timeout,
                },
            ]);

            if (correct) {
                setScore((prev) => prev + currentQuestion.score);
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                });
            } else {
                setLives((prev) => prev - 1);
            }
        }

        setTimeout(() => {
            setShowFeedback(false);
            setIsSubmitting(false);
            if (currentQuestionIndex < (currentLesson?.questions.length || 0) - 1) {
                setCurrentQuestionIndex((prev) => prev + 1);
                setSelectedAnswer(null);
                setTimeLeft(currentLesson?.timeLimit || 45);
            }
        }, 1500);
    };

    const handleComplete = async () => {
        if (id) {
            try {
                const submissionData = {
                    lessonId: id,
                    score,
                    questionResults: questionResults.map(result => ({
                        questionId: result.questionId,
                        answer: result.answer,
                        isCorrect: result.isCorrect,
                        isTimeout: result.isTimeout
                    })),
                    isRetried: false
                };

                const result = await dispatch(completeLesson(submissionData)).unwrap();
                
                // Also update the user profile state directly
                if (result.user) {
                    dispatch(updateUserProfileFromLesson(result.user));
                }
                
                setIsCompleted(true);
                setShowRetryModal(true);
                
                // Dispatch custom event to notify header to refresh user data
                window.dispatchEvent(new Event('lessonComplete'));
            } catch (error) {
                console.error("Error completing lesson:", error);
            }
        }
    };

    const handleRetry = async () => {
        if (id) {
            try {
                await dispatch(retryLesson({ lessonId: id })).unwrap();
                // Reset all states
                setCurrentQuestionIndex(0);
                setSelectedAnswer(null);
                setScore(0);
                setLives(3);
                setTimeLeft(currentLesson?.timeLimit || 45);
                setQuestionResults([]);
                setIsSubmitting(false);
                setShowFeedback(false);
                setIsCorrect(false);
                setIsCompleted(false);
                setShowRetryModal(false);
                
                // Dispatch custom event to notify header to refresh user data
                window.dispatchEvent(new Event('lessonComplete'));
            } catch (error) {
                console.error("Error retrying lesson:", error);
            }
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

    if (!currentLesson) {
        return <div className="flex justify-center items-center h-screen">Lesson not found</div>;
    }

    const currentQuestion = currentLesson.questions[currentQuestionIndex];

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            {/* Top Bar */}
            <div className="bg-white shadow-md p-4 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <div className="flex">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="w-8 h-8">
                                    {i < lives ? <LessonTopBarHeart /> : <LessonTopBarEmptyHeart />}
                                </div>
                            ))}
                        </div>
                        <div className="text-2xl font-bold text-blue-600">{score}</div>
                    </div>
                    <div className="text-xl font-bold text-gray-700">
                        Time: {timeLeft}s
                    </div>
                </div>
            </div>

            {/* Question Content */}
            <div className="max-w-4xl mx-auto mt-8 p-6">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    {questionResults.length < currentLesson.questions.length ? (
                        <>
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                    Question {currentQuestionIndex + 1} of {currentLesson.questions.length}
                                </h2>
                                <p className="text-xl text-gray-700">{currentQuestion.content}</p>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {currentQuestion.options.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            if (!isSubmitting) {
                                                setSelectedAnswer(option);
                                                handleAnswer(
                                                    option,
                                                    option === currentQuestion.correctAnswer
                                                );
                                            }
                                        }}
                                        disabled={isSubmitting}
                                        className={`p-4 rounded-lg text-lg font-medium transition-all transform hover:scale-105 ${selectedAnswer === option
                                            ? isCorrect
                                                ? "bg-green-500 text-white"
                                                : "bg-red-500 text-white"
                                            : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                            }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>

                            {showFeedback && (
                                <div
                                    className={`mt-6 p-4 rounded-lg text-center text-xl font-bold ${isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                        }`}
                                >
                                    {isCorrect ? "Correct! 🎉" : "Try again! 💪"}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center min-h-[200px]">
                            <div className="text-2xl font-bold text-gray-700 mb-4">Bạn đã hoàn thành tất cả câu hỏi!</div>
                            <button
                                onClick={handleComplete}
                                className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-600 transition-colors"
                            >
                                Nộp bài
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Retry Modal */}
            {showRetryModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
                        <h2 className="text-2xl font-bold text-center mb-4">Lesson Completed! 🎉</h2>
                        <p className="text-center text-gray-600 mb-6">
                            Your score: {score} points
                        </p>
                        {userProgress && (
                            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                                <p className="text-center text-blue-800">
                                    You earned {userProgress.xp} XP! 🎯
                                </p>
                            </div>
                        )}
                        <div className="flex flex-col gap-4">
                            <button
                                onClick={handleRetry}
                                className="bg-blue-500 text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => navigate("/learn")}
                                className="bg-gray-200 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                            >
                                Back to Lessons
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LessonPage; 