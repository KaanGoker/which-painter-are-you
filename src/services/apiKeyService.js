import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// The user's own Gemini key. It lives only on this device: the Android Keystore / iOS Keychain
// through SecureStore, or localStorage on web where SecureStore is not available.
const KEY_NAME = 'gemini_api_key';

export const getApiKey = async () => {
    try {
        if (Platform.OS === 'web') return await AsyncStorage.getItem(KEY_NAME);
        return await SecureStore.getItemAsync(KEY_NAME);
    } catch (error) {
        console.error('API key read error:', error);
        return null;
    }
};

export const saveApiKey = async (key) => {
    if (Platform.OS === 'web') return AsyncStorage.setItem(KEY_NAME, key);
    return SecureStore.setItemAsync(KEY_NAME, key);
};

export const clearApiKey = async () => {
    if (Platform.OS === 'web') return AsyncStorage.removeItem(KEY_NAME);
    return SecureStore.deleteItemAsync(KEY_NAME);
};

// Lists models with the key: cheap, uses no generation quota, and fails fast on a bad key.
export const validateApiKey = async (key) => {
    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?pageSize=1', {
            headers: { 'x-goog-api-key': key },
        });
        return response.ok;
    } catch (error) {
        console.error('API key check error:', error);
        return false;
    }
};
