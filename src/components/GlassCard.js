import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../constants/theme';

// Frosted glass card
const GlassCard = ({ children, style, noPadding = false }) => {
    return (
        <View style={[styles.container, style]}>
            <LinearGradient
                colors={[
                    'rgba(255, 255, 255, 0.10)',
                    'rgba(255, 255, 255, 0.03)',
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.gradient, noPadding && styles.noPadding]}
            >
                {children}
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: SIZES.radiusLarge,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    gradient: {
        padding: SIZES.paddingLarge,
    },
    noPadding: {
        padding: 0,
    },
});

export default GlassCard;
