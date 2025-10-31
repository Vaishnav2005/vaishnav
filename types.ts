export const ASPECT_RATIOS = ["1:1", "3:4", "4:3", "9:16", "16:9"] as const;
export type AspectRatio = typeof ASPECT_RATIOS[number];

export type HistoryItem = {
    id: number;
    prompt: string;
    imageUrl: string;
    aspectRatio: AspectRatio;
    timestamp: number;
};

export type User = {
    password: string;
    verified: boolean;
    resetToken?: string;
    resetTokenExpiry?: number;
};

export const USERS_STORAGE_KEY = 'imagen-ai-studio-users';
export const HISTORY_STORAGE_KEY = 'imagen-ai-studio-history';
export const MAX_HISTORY_ITEMS = 12;