import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

// Fixed positions (fractions of the screen) so the sky looks the same on every visit
const STARS = [
    [0.08, 0.06, 3], [0.22, 0.14, 2], [0.71, 0.05, 4], [0.9, 0.12, 2], [0.55, 0.18, 2],
    [0.12, 0.31, 2], [0.86, 0.29, 3], [0.38, 0.4, 2], [0.94, 0.47, 2], [0.05, 0.55, 3],
    [0.67, 0.6, 2], [0.24, 0.7, 2], [0.82, 0.74, 3], [0.46, 0.83, 2], [0.1, 0.9, 2],
    [0.6, 0.94, 3], [0.33, 0.24, 1.5], [0.77, 0.4, 1.5], [0.18, 0.47, 1.5], [0.52, 0.68, 1.5],
];

// Twinkling background stars, drawn behind a screen's content
const StarField = () => {
    const twinkle = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(twinkle, { toValue: 1, duration: 2200, useNativeDriver: true }),
                Animated.timing(twinkle, { toValue: 0, duration: 2200, useNativeDriver: true }),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, []);

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
            {STARS.map(([x, y, size], i) => {
                const opacity = twinkle.interpolate({
                    inputRange: [0, 1],
                    outputRange: i % 2 ? [0.25, 0.85] : [0.85, 0.25],
                });
                return (
                    <Animated.View
                        key={i}
                        style={[
                            styles.star,
                            {
                                left: x * width,
                                top: y * height,
                                width: size * 2,
                                height: size * 2,
                                borderRadius: size,
                                opacity,
                            },
                        ]}
                    />
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    star: {
        position: 'absolute',
        backgroundColor: COLORS.accent,
    },
});

export default StarField;
