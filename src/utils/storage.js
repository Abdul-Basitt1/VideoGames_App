import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
    FAVORITES: '@GameApp:favorites',
    HAS_ONBOARDED: '@GameApp:hasOnboarded',
};

export const storage = {
    // Favorites
    getFavorites: async () => {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error getting favorites:', error);
            return [];
        }
    },

    addFavorite: async (gameId) => {
        try {
            const favorites = await storage.getFavorites();
            if (!favorites.includes(gameId)) {
                favorites.push(gameId);
                await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
            }
            return favorites;
        } catch (error) {
            console.error('Error adding favorite:', error);
            return [];
        }
    },

    removeFavorite: async (gameId) => {
        try {
            const favorites = await storage.getFavorites();
            const updatedFavorites = favorites.filter((id) => id !== gameId);
            await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updatedFavorites));
            return updatedFavorites;
        } catch (error) {
            console.error('Error removing favorite:', error);
            return [];
        }
    },

    isFavorite: async (gameId) => {
        try {
            const favorites = await storage.getFavorites();
            return favorites.includes(gameId);
        } catch (error) {
            console.error('Error checking favorite:', error);
            return false;
        }
    },

    // Onboarding
    hasOnboarded: async () => {
        try {
            const value = await AsyncStorage.getItem(STORAGE_KEYS.HAS_ONBOARDED);
            return value === 'true';
        } catch (error) {
            console.error('Error checking onboarding:', error);
            return false;
        }
    },

    setHasOnboarded: async () => {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.HAS_ONBOARDED, 'true');
        } catch (error) {
            console.error('Error setting onboarding:', error);
        }
    },
};

