export interface ILessonResponse {
  success: boolean;
  message: string;
  topics: ITopicWithLessons[];
  pagination: IPagination;
}

export interface ITopicWithLessons {
  topic: ITopicDetail;
  lessons: ILesson[];
}

export interface IPagination {
  currentPage: number;
  pageSize: number;
  totalTopics: number;
  totalPages: number;
}

export interface ILesson {
  _id: string;
  title: string;
  type: string;
  topic: ITopicDetail;
  level: ILevel | null;
  skills: ISkill[];
  maxScore: number;
  timeLimit: number;
  questions: IQuestion[];
  createdAt: string;
  status: "COMPLETE" | "LOCKED";
}

export interface ITopicDetail {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  __v: number;
}

export interface ILevel {
  _id: string;
  name: string;
  maxScore: number;
  timeLimit: number;
  minUserLevel: number;
  minLessonPassed: number;
  minScoreRequired: number;
  order: number;
  isActive: boolean;
  createdAt: string;
  __v: number;
}

export interface ISkill {
  _id: string;
  name: string;
  description: string;
  supportedTypes: string[];
  isActive: boolean;
  createdAt: string;
  __v: number;
}

export interface IQuestion {
  _id: string;
  lessonId: string;
  content: string;
  type: "multiple_choice" | "text_input" | "audio_input";
  skill: string;
  options: string[];
  correctAnswer?: string;
  score: number;
  timeLimit?: number;
  audioContent?: string;
  createdAt: string;
  __v: number;
}

export interface QuestionResult {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  isTimeout: boolean;
}

export interface QuestionResultWithScore extends QuestionResult {
  score: number;
  feedback: string | null;
  transcription: string | null;
  _id: string;
}

export interface LessonProgress {
  userId: string;
  lessonId: string;
  score: number;
  status: string;
  isRetried: boolean;
  questionResults: QuestionResultWithScore[];
  _id: string;
  completedAt: string;
  __v: number;
}

export interface UserProgress {
  level: string;
  userLevel: number;
  xp: number;
  lives: number;
  completedBasicVocab: string[];
  preferredSkills: string[];
  nextLevelXp: number;
}

export interface CompleteLessonResponse {
  success: boolean;
  message: string;
  status: string;
  progress: LessonProgress;
  user: UserProgress;
}

// Form related interfaces
export interface QuestionFormData {
  content: string;
  type: "multiple_choice" | "text_input" | "audio_input";
  skill: string;
  options?: string[];
  correctAnswer?: string;
  score: number;
  timeLimit: number;
}

export interface LessonFormData {
  title: string;
  topic: string;
  level: string;
  questions: QuestionFormData[];
}

export interface CreateLessonData {
  title: string;
  topic: string;
  level: string;
  questions: {
    skill: string;
    type: "multiple_choice" | "text_input" | "audio_input";
    content: string;
    timeLimit: number;
    options?: string[];
    correctAnswer?: string;
    score: number;
  }[];
}

export interface ILearningPathItem {
    pathId: string;
    lessonId: string;
    title: string;
    topic: string;
    level: string;
    focusSkills: string[];
    recommendedReason: string;
    accuracyBefore: number;
    order: number;
    completed: boolean;
    createdAt: string;
    status: "LOCKED" | "ACTIVE" | "COMPLETE";
}
