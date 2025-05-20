import { lessons } from '@/assets/lessonData';

const LearnPage = () => {
    return (
        <div className="px-8 py-10">
            <h1 className="text-4xl md:text-5xl font-baloo font-extrabold text-blue-600 mb-8 animate-fade-in-down drop-shadow-lg">
                Chọn bài học
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {lessons.map((lesson, idx) => (
                    <div
                        key={lesson.id}
                        className={`relative group bg-gradient-to-br ${lesson.color} rounded-3xl shadow-xl p-6 cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 animate-fade-in-up`}
                        style={{ animationDelay: `${idx * 80}ms` }}
                    >
                        <div className="flex flex-col items-center">
                            <img
                                src={lesson.image}
                                alt={lesson.title}
                                className="w-20 h-20 mb-4 rounded-full border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300 bg-white"
                            />
                            <h2 className="font-baloo text-2xl font-bold text-white drop-shadow mb-2 text-center">
                                {lesson.title}
                            </h2>
                            <p className="font-baloo text-base text-white/90 text-center mb-2">
                                {lesson.description}
                            </p>
                            <button className="mt-3 px-6 py-2 rounded-xl bg-white/90 text-blue-600 font-baloo font-bold shadow hover:bg-blue-100 transition-all duration-200 animate-bounce-in">
                                Vào học
                            </button>
                        </div>
                        {/* Hiệu ứng ánh sáng */}
                        <div className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 blur-lg animate-glow" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LearnPage;