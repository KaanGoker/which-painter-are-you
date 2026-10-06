import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, BUTTONS, SIZES, FONTS, SHADOWS } from '../constants/theme';

// Button with a gradient background
const GradientButton = ({
    onPress,
    title,
    style,
    textStyle,
    variant = 'primary', // primary, secondary, ghost
    disabled = false,
    size = 'medium', // small, medium, large
}) => {
    const scaleValue = new Animated.Value(1);

    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    const look = BUTTONS[variant] || BUTTONS.primary;

    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return { paddingVertical: 10, paddingHorizontal: 20 };
            case 'large':
                return { paddingVertical: 18, paddingHorizontal: 36 };
            default:
                return { paddingVertical: 14, paddingHorizontal: 28 };
        }
    };

    return (
        <Animated.View style={[{ transform: [{ scale: scaleValue }] }, style]}>
            <TouchableOpacity
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.9}
                disabled={disabled}
            >
                <LinearGradient
                    colors={disabled ? BUTTONS.ghost.colors : look.colors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.gradient, getSizeStyles(), variant === 'ghost' && styles.ghost, disabled && styles.disabled]}
                >
                    <Text style={[styles.text, { color: disabled ? COLORS.textMuted : look.text }, textStyle]}>{title}</Text>
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    gradient: {
        borderRadius: SIZES.radiusMedium,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.medium,
    },
    ghost: {
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
        elevation: 0,
        shadowOpacity: 0,
    },
    text: {
        fontSize: SIZES.medium,
        ...FONTS.bold,
        letterSpacing: 0.2,
        textAlign: 'center',
    },
    disabled: {
        opacity: 0.7,
    },
});

export default GradientButton;
