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
  type: string;
  skill: string;
  options: string[];
  correctAnswer: string;
  score: number;
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

export interface ServerQuestionResult extends QuestionResult {
  score: number;
  feedback: string | null;
  transcription: string | null;
  _id: string;
}

export interface ServerProgress {
  userId: string;
  lessonId: string;
  score: number;
  status: string;
  isRetried: boolean;
  questionResults: ServerQuestionResult[];
  _id: string;
  completedAt: string;
  __v: number;
}

export interface ServerUserProgress {
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
  progress: ServerProgress;
  user: ServerUserProgress;
}
