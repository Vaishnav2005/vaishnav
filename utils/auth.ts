import { USERS_STORAGE_KEY, User } from '../types';

type UserStore = Record<string, User>;

export const getUsers = (): UserStore => {
    try {
        const users = localStorage.getItem(USERS_STORAGE_KEY);
        return users ? JSON.parse(users) : {};
    } catch (error) {
        console.error("Failed to parse users from localStorage:", error);
        return {};
    }
};

export const saveUsers = (users: UserStore): void => {
    try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
        console.error("Failed to save users to localStorage:", error);
    }
};

export const findUserByEmail = (email: string): User | null => {
    const users = getUsers();
    return users[email] || null;
};

export const findUserByToken = (token: string, field: 'resetToken'): { email: string; user: User } | null => {
    if (!token) return null;
    const users = getUsers();
    for (const email in users) {
        if (field === 'resetToken' && users[email].resetToken === token) {
            return { email, user: users[email] };
        }
    }
    return null;
};

export const generateToken = (): string => {
    // A simple, non-cryptographically secure token for demo purposes
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};