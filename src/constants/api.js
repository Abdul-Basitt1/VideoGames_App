import { RAWG_API_KEY } from '@env';

export const API_CONFIG = {
    BASE_URL: 'https://api.rawg.io/api',
    API_KEY: RAWG_API_KEY,
    GAMES_ENDPOINT: '/games',
    GENRES_ENDPOINT: '/genres',
    PLATFORMS_ENDPOINT: '/platforms',
};

export const NEWS_CONFIG = {
    BASE_URL: 'https://api.rawg.io/api',
    NEWS_ENDPOINT: '/games',
};

