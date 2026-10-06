import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, FONTS } from '../constants/theme';
import { t } from '../constants/strings';

const LoadingAnimation = () => {
    const [triviaIndex, setTriviaIndex] = useState(0);
    const triviaFadeAnim = useRef(new Animated.Value(1)).current;

    const rotateAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const dotAnims = [
        useRef(new Animated.Value(0)).current,
        useRef(new Animated.Value(0)).current,
        useRef(new Animated.Value(0)).current,
    ];

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        dotAnims.forEach((anim, index) => {
            Animated.loop(
                Animated.sequence([
                    Animated.delay(index * 200),
                    Animated.timing(anim, {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(anim, {
                        toValue: 0,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        });

        const interval = setInterval(() => {
            Animated.timing(triviaFadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start(() => {
                setTriviaIndex(i => (i + 1) % t.result.trivia.length);
                Animated.timing(triviaFadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }).start();
            });
        }, 4000);

        return () => clearInterval(interval);
    }, [t.result.trivia.length]);

    const rotation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            <Animated.View
                style={[
                    styles.ringContainer,
                    { transform: [{ scale: pulseAnim }] },
                ]}
            >
                <Animated.View
                    style={[
                        styles.ring,
                        { transform: [{ rotate: rotation }] },
                    ]}
                >
                    <LinearGradient
                        colors={[COLORS.primary, COLORS.accent, 'transparent']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.ringGradient}
                    />
                </Animated.View>
                <View style={styles.innerCircle}>
                    <Text style={styles.emoji}>🎨</Text>
                </View>
            </Animated.View>

            <View style={styles.textContainer}>
                <Text style={styles.message}>{t.result.analyzing}</Text>
                <View style={styles.dotsContainer}>
                    {dotAnims.map((anim, index) => (
                        <Animated.Text
                            key={index}
                            style={[
                                styles.dot,
                                {
                                    opacity: anim,
                                    transform: [{
                                        translateY: anim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, -5],
                                        })
                                    }],
                                },
                            ]}
                        >
                            •
                        </Animated.Text>
                    ))}
                </View>
            </View>

            <Text style={styles.subMessage}>{t.result.analyzingDesc}</Text>

            <Animated.View style={[styles.triviaContainer, { opacity: triviaFadeAnim }]}>
                <Text style={styles.triviaLabel}>💡</Text>
                <Text style={styles.triviaText}>{t.result.trivia[triviaIndex]}</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: SIZES.paddingLarge * 2,
    },
    ringContainer: {
        width: 120,
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SIZES.paddingLarge,
    },
    ring: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: 'transparent',
        overflow: 'hidden',
    },
    ringGradient: {
        flex: 1,
        borderRadius: 60,
    },
    innerCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.glass,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    emoji: {
        fontSize: 36,
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    message: {
        color: COLORS.textPrimary,
        fontSize: SIZES.large,
        ...FONTS.semiBold,
    },
    dotsContainer: {
        flexDirection: 'row',
        marginLeft: 4,
    },
    dot: {
        color: COLORS.primary,
        fontSize: SIZES.xlarge,
        marginHorizontal: 2,
    },
    subMessage: {
        color: COLORS.textSecondary,
        fontSize: SIZES.medium,
        marginTop: SIZES.base,
        ...FONTS.regular,
    },
    triviaContainer: {
        marginTop: SIZES.paddingLarge,
        paddingHorizontal: SIZES.paddingMedium,
        paddingVertical: SIZES.paddingMedium,
        backgroundColor: 'rgba(96, 165, 250, 0.15)',
        borderRadius: SIZES.radiusMedium,
        borderWidth: 1,
        borderColor: 'rgba(96, 165, 250, 0.3)',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: SIZES.base,
        maxWidth: 280,
    },
    triviaLabel: {
        fontSize: SIZES.medium,
    },
    triviaText: {
        flex: 1,
        color: COLORS.textSecondary,
        fontSize: SIZES.small,
        ...FONTS.regular,
        lineHeight: 18,
        fontStyle: 'italic',
    },
});

export default LoadingAnimation;
