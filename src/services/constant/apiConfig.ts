export const BASE_URL = "https://quizlingo-mb7fv.ondigitalocean.app/api";

export const LOGIN_ENDPOINT = `${BASE_URL}/auth/login`;
export const REGISTER_ENDPOINT = `${BASE_URL}/auth/register`;
export const VERIFY_EMAIL_ENDPOINT = `${BASE_URL}/auth/verify-email`;
export const RESEND_VERIFICATION_ENDPOINT = `${BASE_URL}/auth/resend-verification`;
export const FORGOT_PASSWORD_ENDPOINT = `${BASE_URL}/auth/forgot-password`;
export const RESET_PASSWORD_ENDPOINT = `${BASE_URL}/auth/reset-password`;
//user
export const GET_PROFILE_TOKEN_ENDPOINT = `${BASE_URL}/users/profile`;
export const UPDATE_PROFILE_ENDPOINT = `${BASE_URL}/users/profile`;
export const UPDATE_AVATAR_PROFILE_ENDPOINT = `${BASE_URL}/users/avatar`;
export const CHOOSE_TOPICS_ENDPOINT = `${BASE_URL}/user/topic`;
export const CHOOSE_LEVELS_ENDPOINT = `${BASE_URL}/user/level`;
export const CHOOSE_SKILLS_ENDPOINT = `${BASE_URL}/user/skill`;

//lesson
export const GET_LESSONS_ENDPOINT = `${BASE_URL}/lessons`;
export const GET_LESSON_BY_ID_ENDPOINT = (id: string) =>
  `${BASE_URL}/lessons/${id}`;
export const COMPLETE_LESSON_ENDPOINT = `${BASE_URL}/progress`;
export const RETRY_LESSON_ENDPOINT = `${BASE_URL}/lessons/retry`;
export const GET_CHECK_COMPLETED_LESSON_ENDPOINT = (id: string) =>
  `${BASE_URL}/check-completion/${id}`;

//admin
export const GET_USERS_ENDPOINT = `${BASE_URL}/users`;
export const DELETE_USER_ENDPOINT = (id: string) => `${BASE_URL}/users/${id}`;

export const NOTIFICATIONS_ALL_ENDPOINT = `${BASE_URL}/admin/notifications/all`;

export const GET_ALL_LESSONS_ENDPOINT = `${BASE_URL}/admin/lessons`;

//package
export const GET_PACKAGES_ENDPOINT = `${BASE_URL}/admin/packages`;
export const DELETE_PACKAGES_ENDPOINT = (id: string) =>
  `${BASE_URL}/admin/packages/${id}`;
export const CREATE_PACKAGES_ENDPOINT = `${BASE_URL}/admin/packages`;
export const UPDATE_PACKAGES_ENDPOINT = (id: string) =>
  `${BASE_URL}/admin/packages/${id}`;

//topic
export const GET_TOPICS_ENDPOINT = `${BASE_URL}/topics`;
export const CREATE_TOPIC_ENDPOINT = `${BASE_URL}/topics`;
export const UPDATE_TOPIC_ENDPOINT = (id: string) => `${BASE_URL}/topics/${id}`;
export const DELETE_TOPIC_ENDPOINT = (id: string) => `${BASE_URL}/topics/${id}`;

//skill
export const GET_SKILLS_ENDPOINT = `${BASE_URL}/skills`;

//level
export const GET_LEVELS_ENDPOINT = `${BASE_URL}/levels`;
