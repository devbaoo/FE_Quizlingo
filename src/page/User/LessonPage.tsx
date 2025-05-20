import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import { fetchLessonById } from "@/services/features/lesson/lessonSlice";
import { Modal } from 'antd';
import NotFoundPage from "@/page/Error/NotFoundPage";


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
    const { currentLesson, loading, error } = useAppSelector((state) => state.lesson);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string>("");
    const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [score, setScore] = useState<number>(0);

    useEffect(() => {
        if (id) {
            dispatch(fetchLessonById(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (currentLesson) {
            setTimeLeft(currentLesson.timeLimit);
        }
    }, [currentLesson]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else {
            handleTimeout();
        }
    }, [timeLeft]);

    // Handle F5 refresh
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    useEffect(() => {
        // Reset all state when lessonId changes (retry)
        setCurrentQuestionIndex(0);
        setSelectedAnswer("");
        setQuestionResults([]);
        setScore(0);
    }, [id]);

    const handleTimeout = () => {
        if (currentLesson && currentQuestionIndex < currentLesson.questions.length) {
            const currentQuestion = currentLesson.questions[currentQuestionIndex];
            const result: QuestionResult = {
                questionId: currentQuestion._id,
                answer: "",
                isCorrect: false,
                isTimeout: true,
            };
            setQuestionResults([...questionResults, result]);
            handleNextQuestion();
        }
    };

    const handleAnswerSelect = (answer: string) => {
        setSelectedAnswer(answer);
    };

    const handleNextQuestion = () => {
        if (currentLesson && currentQuestionIndex < currentLesson.questions.length) {
            const currentQuestion = currentLesson.questions[currentQuestionIndex];
            const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

            const result: QuestionResult = {
                questionId: currentQuestion._id,
                answer: selectedAnswer,
                isCorrect,
                isTimeout: false,
            };

            if (isCorrect) {
                setScore(score + currentQuestion.score);
            }

            setQuestionResults([...questionResults, result]);
            setSelectedAnswer("");
            setTimeLeft(currentLesson.timeLimit);

            if (currentQuestionIndex + 1 < currentLesson.questions.length) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                navigate("/lesson/submit", {
                    state: {
                        lessonId: currentLesson._id,
                        score,
                        questionResults: [...questionResults, result],
                        isRetried: false,
                    },
                });
            }
        }
    };

    const handleExit = () => {
        Modal.confirm({
            title: <span className="font-baloo text-xl">Are you sure you want to exit?</span>,
            content: <span className="font-baloo text-lg">Your progress will be lost.</span>,
            okText: <span className="font-baloo">Yes, exit</span>,
            cancelText: <span className="font-baloo">Cancel</span>,
            centered: true,
            onOk: () => navigate("/learn"),
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen font-">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !currentLesson) {
        return <NotFoundPage />;
    }

    const currentQuestion = currentLesson.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / currentLesson.questions.length) * 100;

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 font-">
            <div className="max-w-3xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-semibold">Question {currentQuestionIndex + 1} of {currentLesson.questions.length}</span>
                        <span className="text-lg font-semibold">{timeLeft}s</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                            className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold mb-6">{currentQuestion.content}</h2>
                    <div className="space-y-4">
                        {currentQuestion.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(option)}
                                className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${selectedAnswer === option
                                    ? "bg-blue-500 text-white transform scale-105"
                                    : "bg-gray-100 hover:bg-gray-200"
                                    }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between">
                    <button
                        onClick={handleExit}
                        className="px-6 py-3 bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors"
                    >
                        Exit Lesson
                    </button>
                    <button
                        onClick={handleNextQuestion}
                        disabled={!selectedAnswer}
                        className={`px-6 py-3 rounded-xl transition-colors ${selectedAnswer
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        {currentQuestionIndex + 1 === currentLesson.questions.length ? "Finish" : "Next"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LessonPage;
