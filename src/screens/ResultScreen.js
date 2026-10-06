import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    Image,
    ScrollView,
    TouchableOpacity,
    Animated,
    Dimensions,
    Alert,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { t } from '../constants/strings';
import GlassCard from '../components/GlassCard';
import StarField from '../components/StarField';
import GradientButton from '../components/GradientButton';
import ArtistCard from '../components/ArtistCard';
import LoadingAnimation from '../components/LoadingAnimation';
import ArtistProfileModal from '../components/ArtistProfileModal';
import ShareCard from '../components/ShareCard';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { analyzeArtwork, analyzeEnrichment } from '../services/artAnalysis';
import * as Haptics from 'expo-haptics';
import { saveAnalysis } from '../services/historyService';
import { matchesTodayChallenge, completeToday } from '../services/challengeService';
import { toggleFavorite, isFavorite } from '../services/favoritesService';

const { width } = Dimensions.get('window');

const ResultScreen = ({ route, navigation }) => {
    const { imageUri } = route.params;
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [keyMissing, setKeyMissing] = useState(false);
    const [analysisRound, setAnalysisRound] = useState(0);
    const [analysisMode, setAnalysisMode] = useState('standard');
    const [metadata, setMetadata] = useState({ movement: null, period: null });
    const [isNonArtwork, setIsNonArtwork] = useState(false);
    const [enrichment, setEnrichment] = useState(null);
    const [selectedArtist, setSelectedArtist] = useState(null);
    const [sharing, setSharing] = useState(false);
    const [savedEntry, setSavedEntry] = useState(null);
    const [isFav, setIsFav] = useState(false);
    const shareCardRef = useRef(null);

    // Animations
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const imageScaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        // Entry animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.spring(imageScaleAnim, {
                toValue: 1,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();

        // Start the analysis
        performAnalysis();
    }, []);

    // Coming back from the key screen with a key error on display: try again with the new key
    useEffect(() => {
        if (!keyMissing) return undefined;
        return navigation.addListener('focus', () => performAnalysis(analysisMode));
    }, [keyMissing, analysisMode]);

    const performAnalysis = async (mode = 'standard') => {
        try {
            setLoading(true);
            setError(null);
            setKeyMissing(false);
            setIsNonArtwork(false);
            setSavedEntry(null);
            setIsFav(false);

            const response = await analyzeArtwork(imageUri, mode);

            if (response.type === 'non_artwork') {
                setIsNonArtwork(true);
                setResults([]);
                return;
            }

            setMetadata({
                movement: response.dominant_movement,
                period: response.dominant_period,
            });

            const resultsWithColors = (response.artists || []).map((artist, index) => ({
                ...artist,
                color: COLORS.artistColors[index % COLORS.artistColors.length],
            }));

            setResults(resultsWithColors);
            setEnrichment(null);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

            const meta = { movement: response.dominant_movement, period: response.dominant_period };

            // Save to history; keep the entry so it can be favorited
            saveAnalysis(imageUri, resultsWithColors, meta)
                .then((e) => {
                    if (e) {
                        setSavedEntry(e);
                        isFavorite(e.id).then(setIsFav);
                    }
                })
                .catch(() => {});

            // Daily challenge: if this analysis matches today's target artist, complete it
            const matched = matchesTodayChallenge(resultsWithColors);
            if (matched) {
                completeToday()
                    .then((res) => {
                        if (res?.justCompleted) {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
                            Alert.alert(t.challenge.completedTitle, `${matched.artist}\n\n${t.challenge.completedBody}`);
                        }
                    })
                    .catch(() => {});
            }

            // Async enrichment - don't block main results
            if (resultsWithColors.length > 0) {
                const top = resultsWithColors[0];
                analyzeEnrichment(imageUri, top.name, top.percentage)
                    .then(data => { if (data) setEnrichment(data); })
                    .catch(() => {});
            }
        } catch (err) {
            console.error('Analysis error:', err);
            if (err.code === 'NO_API_KEY' || err.code === 'INVALID_API_KEY') {
                setKeyMissing(true);
                setError(err.code === 'NO_API_KEY' ? t.result.noKey : t.result.invalidKey);
            } else {
                setError(err.message || t.result.errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleTryAgain = () => {
        navigation.goBack();
    };

    const handleShare = async () => {
        if (sharing || !shareCardRef.current) return;
        try {
            setSharing(true);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
            const uri = await captureRef(shareCardRef, { format: 'png', quality: 0.95 });
            const canShare = await Sharing.isAvailableAsync();
            if (canShare) {
                await Sharing.shareAsync(uri, { mimeType: 'image/png' });
            }
        } catch (e) {
            console.error('Share error:', e);
        } finally {
            setSharing(false);
        }
    };

    const handleToggleFavorite = async () => {
        if (!savedEntry) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        const nowFav = await toggleFavorite(savedEntry);
        setIsFav(nowFav);
    };

    const handleReanalyze = () => {
        const nextMode = analysisMode === 'standard' ? 'alternative' : 'standard';
        setAnalysisMode(nextMode);
        setAnalysisRound(r => r + 1);
        performAnalysis(nextMode);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            <LinearGradient
                colors={[COLORS.gradientStart, COLORS.gradientMiddle, COLORS.gradientEnd]}
                style={styles.background}
            >
                <StarField />
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Animated.View
                        style={[
                            styles.content,
                            { opacity: fadeAnim },
                        ]}
                    >
                        {/* Back button */}
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.backButtonText}>← {t.common.back}</Text>
                        </TouchableOpacity>

                        {/* Image preview */}
                        <Animated.View
                            style={[
                                styles.imageContainer,
                                { transform: [{ scale: imageScaleAnim }] },
                            ]}
                        >
                            <GlassCard noPadding style={styles.imageCard}>
                                <Image
                                    source={{ uri: imageUri }}
                                    style={styles.image}
                                    resizeMode="cover"
                                />
                            </GlassCard>
                        </Animated.View>

                        {/* Loading */}
                        {loading && (
                            <GlassCard style={styles.loadingCard}>
                                <LoadingAnimation />
                            </GlassCard>
                        )}

                        {/* Error */}
                        {!loading && error && (
                            <GlassCard style={styles.errorCard}>
                                <Text style={styles.errorEmoji}>😕</Text>
                                <Text style={styles.errorTitle}>{t.result.errorTitle}</Text>
                                <Text style={styles.errorMessage}>{error}</Text>
                                <GradientButton
                                    title={keyMissing ? t.result.setKey : t.common.retry}
                                    onPress={() => (keyMissing ? navigation.navigate('ApiKey') : performAnalysis(analysisMode))}
                                    size="medium"
                                    style={styles.retryButton}
                                />
                            </GlassCard>
                        )}

                        {/* Not an artwork */}
                        {!loading && !error && isNonArtwork && (
                            <GlassCard style={styles.noResultsCard}>
                                <Text style={styles.noResultsEmoji}>🖼️</Text>
                                <Text style={styles.noResultsText}>{t.result.notArtwork}</Text>
                                <GradientButton
                                    title={t.result.tryAgain}
                                    onPress={handleTryAgain}
                                    size="medium"
                                    style={styles.retryButton}
                                />
                            </GlassCard>
                        )}

                        {/* Results */}
                        {!loading && !error && !isNonArtwork && results.length > 0 && (
                            <View style={styles.resultsContainer}>
                                <Text style={styles.resultsTitle}>
                                    {t.result.resultsTitle} ✨
                                </Text>

                                {/* Movement / period metadata */}
                                {(metadata.movement || metadata.period) && (
                                    <View style={styles.metadataRow}>
                                        {metadata.movement && (
                                            <View style={styles.metadataBadge}>
                                                <Text style={styles.metadataLabel}>{t.result.dominantMovement}</Text>
                                                <Text style={styles.metadataValue}>{metadata.movement}</Text>
                                            </View>
                                        )}
                                        {metadata.period && (
                                            <View style={styles.metadataBadge}>
                                                <Text style={styles.metadataLabel}>{t.result.dominantPeriod}</Text>
                                                <Text style={styles.metadataValue}>{metadata.period}</Text>
                                            </View>
                                        )}
                                    </View>
                                )}

                                {results.map((artist, index) => (
                                    <ArtistCard
                                        key={`${analysisRound}-${index}`}
                                        artistName={artist.name}
                                        percentage={artist.percentage}
                                        reason={artist.reason}
                                        color={artist.color}
                                        index={index}
                                        delay={300}
                                        onPress={() => setSelectedArtist(artist)}
                                    />
                                ))}

                                {/* Enrichment: mood + style hints */}
                                {enrichment && (
                                    <View style={styles.enrichmentContainer}>
                                        {enrichment.mood && (
                                            <GlassCard style={styles.enrichmentCard}>
                                                <Text style={styles.enrichmentTitle}>{t.result.mood}</Text>
                                                <Text style={styles.enrichmentText}>{enrichment.mood}</Text>
                                            </GlassCard>
                                        )}
                                        {enrichment.styleHints && enrichment.styleHints.length > 0 && (
                                            <GlassCard style={styles.enrichmentCard}>
                                                <Text style={styles.enrichmentTitle}>{t.result.styleHints}</Text>
                                                {enrichment.styleHints.map((hint, i) => (
                                                    <View key={i} style={styles.hintRow}>
                                                        <Text style={styles.hintBullet}>{i + 1}.</Text>
                                                        <Text style={styles.hintText}>{hint}</Text>
                                                    </View>
                                                ))}
                                            </GlassCard>
                                        )}
                                    </View>
                                )}

                                {savedEntry && (
                                    <TouchableOpacity
                                        onPress={handleToggleFavorite}
                                        activeOpacity={0.8}
                                        style={[styles.favToggle, isFav && styles.favToggleActive]}
                                    >
                                        <Text style={styles.favToggleText}>
                                            {isFav ? `⭐ ${t.favorites.saved}` : `☆ ${t.favorites.add}`}
                                        </Text>
                                    </TouchableOpacity>
                                )}

                                {Platform.OS !== 'web' && (
                                    <GradientButton
                                        title={sharing ? '...' : t.result.share}
                                        onPress={handleShare}
                                        size="large"
                                        style={styles.tryAgainButton}
                                    />
                                )}
                                <GradientButton
                                    title={t.result.reanalyze}
                                    onPress={handleReanalyze}
                                    variant="secondary"
                                    size="large"
                                    style={styles.tryAgainButton}
                                />
                                <GradientButton
                                    title={t.result.tryAgain}
                                    onPress={handleTryAgain}
                                    variant="ghost"
                                    size="large"
                                    style={styles.tryAgainButton}
                                />
                            </View>
                        )}

                        {/* No results */}
                        {!loading && !error && !isNonArtwork && results.length === 0 && (
                            <GlassCard style={styles.noResultsCard}>
                                <Text style={styles.noResultsEmoji}>🤔</Text>
                                <Text style={styles.noResultsText}>{t.result.noResults}</Text>
                                <GradientButton
                                    title={t.result.tryAgain}
                                    onPress={handleTryAgain}
                                    size="medium"
                                    style={styles.retryButton}
                                />
                            </GlassCard>
                        )}
                    </Animated.View>
                </ScrollView>
            </LinearGradient>

            <ArtistProfileModal
                visible={!!selectedArtist}
                artistName={selectedArtist?.name}
                color={selectedArtist?.color || COLORS.primary}
                onClose={() => setSelectedArtist(null)}
            />

            {/* Hidden share card - captured by ViewShot (native only) */}
            {Platform.OS !== 'web' && results.length > 0 && (
                <View style={styles.hiddenShareCard} pointerEvents="none">
                    <ShareCard
                        ref={shareCardRef}
                        imageUri={imageUri}
                        results={results}
                        metadata={metadata}
                        appName={t.appName}
                    />
                </View>
            )}
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
    scrollContent: {
        flexGrow: 1,
        paddingTop: (StatusBar.currentHeight ?? 0) + 10,
        paddingBottom: 40,
    },
    content: {
        flex: 1,
        paddingHorizontal: SIZES.paddingLarge,
    },
    backButton: {
        paddingVertical: SIZES.base,
        marginBottom: SIZES.base,
    },
    backButtonText: {
        color: COLORS.textSecondary,
        fontSize: SIZES.medium,
        ...FONTS.medium,
    },
    imageContainer: {
        marginBottom: SIZES.paddingLarge,
    },
    imageCard: {
        borderRadius: SIZES.radiusLarge,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: width * 0.75,
        borderRadius: SIZES.radiusLarge,
    },
    loadingCard: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
    },
    errorCard: {
        alignItems: 'center',
        padding: SIZES.paddingLarge * 2,
    },
    errorEmoji: {
        fontSize: 48,
        marginBottom: SIZES.paddingMedium,
    },
    errorTitle: {
        fontSize: SIZES.large,
        color: COLORS.textPrimary,
        ...FONTS.semiBold,
        marginBottom: SIZES.base,
    },
    errorMessage: {
        fontSize: SIZES.medium,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SIZES.paddingLarge,
        lineHeight: 22,
    },
    retryButton: {
        marginTop: SIZES.paddingMedium,
    },
    resultsContainer: {
        marginTop: SIZES.base,
    },
    resultsTitle: {
        fontSize: SIZES.xlarge,
        color: COLORS.textPrimary,
        ...FONTS.bold,
        marginBottom: SIZES.paddingLarge,
        textAlign: 'center',
    },
    tryAgainButton: {
        marginTop: SIZES.paddingMedium,
    },
    favToggle: {
        marginTop: SIZES.paddingMedium,
        paddingVertical: SIZES.paddingMedium,
        borderRadius: SIZES.radiusMedium,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: COLORS.warning,
        backgroundColor: 'rgba(253, 224, 71, 0.08)',
    },
    favToggleActive: {
        backgroundColor: 'rgba(253, 224, 71, 0.2)',
    },
    favToggleText: {
        color: COLORS.warning,
        fontSize: SIZES.medium,
        ...FONTS.semiBold,
    },
    metadataRow: {
        flexDirection: 'row',
        gap: SIZES.base,
        marginBottom: SIZES.paddingMedium,
        flexWrap: 'wrap',
    },
    metadataBadge: {
        backgroundColor: 'rgba(96, 165, 250, 0.15)',
        borderRadius: SIZES.radiusSmall,
        paddingHorizontal: SIZES.paddingMedium,
        paddingVertical: SIZES.base,
        borderWidth: 1,
        borderColor: 'rgba(96, 165, 250, 0.4)',
    },
    metadataLabel: {
        color: COLORS.textMuted,
        fontSize: 10,
        ...FONTS.medium,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    metadataValue: {
        color: COLORS.primaryLight,
        fontSize: SIZES.small,
        ...FONTS.semiBold,
        marginTop: 2,
    },
    enrichmentContainer: {
        gap: SIZES.paddingMedium,
        marginBottom: SIZES.base,
    },
    enrichmentCard: {
        padding: SIZES.paddingMedium,
    },
    enrichmentTitle: {
        color: COLORS.textPrimary,
        fontSize: SIZES.medium,
        ...FONTS.semiBold,
        marginBottom: SIZES.base,
    },
    enrichmentText: {
        color: COLORS.textSecondary,
        fontSize: SIZES.medium,
        ...FONTS.regular,
        lineHeight: 22,
        fontStyle: 'italic',
    },
    hintRow: {
        flexDirection: 'row',
        gap: SIZES.base,
        marginBottom: 6,
    },
    hintBullet: {
        color: COLORS.primary,
        fontSize: SIZES.medium,
        ...FONTS.bold,
        minWidth: 16,
    },
    hintText: {
        flex: 1,
        color: COLORS.textSecondary,
        fontSize: SIZES.medium,
        ...FONTS.regular,
        lineHeight: 22,
    },
    hiddenShareCard: {
        position: 'absolute',
        left: -9999,
        top: -9999,
    },
    noResultsCard: {
        alignItems: 'center',
        padding: SIZES.paddingLarge * 2,
    },
    noResultsEmoji: {
        fontSize: 48,
        marginBottom: SIZES.paddingMedium,
    },
    noResultsText: {
        fontSize: SIZES.large,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SIZES.paddingLarge,
    },
});

export default ResultScreen;
