import "server-only";

export const isValidEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);
export const isValidPassword = (pw: string) => typeof pw === "string" && pw.length >= 6;
export const normalizeEmail = (email: string) => email.trim().toLowerCase();
