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
