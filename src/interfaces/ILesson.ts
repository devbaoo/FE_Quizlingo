export interface ILessonResponse {
  success: boolean;
  message: string;
  lessons: ILesson[];
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
  createdAt: string;
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
