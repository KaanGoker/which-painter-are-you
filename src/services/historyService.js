import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = 'analysis_history';
const MAX_HISTORY = 20;

export const saveAnalysis = async (imageUri, results, metadata) => {
    try {
        const history = await getHistory();
        const entry = {
            id: Date.now().toString(),
            imageUri,
            topArtist: results[0]?.name || '',
            topPercentage: results[0]?.percentage || 0,
            topColor: results[0]?.color || '#8B5CF6',
            movement: metadata?.movement || null,
            results,
            timestamp: Date.now(),
        };
        const updated = [entry, ...history].slice(0, MAX_HISTORY);
        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
        return entry;
    } catch {
        return null;
    }
};

export const getHistory = async () => {
    try {
        const raw = await AsyncStorage.getItem(HISTORY_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

export const clearHistory = async () => {
    try {
        await AsyncStorage.removeItem(HISTORY_KEY);
    } catch {}
};
