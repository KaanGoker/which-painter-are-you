import React, { useEffect, useState, useRef } from 'react';
import {
    Modal,
    View,
    Text,
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Animated,
    ActivityIndicator,
    Dimensions,
    Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { getPainting } from '../data/artistPaintings';
import { fetchArtistInfo } from '../services/wikipediaService';
import { t } from '../constants/strings';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const ArtistProfileModal = ({ visible, artistName, color, onClose }) => {
    const [info, setInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const backdropAnim = useRef(new Animated.Value(0)).current;
    const painting = artistName ? getPainting(artistName) : null;

    useEffect(() => {
        if (visible && artistName) {
            setInfo(null);
            setLoading(true);
            fetchArtistInfo(artistName).then(data => {
                setInfo(data);
                setLoading(false);
            });

            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: 0,
                    friction: 8,
                    tension: 50,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: SCREEN_HEIGHT,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(backdropAnim, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible, artistName]);

    if (!visible && !artistName) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <Animated.View
                    style={[styles.backdrop, { opacity: backdropAnim }]}
                >
                    <TouchableOpacity style={styles.backdropTouch} onPress={onClose} />
                </Animated.View>

                <Animated.View
                    style={[
                        styles.sheet,
                        { transform: [{ translateY: slideAnim }] },
                    ]}
                >
                    <LinearGradient
                        colors={['#1E1B4B', '#312E81']}
                        style={styles.sheetGradient}
                    >
                        {/* Handle bar */}
                        <View style={styles.handleContainer}>
                            <View style={styles.handle} />
                        </View>

                        {/* Color accent top bar */}
                        <View style={[styles.accentBar, { backgroundColor: color }]} />

                        <ScrollView
                            style={styles.content}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.contentInner}
                        >
                            {/* Header */}
                            <View style={styles.header}>
                                {(info?.thumbnail || painting?.url) && (
                                    <Image
                                        source={{ uri: info?.thumbnail || painting?.url }}
                                        style={styles.artistImage}
                                        resizeMode="cover"
                                    />
                                )}
                                <View style={styles.headerText}>
                                    <Text style={styles.artistName}>{artistName}</Text>
                                    {info?.description ? (
                                        <Text style={styles.artistDesc}>{info.description}</Text>
                                    ) : null}
                                </View>
                            </View>

                            {loading && (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator color={COLORS.primary} />
                                </View>
                            )}

                            {!loading && info?.extract && (
                                <View style={styles.extractContainer}>
                                    <Text style={styles.extract} numberOfLines={8}>
                                        {info.extract}
                                    </Text>
                                </View>
                            )}

                            {!loading && painting && (
                                <View style={styles.paintingSection}>
                                    <Text style={styles.sectionTitle}>{t.artistProfile?.iconicWork || 'Iconic Work'}</Text>
                                    <Image
                                        source={{ uri: painting.url }}
                                        style={styles.paintingImage}
                                        resizeMode="cover"
                                    />
                                    <Text style={styles.paintingTitle}>{painting.title}</Text>
                                </View>
                            )}

                            {!loading && !info && !painting && (
                                <Text style={styles.noInfo}>
                                    {t.artistProfile?.noInfo || 'No additional information available.'}
                                </Text>
                            )}

                            {!loading && info?.pageUrl && (
                                <TouchableOpacity
                                    style={styles.wikiLink}
                                    onPress={() => Linking.openURL(info.pageUrl).catch(() => {})}
                                >
                                    <Text style={styles.wikiLinkText}>🔗 {t.artistProfile?.readMore || 'Read on Wikipedia'}</Text>
                                </TouchableOpacity>
                            )}
                        </ScrollView>

                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Text style={styles.closeText}>{t.common.close}</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    backdropTouch: {
        flex: 1,
    },
    sheet: {
        maxHeight: SCREEN_HEIGHT * 0.8,
        borderTopLeftRadius: SIZES.radiusXLarge,
        borderTopRightRadius: SIZES.radiusXLarge,
        overflow: 'hidden',
    },
    sheetGradient: {
        flex: 1,
    },
    handleContainer: {
        alignItems: 'center',
        paddingTop: SIZES.base,
        paddingBottom: SIZES.base,
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: COLORS.glassBorder,
    },
    accentBar: {
        height: 3,
        marginHorizontal: SIZES.paddingLarge,
        borderRadius: 2,
        marginBottom: SIZES.paddingMedium,
    },
    content: {
        flex: 1,
    },
    contentInner: {
        paddingHorizontal: SIZES.paddingLarge,
        paddingBottom: SIZES.paddingLarge,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SIZES.paddingMedium,
        marginBottom: SIZES.paddingMedium,
    },
    artistImage: {
        width: 80,
        height: 80,
        borderRadius: SIZES.radiusMedium,
        borderWidth: 2,
        borderColor: COLORS.glassBorder,
    },
    headerText: {
        flex: 1,
    },
    artistName: {
        color: COLORS.textPrimary,
        fontSize: SIZES.xlarge,
        ...FONTS.bold,
    },
    artistDesc: {
        color: COLORS.textMuted,
        fontSize: SIZES.small,
        ...FONTS.regular,
        marginTop: 2,
        textTransform: 'capitalize',
    },
    wikiLink: {
        marginTop: SIZES.paddingMedium,
        paddingVertical: SIZES.paddingMedium,
        borderRadius: SIZES.radiusMedium,
        alignItems: 'center',
        backgroundColor: COLORS.glass,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    wikiLinkText: {
        color: COLORS.primaryLight,
        fontSize: SIZES.medium,
        ...FONTS.semiBold,
    },
    loadingContainer: {
        paddingVertical: SIZES.paddingLarge,
        alignItems: 'center',
    },
    extractContainer: {
        backgroundColor: COLORS.glass,
        borderRadius: SIZES.radiusMedium,
        padding: SIZES.paddingMedium,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
        marginBottom: SIZES.paddingMedium,
    },
    extract: {
        color: COLORS.textSecondary,
        fontSize: SIZES.medium,
        ...FONTS.regular,
        lineHeight: 24,
    },
    sectionTitle: {
        color: COLORS.textSecondary,
        fontSize: SIZES.small,
        ...FONTS.semiBold,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: SIZES.base,
    },
    paintingSection: {
        marginBottom: SIZES.paddingMedium,
    },
    paintingImage: {
        width: '100%',
        height: 200,
        borderRadius: SIZES.radiusMedium,
        marginBottom: SIZES.base,
    },
    paintingTitle: {
        color: COLORS.textMuted,
        fontSize: SIZES.small,
        ...FONTS.regular,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    noInfo: {
        color: COLORS.textMuted,
        fontSize: SIZES.medium,
        textAlign: 'center',
        paddingVertical: SIZES.paddingLarge,
    },
    closeButton: {
        margin: SIZES.paddingLarge,
        backgroundColor: COLORS.glass,
        borderRadius: SIZES.radiusMedium,
        padding: SIZES.paddingMedium,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    closeText: {
        color: COLORS.textPrimary,
        fontSize: SIZES.medium,
        ...FONTS.semiBold,
    },
});

export default ArtistProfileModal;
