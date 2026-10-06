// Palette taken from the WPY? icon: a night sky, a daytime blue, star yellow, cloud white
export const COLORS = {
    // Sky blue, the main interactive color
    primary: '#60A5FA',
    primaryLight: '#93C5FD',
    primaryDark: '#3B82F6',

    // Star yellow, for highlights and the main call to action
    accent: '#FDE047',
    accentLight: '#FEF08A',
    accentDark: '#FACC15',

    // Dark text on the light buttons
    ink: '#14123A',

    // Night sky background
    gradientStart: '#0B0D2E',
    gradientMiddle: '#1E1B4B',
    gradientEnd: '#22306B',

    // Frosted glass surfaces
    glass: 'rgba(255, 255, 255, 0.07)',
    glassBorder: 'rgba(255, 255, 255, 0.14)',
    glassHighlight: 'rgba(255, 255, 255, 0.04)',

    // Text
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.72)',
    textMuted: 'rgba(255, 255, 255, 0.5)',

    // Status
    success: '#6EE7B7',
    warning: '#FDBA74',
    error: '#FCA5A5',

    // One color per artist in the results, in rank order
    artistColors: [
        '#FDE047', // star yellow
        '#60A5FA', // sky blue
        '#F9A8D4', // pink
        '#6EE7B7', // mint
        '#FDBA74', // orange
    ],
};

// Button styles: background gradient and text color
export const BUTTONS = {
    primary: { colors: ['#FDE047', '#FACC15'], text: COLORS.ink },
    secondary: { colors: ['#93C5FD', '#60A5FA'], text: COLORS.ink },
    ghost: { colors: ['rgba(255, 255, 255, 0.10)', 'rgba(255, 255, 255, 0.05)'], text: COLORS.textPrimary },
};

export const FONTS = {
    regular: {
        fontWeight: '400',
    },
    medium: {
        fontWeight: '500',
    },
    semiBold: {
        fontWeight: '600',
    },
    bold: {
        fontWeight: '700',
    },
    black: {
        fontWeight: '900',
    },
};

export const SIZES = {
    base: 8,
    small: 12,
    medium: 16,
    large: 20,
    xlarge: 24,
    xxlarge: 32,

    // Border radius
    radiusSmall: 8,
    radiusMedium: 16,
    radiusLarge: 24,
    radiusXLarge: 32,

    // Padding
    paddingSmall: 8,
    paddingMedium: 16,
    paddingLarge: 24,
};

export const SHADOWS = {
    small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    large: {
        shadowColor: '#60A5FA',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 12,
    },
    glow: {
        shadowColor: '#FDE047',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 15,
    },
};

export default { COLORS, BUTTONS, FONTS, SIZES, SHADOWS };
