import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    Linking,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { t } from '../constants/strings';
import GlassCard from '../components/GlassCard';
import StarField from '../components/StarField';
import GradientButton from '../components/GradientButton';
import { getApiKey, saveApiKey, clearApiKey, validateApiKey } from '../services/apiKeyService';

const { width } = Dimensions.get('window');
const AI_STUDIO_URL = 'https://aistudio.google.com/apikey';

const ApiKeyScreen = ({ navigation }) => {
    const [key, setKey] = useState('');
    const [hasKey, setHasKey] = useState(false);
    const [checking, setChecking] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        getApiKey().then((saved) => setHasKey(!!saved));
    }, []);

    const goHome = () => {
        if (navigation.canGoBack()) navigation.goBack();
        else navigation.replace('Home');
    };

    const handleSave = async () => {
        const trimmed = key.trim();
        if (!trimmed) return;
        setChecking(true);
        setError(null);
        const ok = await validateApiKey(trimmed);
        setChecking(false);
        if (!ok) {
            setError(t.apiKey.invalid);
            return;
        }
        await saveApiKey(trimmed);
        goHome();
    };

    const handleRemove = async () => {
        await clearApiKey();
        setHasKey(false);
        setKey('');
        Alert.alert(t.apiKey.settings, t.apiKey.removed);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={[COLORS.gradientStart, COLORS.gradientMiddle, COLORS.gradientEnd]}
                style={styles.background}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <StarField />
                <View style={styles.decorCircle1} />
                <View style={styles.decorCircle2} />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                        <View style={styles.header}>
                            <Image source={require('../../assets/icon.png')} style={styles.logo} />
                            <Text style={styles.title}>{t.apiKey.title}</Text>
                        </View>

                        <GlassCard style={styles.card}>
                            <Text style={styles.body}>{t.apiKey.body}</Text>

                            <TouchableOpacity onPress={() => Linking.openURL(AI_STUDIO_URL)}>
                                <Text style={styles.link}>{t.apiKey.getKey}</Text>
                            </TouchableOpacity>

                            {hasKey && <Text style={styles.note}>{t.apiKey.hasKey}</Text>}

                            <TextInput
                                style={styles.input}
                                value={key}
                                onChangeText={(text) => {
                                    setKey(text);
                                    setError(null);
                                }}
                                placeholder={t.apiKey.placeholder}
                                placeholderTextColor={COLORS.textMuted}
                                autoCapitalize="none"
                                autoCorrect={false}
                                secureTextEntry
                            />

                            {error && <Text style={styles.error}>{error}</Text>}

                            <GradientButton
                                title={checking ? t.apiKey.checking : t.apiKey.save}
                                onPress={handleSave}
                                disabled={checking || !key.trim()}
                                size="large"
                                style={styles.button}
                            />

                            {hasKey && (
                                <TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
                                    <Text style={styles.removeText}>{t.apiKey.remove}</Text>
                                </TouchableOpacity>
                            )}
                        </GlassCard>

                        <Text style={styles.hobby}>{t.apiKey.hobby}</Text>
                    </ScrollView>
                </KeyboardAvoidingView>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: SIZES.paddingLarge,
        paddingVertical: SIZES.paddingLarge * 2,
    },
    decorCircle1: {
        position: 'absolute',
        top: -100,
        right: -100,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: COLORS.primary,
        opacity: 0.1,
    },
    decorCircle2: {
        position: 'absolute',
        bottom: -50,
        left: -100,
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: COLORS.primaryDark,
        opacity: 0.12,
    },
    header: {
        alignItems: 'center',
        marginBottom: SIZES.paddingLarge,
    },
    logo: {
        width: 88,
        height: 88,
        borderRadius: 22,
        marginBottom: SIZES.paddingMedium,
    },
    title: {
        fontSize: 30,
        color: COLORS.textPrimary,
        ...FONTS.bold,
        textAlign: 'center',
    },
    card: {
        width: width - SIZES.paddingLarge * 2,
    },
    body: {
        fontSize: SIZES.medium,
        color: COLORS.textSecondary,
        lineHeight: 22,
        marginBottom: SIZES.paddingMedium,
    },
    link: {
        fontSize: SIZES.medium,
        color: COLORS.accentLight,
        ...FONTS.semiBold,
        marginBottom: SIZES.paddingMedium,
    },
    note: {
        fontSize: 14,
        color: COLORS.success,
        marginBottom: SIZES.base,
    },
    input: {
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        borderColor: COLORS.glassBorder,
        borderWidth: 1,
        borderRadius: SIZES.radiusMedium,
        color: COLORS.textPrimary,
        fontSize: SIZES.medium,
        paddingHorizontal: SIZES.paddingMedium,
        paddingVertical: 14,
        marginBottom: SIZES.paddingMedium,
    },
    error: {
        fontSize: 14,
        color: COLORS.error,
        marginBottom: SIZES.paddingMedium,
    },
    button: {
        width: '100%',
    },
    removeButton: {
        alignItems: 'center',
        marginTop: SIZES.paddingMedium,
    },
    removeText: {
        fontSize: 14,
        color: COLORS.textMuted,
        textDecorationLine: 'underline',
    },
    hobby: {
        fontSize: SIZES.small,
        color: COLORS.textMuted,
        textAlign: 'center',
        marginTop: SIZES.paddingLarge,
    },
});

export default ApiKeyScreen;
