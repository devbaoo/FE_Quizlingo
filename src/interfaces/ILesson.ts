export interface ILessonResponse {
  success: boolean;
  message: string;
  lesson: ILesson;
}

export interface ILesson {
  _id: string;
  title: string;
  type: string;
  topic: ITopicDetail;
  level: ILevel;
  skill: ISkill;
  maxScore: number;
  timeLimit: number;
  questions: IQuestion[];
  isActive: boolean;
  createdAt: string;
  __v: number;
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
  options: string[];
  correctAnswer: string;
  score: number;
  createdAt: string;
  __v: number;
}

export interface QuestionResult {
  questionId: string;
  answer: string;
  isCorrect: boolean;
  isTimeout: boolean;
}

export interface UserProgress {
  level: string;
  userLevel: number;
  xp: number;
  lives: number;
  completedBasicVocab: string[];
  preferredSkills: string[];
}

export interface LessonProgress {
  userId: string;
  lessonId: string;
  score: number;
  isRetried: boolean;
  questionResults: QuestionResult[];
  _id: string;
  completedAt: string;
}
