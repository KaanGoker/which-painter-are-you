import React, { forwardRef } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS } from '../constants/theme';

const CARD_WIDTH = 360;
const CARD_HEIGHT = 600;

const ShareCard = forwardRef(({ imageUri, results, metadata, appName = 'WPY?' }, ref) => {
    const top3 = results.slice(0, 3);

    return (
        <View ref={ref} style={styles.card} collapsable={false}>
            <LinearGradient
                colors={[COLORS.gradientStart, COLORS.gradientMiddle, COLORS.gradientEnd]}
                style={styles.gradient}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.appName}>🎨 {appName || 'WPY?'}</Text>
                </View>

                {/* User photo */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: imageUri }}
                        style={styles.photo}
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={['transparent', COLORS.gradientMiddle]}
                        style={styles.photoOverlay}
                    />
                </View>

                {/* Results */}
                <View style={styles.results}>
                    {metadata?.movement && (
                        <Text style={styles.movement}>{metadata.movement}</Text>
                    )}

                    {top3.map((artist, i) => (
                        <View key={i} style={styles.artistRow}>
                            <View style={styles.artistInfo}>
                                <View style={[styles.dot, { backgroundColor: artist.color }]} />
                                <Text style={styles.artistName} numberOfLines={1}>{artist.name}</Text>
                            </View>
                            <View style={styles.barContainer}>
                                <View style={styles.barBg}>
                                    <View
                                        style={[
                                            styles.bar,
                                            {
                                                width: `${artist.percentage}%`,
                                                backgroundColor: artist.color,
                                            },
                                        ]}
                                    />
                                </View>
                                <Text style={[styles.pct, { color: artist.color }]}>%{artist.percentage}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>{appName}</Text>
                </View>
            </LinearGradient>
        </View>
    );
});

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 24,
        overflow: 'hidden',
    },
    gradient: {
        flex: 1,
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 16,
    },
    appName: {
        color: '#fff',
        fontSize: 16,
        ...FONTS.bold,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    imageContainer: {
        height: 240,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
        position: 'relative',
    },
    photo: {
        width: '100%',
        height: '100%',
    },
    photoOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
    },
    results: {
        flex: 1,
    },
    movement: {
        color: COLORS.primaryLight,
        fontSize: 12,
        ...FONTS.semiBold,
        textAlign: 'center',
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    artistRow: {
        marginBottom: 16,
    },
    artistInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    artistName: {
        color: '#fff',
        fontSize: 15,
        ...FONTS.semiBold,
        flex: 1,
    },
    barContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    barBg: {
        flex: 1,
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    bar: {
        height: '100%',
        borderRadius: 4,
    },
    pct: {
        fontSize: 14,
        ...FONTS.bold,
        minWidth: 36,
        textAlign: 'right',
    },
    footer: {
        alignItems: 'center',
        marginTop: 12,
    },
    footerText: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 11,
        ...FONTS.regular,
        letterSpacing: 0.5,
    },
});

export default ShareCard;
