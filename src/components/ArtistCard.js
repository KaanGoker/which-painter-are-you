import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { getPainting } from '../data/artistPaintings';
import { t } from '../constants/strings';

const ArtistCard = ({
    artistName,
    percentage,
    reason,
    color,
    index = 0,
    delay = 0,
    onPress,
}) => {
    const slideAnim = useRef(new Animated.Value(100)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    const painting = getPainting(artistName);

    useEffect(() => {
        Animated.sequence([
            Animated.delay(delay + index * 150),
            Animated.parallel([
                Animated.spring(slideAnim, {
                    toValue: 0,
                    friction: 8,
                    tension: 40,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();

        Animated.sequence([
            Animated.delay(delay + index * 150 + 200),
            Animated.timing(progressAnim, {
                toValue: percentage,
                duration: 800,
                useNativeDriver: false,
            }),
        ]).start(() => {
            if (index === 0) {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
            }
        });
    }, []);

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
    });

    const CardWrapper = onPress ? TouchableOpacity : View;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ translateX: slideAnim }],
                    opacity: opacityAnim,
                },
            ]}
        >
            <CardWrapper onPress={onPress} activeOpacity={0.8}>
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <View style={[styles.colorDot, { backgroundColor: color }]} />
                        <Text style={styles.artistName} numberOfLines={1}>{artistName}</Text>
                    </View>
                    <View style={styles.headerRight}>
                        <Text style={styles.percentage}>%{percentage}</Text>
                        {painting && (
                            <Image
                                source={{ uri: painting.url }}
                                style={styles.paintingThumb}
                                resizeMode="cover"
                            />
                        )}
                    </View>
                </View>

                <View style={styles.progressContainer}>
                    <Animated.View style={[styles.progressBackground]}>
                        <Animated.View
                            style={[
                                styles.progressBar,
                                {
                                    width: progressWidth,
                                    backgroundColor: color,
                                },
                            ]}
                        />
                    </Animated.View>
                </View>

                {painting && (
                    <Text style={styles.paintingTitle}>🖼 {painting.title}</Text>
                )}

                <View style={styles.reasonContainer}>
                    <Text style={styles.reasonLabel}>💡 {t.result.reason}</Text>
                    <Text style={styles.reasonText}>{reason}</Text>
                </View>
            </CardWrapper>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.glass,
        borderRadius: SIZES.radiusMedium,
        padding: SIZES.paddingMedium,
        marginBottom: SIZES.base * 2,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SIZES.base,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: SIZES.base,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SIZES.base,
    },
    colorDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: SIZES.base,
        flexShrink: 0,
    },
    artistName: {
        flex: 1,
        color: COLORS.textPrimary,
        fontSize: SIZES.large,
        ...FONTS.semiBold,
    },
    percentage: {
        color: COLORS.textPrimary,
        fontSize: SIZES.xlarge,
        ...FONTS.bold,
    },
    paintingThumb: {
        width: 48,
        height: 48,
        borderRadius: SIZES.radiusSmall,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    paintingTitle: {
        color: COLORS.textMuted,
        fontSize: 11,
        ...FONTS.regular,
        marginBottom: SIZES.base,
        fontStyle: 'italic',
    },
    progressContainer: {
        marginVertical: SIZES.base,
    },
    progressBackground: {
        height: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 4,
    },
    reasonContainer: {
        marginTop: SIZES.base,
        paddingTop: SIZES.base,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
    },
    reasonLabel: {
        color: COLORS.textSecondary,
        fontSize: SIZES.small,
        marginBottom: 4,
    },
    reasonText: {
        color: COLORS.textPrimary,
        fontSize: SIZES.medium,
        ...FONTS.regular,
        lineHeight: 22,
    },
});

export default ArtistCard;
