import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    PanResponder,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import StarField from '../components/StarField';
import Svg, { Path } from 'react-native-svg';
import { captureRef } from 'react-native-view-shot';
import * as Haptics from 'expo-haptics';
import { COLORS, BUTTONS, SIZES, FONTS } from '../constants/theme';
import { t } from '../constants/strings';

const PALETTE = ['#1A1A1A', '#EF4444', '#3B82F6', '#10B981', '#FACC15', '#8B5CF6', '#EC4899'];
const BRUSHES = [3, 6, 12];

const DrawScreen = ({ navigation }) => {
    const [strokes, setStrokes] = useState([]); // {d, color, width}
    const [currentPath, setCurrentPath] = useState('');
    const [color, setColor] = useState(PALETTE[0]);
    const [width, setWidth] = useState(BRUSHES[1]);

    const canvasRef = useRef(null);
    // Refs mirror state so the PanResponder (created once) always reads fresh values
    const pathRef = useRef('');
    const colorRef = useRef(color);
    const widthRef = useRef(width);
    colorRef.current = color;
    widthRef.current = width;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (evt) => {
                const { locationX, locationY } = evt.nativeEvent;
                pathRef.current = `M${locationX.toFixed(1)},${locationY.toFixed(1)}`;
                setCurrentPath(pathRef.current);
            },
            onPanResponderMove: (evt) => {
                const { locationX, locationY } = evt.nativeEvent;
                pathRef.current += ` L${locationX.toFixed(1)},${locationY.toFixed(1)}`;
                setCurrentPath(pathRef.current);
            },
            onPanResponderRelease: () => {
                const d = pathRef.current;
                if (d) {
                    setStrokes((prev) => [...prev, { d, color: colorRef.current, width: widthRef.current }]);
                }
                pathRef.current = '';
                setCurrentPath('');
            },
        })
    ).current;

    const handleUndo = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        setStrokes((prev) => prev.slice(0, -1));
    };

    const handleClear = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        setStrokes([]);
        setCurrentPath('');
        pathRef.current = '';
    };

    const handleAnalyze = async () => {
        if (strokes.length === 0) {
            Alert.alert('✏️', t.draw.emptyWarning);
            return;
        }
        try {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
            const uri = await captureRef(canvasRef, { format: 'png', quality: 1 });
            navigation.navigate('Result', { imageUri: uri, source: 'drawing' });
        } catch (e) {
            console.error('Capture error:', e);
            Alert.alert(t.common.error, t.result.errorMessage);
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
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backButtonText}>← {t.common.back}</Text>
                    </TouchableOpacity>
                    <Text style={styles.title}>{t.draw.title}</Text>
                    <View style={styles.backButton} />
                </View>
                <Text style={styles.subtitle}>{t.draw.subtitle}</Text>

                {/* Canvas */}
                <View style={styles.canvasWrap}>
                    <View
                        ref={canvasRef}
                        collapsable={false}
                        style={styles.canvas}
                        {...panResponder.panHandlers}
                    >
                        <Svg style={StyleSheet.absoluteFill}>
                            {strokes.map((s, i) => (
                                <Path
                                    key={i}
                                    d={s.d}
                                    stroke={s.color}
                                    strokeWidth={s.width}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    fill="none"
                                />
                            ))}
                            {currentPath ? (
                                <Path
                                    d={currentPath}
                                    stroke={color}
                                    strokeWidth={width}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    fill="none"
                                />
                            ) : null}
                        </Svg>
                        {strokes.length === 0 && !currentPath && (
                            <View style={styles.placeholder} pointerEvents="none">
                                <Text style={styles.placeholderEmoji}>✍️</Text>
                                <Text style={styles.placeholderText}>{t.draw.hint}</Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Tools */}
                <View style={styles.tools}>
                    <View style={styles.toolRow}>
                        {PALETTE.map((c) => (
                            <TouchableOpacity
                                key={c}
                                onPress={() => setColor(c)}
                                style={[
                                    styles.colorDot,
                                    { backgroundColor: c },
                                    color === c && styles.colorDotActive,
                                ]}
                            />
                        ))}
                    </View>
                    <View style={styles.toolRow}>
                        <View style={styles.brushRow}>
                            {BRUSHES.map((b) => (
                                <TouchableOpacity
                                    key={b}
                                    onPress={() => setWidth(b)}
                                    style={[styles.brushBtn, width === b && styles.brushBtnActive]}
                                >
                                    <View style={[styles.brushPreview, { width: b + 4, height: b + 4, borderRadius: (b + 4) / 2 }]} />
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity onPress={handleUndo} style={styles.actionBtn}>
                            <Text style={styles.actionText}>↩︎ {t.draw.undo}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleClear} style={styles.actionBtn}>
                            <Text style={styles.actionText}>🗑 {t.draw.clear}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Analyze */}
                <TouchableOpacity onPress={handleAnalyze} activeOpacity={0.85} style={styles.analyzeWrap}>
                    <LinearGradient
                        colors={BUTTONS.primary.colors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.analyzeBtn}
                    >
                        <Text style={styles.analyzeText}>{t.draw.analyze}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    background: {
        flex: 1,
        paddingTop: (StatusBar.currentHeight ?? 0) + 10,
        paddingHorizontal: SIZES.paddingLarge,
        paddingBottom: SIZES.paddingLarge,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: { paddingVertical: SIZES.base, minWidth: 60 },
    backButtonText: { color: COLORS.textSecondary, fontSize: SIZES.medium, ...FONTS.medium },
    title: { color: COLORS.textPrimary, fontSize: SIZES.large, ...FONTS.bold },
    subtitle: {
        color: COLORS.textSecondary,
        fontSize: SIZES.small,
        textAlign: 'center',
        marginBottom: SIZES.paddingMedium,
    },
    canvasWrap: {
        flex: 1,
        borderRadius: SIZES.radiusLarge,
        overflow: 'hidden',
        marginBottom: SIZES.paddingMedium,
    },
    canvas: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    placeholder: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderEmoji: { fontSize: 44, opacity: 0.25 },
    placeholderText: { color: 'rgba(0,0,0,0.3)', fontSize: SIZES.medium, marginTop: SIZES.base },
    tools: {
        gap: SIZES.paddingMedium,
        marginBottom: SIZES.paddingMedium,
    },
    toolRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SIZES.base,
        flexWrap: 'wrap',
    },
    colorDot: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    colorDotActive: {
        borderColor: '#FFFFFF',
        borderWidth: 3,
        transform: [{ scale: 1.15 }],
    },
    brushRow: { flexDirection: 'row', gap: SIZES.base, alignItems: 'center' },
    brushBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.glass,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    brushBtnActive: { borderColor: COLORS.primaryLight, backgroundColor: 'rgba(96,165,250,0.3)' },
    brushPreview: { backgroundColor: COLORS.textPrimary },
    actionBtn: {
        paddingHorizontal: SIZES.paddingMedium,
        paddingVertical: SIZES.base,
        borderRadius: SIZES.radiusSmall,
        backgroundColor: COLORS.glass,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
    },
    actionText: { color: COLORS.textPrimary, fontSize: SIZES.small, ...FONTS.medium },
    analyzeWrap: { borderRadius: SIZES.radiusMedium, overflow: 'hidden' },
    analyzeBtn: { paddingVertical: SIZES.paddingMedium + 2, alignItems: 'center' },
    analyzeText: { color: BUTTONS.primary.text, fontSize: SIZES.large, ...FONTS.bold },
});

export default DrawScreen;
