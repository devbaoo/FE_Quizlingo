import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/services/store/store";
import { fetchLessonById } from "@/services/features/lesson/lessonSlice";
import NotFoundPage from "@/page/Error/NotFoundPage";
import { IQuestion, QuestionResult } from "@/interfaces/ILesson";



interface ShuffledQuestion extends Omit<IQuestion, 'options'> {
    options: string[];
    originalCorrectAnswer: string;
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
    const [shuffledQuestions, setShuffledQuestions] = useState<ShuffledQuestion[]>([]);

    // Function to shuffle array using Fisher-Yates algorithm
    const shuffleArray = <T,>(array: T[]): T[] => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    // Function to shuffle questions and their options
    const shuffleQuestionsAndOptions = (questions: IQuestion[]): ShuffledQuestion[] => {
        return questions.map(question => {
            const shuffledOptions = shuffleArray(question.options);
            // Find the new position of the correct answer
            const newCorrectAnswer = shuffledOptions[shuffledOptions.indexOf(question.correctAnswer)];

            return {
                ...question,
                options: shuffledOptions,
                correctAnswer: newCorrectAnswer,
                originalCorrectAnswer: question.correctAnswer
            };
        });
    };

    useEffect(() => {
        if (id) {
            dispatch(fetchLessonById(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (currentLesson) {
            setTimeLeft(currentLesson.timeLimit);
            // Shuffle both questions and their options
            const shuffled = shuffleArray(shuffleQuestionsAndOptions(currentLesson.questions));
            setShuffledQuestions(shuffled);
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
        if (currentLesson && currentQuestionIndex < shuffledQuestions.length) {
            const currentQuestion = shuffledQuestions[currentQuestionIndex];
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
        if (currentLesson && currentQuestionIndex < shuffledQuestions.length) {
            const currentQuestion = shuffledQuestions[currentQuestionIndex];
            const isTimeout = timeLeft === 0;
            const isCorrect = !isTimeout && selectedAnswer === currentQuestion.correctAnswer;

            const result: QuestionResult = {
                questionId: currentQuestion._id,
                answer: selectedAnswer,
                isCorrect,
                isTimeout,
            };

            if (isCorrect) {
                setScore(score + currentQuestion.score);
            }

            setQuestionResults([...questionResults, result]);
            setSelectedAnswer("");
            setTimeLeft(currentLesson.timeLimit);

            if (currentQuestionIndex + 1 < shuffledQuestions.length) {
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen font-">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !currentLesson || shuffledQuestions.length === 0) {
        return <NotFoundPage />;
    }

    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;

    return (
        <div className="min-h-screen bg-gray-50 py-4 sm:py-8 px-2 sm:px-4 font-baloo">
            <div className="max-w-3xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-4 sm:mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-base sm:text-lg font-semibold">Question {currentQuestionIndex + 1} of {shuffledQuestions.length}</span>
                        <span className="text-base sm:text-lg font-semibold">{timeLeft}s</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4">
                        <div
                            className="bg-blue-500 h-3 sm:h-4 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-8 mb-4 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{currentQuestion.content}</h2>
                    <div className="space-y-3 sm:space-y-4">
                        {currentQuestion.options.map((option: string, index: number) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(option)}
                                className={`w-full p-3 sm:p-4 rounded-lg sm:rounded-xl text-left transition-all duration-200 text-sm sm:text-base ${selectedAnswer === option
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
                <div className="flex justify-end">
                    <button
                        onClick={handleNextQuestion}
                        disabled={!selectedAnswer}
                        className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-colors text-sm sm:text-base ${selectedAnswer
                            ? "bg-blue-500 text-white hover:bg-blue-600"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            }`}
                    >
                        {currentQuestionIndex + 1 === shuffledQuestions.length ? "Finish" : "Next"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LessonPage;
