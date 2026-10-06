import AsyncStorage from '@react-native-async-storage/async-storage';

const FAV_KEY = 'favorites';
const MAX_FAV = 50;

// Favorites store full analysis entries (same shape as history entries) in their own
// key so they survive the history cap. Each entry has a stable `id`.

export const getFavorites = async () => {
    try {
        const raw = await AsyncStorage.getItem(FAV_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

export const isFavorite = async (id) => {
    if (!id) return false;
    const favs = await getFavorites();
    return favs.some((f) => f.id === id);
};

export const addFavorite = async (entry) => {
    try {
        const favs = await getFavorites();
        if (favs.some((f) => f.id === entry.id)) return favs;
        const updated = [entry, ...favs].slice(0, MAX_FAV);
        await AsyncStorage.setItem(FAV_KEY, JSON.stringify(updated));
        return updated;
    } catch {
        return null;
    }
};

export const removeFavorite = async (id) => {
    try {
        const favs = await getFavorites();
        const updated = favs.filter((f) => f.id !== id);
        await AsyncStorage.setItem(FAV_KEY, JSON.stringify(updated));
        return updated;
    } catch {
        return null;
    }
};

// Toggles favorite for an entry. Returns the new favorite state (true = now favorited).
export const toggleFavorite = async (entry) => {
    if (!entry?.id) return false;
    const favs = await getFavorites();
    if (favs.some((f) => f.id === entry.id)) {
        await removeFavorite(entry.id);
        return false;
    }
    await addFavorite(entry);
    return true;
};
