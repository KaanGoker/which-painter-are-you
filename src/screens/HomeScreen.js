import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    StatusBar,
    Animated,
    Alert,
    Dimensions,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SIZES, FONTS, SHADOWS } from '../constants/theme';
import { t } from '../constants/strings';
import GlassCard from '../components/GlassCard';
import StarField from '../components/StarField';
import GradientButton from '../components/GradientButton';
import { getHistory } from '../services/historyService';
import { getTodayChallenge, getChallengeState } from '../services/challengeService';
import { getFavorites } from '../services/favoritesService';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    const [promptIndex, setPromptIndex] = useState(0);
    const [history, setHistory] = useState([]);
    const [challenge, setChallenge] = useState(null);
    const [challengeState, setChallengeState] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const promptFadeAnim = useRef(new Animated.Value(1)).current;

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;

    useFocusEffect(
        useCallback(() => {
            getHistory().then(h => setHistory(h.slice(0, 5)));
            getFavorites().then(f => setFavorites(f.slice(0, 10)));
            setChallenge(getTodayChallenge());
            getChallengeState().then(setChallengeState);
        }, [])
    );

    const completedToday = !!challengeState?.completedDates?.includes(challenge?.date);

    useEffect(() => {
        const interval = setInterval(() => {
            Animated.timing(promptFadeAnim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }).start(() => {
                setPromptIndex(i => (i + 1) % t.home.prompts.length);
                Animated.timing(promptFadeAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }).start();
            });
        }, 4000);
        return () => clearInterval(interval);
    }, [t.home.prompts.length]);

    useEffect(() => {
        // Entry animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();

        // Floating animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: 10,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const handleTakePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('📷 ' + t.common.error, t.camera.permissionMessage);
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            allowsEditing: true,
            aspect: [4, 3],
        });

        if (!result.canceled && result.assets[0]) {
            navigation.navigate('Result', { imageUri: result.assets[0].uri });
        }
    };

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('🖼️ ' + t.common.error, t.camera.permissionMessage);
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.8,
            allowsEditing: true,
            aspect: [4, 3],
        });

        if (!result.canceled && result.assets[0]) {
            navigation.navigate('Result', { imageUri: result.assets[0].uri });
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            <LinearGradient
                colors={[COLORS.gradientStart, COLORS.gradientMiddle, COLORS.gradientEnd]}
                style={styles.background}
            >
                <StarField />
                {/* Decorative circles */}
                <Animated.View
                    style={[
                        styles.decorCircle1,
                        { transform: [{ translateY: floatAnim }] },
                    ]}
                />
                <Animated.View
                    style={[
                        styles.decorCircle2,
                        { transform: [{ translateY: Animated.multiply(floatAnim, -1) }] },
                    ]}
                />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <Animated.View
                            style={[
                                styles.content,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateY: slideAnim }],
                                },
                            ]}
                        >
                            {/* Logo and title */}
                            <View style={styles.header}>
                                <Image source={require('../../assets/icon.png')} style={styles.logo} />
                                <Text style={styles.title}>{t.appName}</Text>
                                <Text style={styles.tagline}>{t.appTagline}</Text>
                                <TouchableOpacity onPress={() => navigation.navigate('ApiKey')} style={styles.keyButton}>
                                    <Text style={styles.keyButtonText}>{t.apiKey.settings}</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Main card */}
                            <GlassCard style={styles.mainCard}>
                                <Text style={styles.welcomeText}>{t.home.welcome}</Text>
                                <Text style={styles.description}>{t.home.description}</Text>

                                {/* Rotating prompt */}
                                <Animated.Text style={[styles.promptText, { opacity: promptFadeAnim }]}>
                                    ✨ {t.home.prompts[promptIndex]}
                                </Animated.Text>

                                <View style={styles.buttonContainer}>
                                    {Platform.OS !== 'web' && (
                                        <GradientButton
                                            title={t.home.takePhoto}
                                            onPress={handleTakePhoto}
                                            size="large"
                                            style={styles.button}
                                        />
                                    )}
                                    <GradientButton
                                        title={t.home.pickFromGallery}
                                        onPress={handlePickImage}
                                        variant="secondary"
                                        size="large"
                                        style={styles.button}
                                    />
                                    <GradientButton
                                        title={t.home.drawMode}
                                        onPress={() => navigation.navigate('Draw')}
                                        variant="ghost"
                                        size="large"
                                        style={styles.button}
                                    />
                                </View>
                            </GlassCard>

                            {/* Daily challenge */}
                            {challenge && (
                                <GlassCard style={styles.challengeCard}>
                                    <View style={styles.challengeHeader}>
                                        <Text style={styles.challengeTitle}>{t.challenge.title}</Text>
                                        <View style={styles.challengeStats}>
                                            <Text style={styles.challengeStat}>🔥 {challengeState?.streak || 0}</Text>
                                            <Text style={styles.challengeStat}>⭐ {challengeState?.points || 0}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.challengeBody}>
                                        <Text style={styles.challengeEmoji}>{challenge.emoji}</Text>
                                        <View style={styles.challengeInfo}>
                                            <Text style={styles.challengeArtist}>{challenge.artist}</Text>
                                            <Text style={styles.challengeMovement}>{challenge.movement}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.challengePrompt}>
                                        {challenge.text}
                                    </Text>
                                    {completedToday && (
                                        <Text style={styles.challengeDone}>{t.challenge.todayDone}</Text>
                                    )}
                                </GlassCard>
                            )}

                            {/* Favorites */}
                            {favorites.length > 0 && (
                                <View style={styles.historySection}>
                                    <Text style={styles.historySectionTitle}>{t.favorites.title}</Text>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.historyScroll}>
                                        {favorites.map(item => (
                                            <TouchableOpacity
                                                key={item.id}
                                                style={styles.historyItem}
                                                onPress={() => navigation.navigate('Result', { imageUri: item.imageUri })}
                                            >
                                                <Image source={{ uri: item.imageUri }} style={styles.historyThumb} resizeMode="cover" />
                                                <View style={[styles.historyBadge, { backgroundColor: (item.topColor || COLORS.primary) + 'CC' }]}>
                                                    <Text style={styles.historyBadgeText} numberOfLines={1}>{item.topArtist?.split(' ').pop()}</Text>
                                                    <Text style={styles.historyBadgePct}>%{item.topPercentage}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}

                            {/* Recent analyses */}
                            {history.length > 0 && (
                                <View style={styles.historySection}>
                                    <Text style={styles.historySectionTitle}>{t.history.title}</Text>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.historyScroll}>
                                        {history.map(item => (
                                            <TouchableOpacity
                                                key={item.id}
                                                style={styles.historyItem}
                                                onPress={() => navigation.navigate('Result', { imageUri: item.imageUri })}
                                            >
                                                <Image source={{ uri: item.imageUri }} style={styles.historyThumb} resizeMode="cover" />
                                                <View style={[styles.historyBadge, { backgroundColor: item.topColor + 'CC' }]}>
                                                    <Text style={styles.historyBadgeText} numberOfLines={1}>{item.topArtist?.split(' ').pop()}</Text>
                                                    <Text style={styles.historyBadgePct}>%{item.topPercentage}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            )}

                            {/* How it works */}
                            <GlassCard style={styles.howItWorksCard}>
                                <Text style={styles.howItWorksTitle}>{t.home.howItWorks}</Text>
                                <View style={styles.stepContainer}>
                                    <Text style={styles.stepText}>{t.home.step1}</Text>
                                    <Text style={styles.stepText}>{t.home.step2}</Text>
                                    <Text style={styles.stepText}>{t.home.step3}</Text>
                                </View>
                            </GlassCard>
                        </Animated.View>
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
        paddingTop: (StatusBar.currentHeight ?? 0) + 20,
        paddingBottom: 40,
    },
    content: {
        flex: 1,
        paddingHorizontal: SIZES.paddingLarge,
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
        width: 80,
        height: 80,
        borderRadius: 20,
        marginBottom: SIZES.base,
    },
    keyButton: {
        marginTop: SIZES.base,
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
        backgroundColor: COLORS.glass,
    },
    keyButtonText: {
        fontSize: 13,
        color: COLORS.textSecondary,
    },
    title: {
        fontSize: 32,
        color: COLORS.textPrimary,
        ...FONTS.bold,
        textAlign: 'center',
        textShadowColor: 'rgba(96, 165, 250, 0.45)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 10,
    },
    tagline: {
        fontSize: SIZES.medium,
        color: COLORS.textSecondary,
        marginTop: SIZES.base,
        ...FONTS.regular,
    },
    mainCard: {
        marginBottom: SIZES.paddingLarge,
    },
    welcomeText: {
        fontSize: SIZES.xlarge,
        color: COLORS.textPrimary,
        ...FONTS.bold,
        marginBottom: SIZES.base,
    },
    description: {
        fontSize: SIZES.medium,
        color: COLORS.textSecondary,
        lineHeight: 24,
        marginBottom: SIZES.paddingLarge,
        ...FONTS.regular,
    },
    challengeCard: {
        marginBottom: SIZES.paddingLarge,
    },
    challengeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SIZES.paddingMedium,
    },
    challengeTitle: {
        color: COLORS.textPrimary,
        fontSize: SIZES.medium,
        ...FONTS.bold,
    },
    challengeStats: {
        flexDirection: 'row',
        gap: SIZES.paddingMedium,
    },
    challengeStat: {
        color: COLORS.textSecondary,
        fontSize: SIZES.small,
        ...FONTS.semiBold,
    },
    challengeBody: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SIZES.paddingMedium,
        marginBottom: SIZES.base,
    },
    challengeEmoji: {
        fontSize: 36,
    },
    challengeInfo: {
        flex: 1,
    },
    challengeArtist: {
        color: COLORS.textPrimary,
        fontSize: SIZES.large,
        ...FONTS.bold,
    },
    challengeMovement: {
        color: COLORS.primaryLight,
        fontSize: SIZES.small,
        ...FONTS.medium,
        marginTop: 2,
    },
    challengePrompt: {
        color: COLORS.textSecondary,
        fontSize: SIZES.medium,
        ...FONTS.regular,
        lineHeight: 22,
        fontStyle: 'italic',
    },
    challengeDone: {
        color: COLORS.success,
        fontSize: SIZES.small,
        ...FONTS.semiBold,
        marginTop: SIZES.base,
    },
    historySection: {
        marginBottom: SIZES.paddingMedium,
    },
    historySectionTitle: {
        color: COLORS.textSecondary,
        fontSize: SIZES.small,
        ...FONTS.semiBold,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: SIZES.base,
    },
    historyScroll: {
        marginHorizontal: -SIZES.paddingLarge,
        paddingHorizontal: SIZES.paddingLarge,
    },
    historyItem: {
        width: 80,
        marginRight: SIZES.base,
        borderRadius: SIZES.radiusMedium,
        overflow: 'hidden',
    },
    historyThumb: {
        width: 80,
        height: 80,
        borderRadius: SIZES.radiusMedium,
    },
    historyBadge: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 4,
        paddingVertical: 3,
        borderBottomLeftRadius: SIZES.radiusMedium,
        borderBottomRightRadius: SIZES.radiusMedium,
    },
    historyBadgeText: {
        color: '#fff',
        fontSize: 9,
        ...FONTS.semiBold,
        textAlign: 'center',
    },
    historyBadgePct: {
        color: '#fff',
        fontSize: 9,
        ...FONTS.bold,
        textAlign: 'center',
    },
    promptText: {
        color: COLORS.accent,
        fontSize: SIZES.small,
        ...FONTS.medium,
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: SIZES.paddingMedium,
        lineHeight: 20,
    },
    buttonContainer: {
        gap: SIZES.paddingMedium,
    },
    button: {
        width: '100%',
    },
    howItWorksCard: {
        marginBottom: SIZES.paddingMedium,
    },
    howItWorksTitle: {
        fontSize: SIZES.large,
        color: COLORS.textPrimary,
        ...FONTS.semiBold,
        marginBottom: SIZES.paddingMedium,
    },
    stepContainer: {
        gap: SIZES.base,
    },
    stepText: {
        fontSize: SIZES.medium,
        color: COLORS.textSecondary,
        ...FONTS.regular,
        lineHeight: 24,
    },
});

export default HomeScreen;
