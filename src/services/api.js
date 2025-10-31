import axios from 'axios';
import { API_CONFIG } from '../constants/api';

const apiClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    params: {
        key: API_CONFIG.API_KEY,
    },
});

export const gamesAPI = {
    // Get all games with pagination
    getGames: async (page = 1, pageSize = 20, search = null, ordering = '-rating') => {
        try {
            const params = {
                page,
                page_size: pageSize,
                ordering,
            };

            if (search) {
                params.search = search;
            }

            const response = await apiClient.get(API_CONFIG.GAMES_ENDPOINT, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching games:', error);
            throw error;
        }
    },

    // Get game details by ID
    getGameDetails: async (gameId) => {
        try {
            const response = await apiClient.get(`${API_CONFIG.GAMES_ENDPOINT}/${gameId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching game details:', error);
            throw error;
        }
    },

    // Search games
    searchGames: async (query, page = 1) => {
        try {
            const response = await apiClient.get(API_CONFIG.GAMES_ENDPOINT, {
                params: {
                    search: query,
                    page,
                    page_size: 20,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error searching games:', error);
            throw error;
        }
    },

    // Get trending games
    getTrendingGames: async (page = 1) => {
        try {
            const response = await apiClient.get(API_CONFIG.GAMES_ENDPOINT, {
                params: {
                    dates: '2024-01-01,2024-12-31',
                    ordering: '-added',
                    page,
                    page_size: 20,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching trending games:', error);
            throw error;
        }
    },

    // Get upcoming games
    getUpcomingGames: async (page = 1) => {
        try {
            const response = await apiClient.get(API_CONFIG.GAMES_ENDPOINT, {
                params: {
                    dates: '2025-01-01,2025-12-31',
                    ordering: '-added',
                    page,
                    page_size: 20,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching upcoming games:', error);
            throw error;
        }
    },
};

