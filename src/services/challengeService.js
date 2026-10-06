import AsyncStorage from '@react-native-async-storage/async-storage';

const STATE_KEY = 'challenge_state';

// Each challenge targets one artist (match = lowercase substring used against result names).
// text is a short creative prompt. movement is shown as a tag.
export const CHALLENGES = [
    { match: 'gogh', artist: 'Vincent van Gogh', movement: 'Post-Impressionism', emoji: '🌌',
      text: 'Capture something with swirling motion and vivid, intense color.' },
    { match: 'mondrian', artist: 'Piet Mondrian', movement: 'De Stijl', emoji: '🟥',
      text: 'Find clean geometric lines and primary colors (red, blue, yellow).' },
    { match: 'monet', artist: 'Claude Monet', movement: 'Impressionism', emoji: '🪷',
      text: 'Find a scene with water, reflection, or soft natural light.' },
    { match: 'hopper', artist: 'Edward Hopper', movement: 'American Realism', emoji: '🌃',
      text: 'Capture a lonely, quiet urban corner or an empty space.' },
    { match: 'rothko', artist: 'Mark Rothko', movement: 'Abstract Expressionism', emoji: '🟧',
      text: 'Find a composition of large, flat blocks of color.' },
    { match: 'klimt', artist: 'Gustav Klimt', movement: 'Art Nouveau', emoji: '✨',
      text: 'Look for golden tones, patterns, and ornamental surfaces.' },
    { match: 'munch', artist: 'Edvard Munch', movement: 'Expressionism', emoji: '😱',
      text: 'Capture a moment carrying strong emotion or tension.' },
    { match: 'kandinsky', artist: 'Wassily Kandinsky', movement: 'Abstract Art', emoji: '🔵',
      text: 'Find colorful abstract shapes with a musical rhythm.' },
    { match: 'hokusai', artist: 'Katsushika Hokusai', movement: 'Ukiyo-e', emoji: '🌊',
      text: 'Find a wave, nature, or Japanese print aesthetic.' },
    { match: 'vermeer', artist: 'Johannes Vermeer', movement: 'Baroque', emoji: '💡',
      text: 'Capture a portrait lit by soft light from a window.' },
    { match: 'seurat', artist: 'Georges Seurat', movement: 'Pointillism', emoji: '🔴',
      text: 'Find an image made of small dots or speckled texture.' },
    { match: 'pollock', artist: 'Jackson Pollock', movement: 'Abstract Expressionism', emoji: '🎨',
      text: 'Capture a chaotic, dripped, or tangled-line texture.' },
    { match: 'matisse', artist: 'Henri Matisse', movement: 'Fauvism', emoji: '🌺',
      text: 'Look for bold, daring colors and simple cut-out forms.' },
    { match: 'dali', artist: 'Salvador Dalí', movement: 'Surrealism', emoji: '🫠',
      text: 'Capture a surreal, dreamlike, or unexpected scene.' },
];

const pad = (n) => String(n).padStart(2, '0');
export const dateKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const hashStr = (s) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return h;
};

export const getTodayChallenge = () => {
    const ds = dateKey();
    return { ...CHALLENGES[hashStr(ds) % CHALLENGES.length], date: ds };
};

export const getChallengeState = async () => {
    try {
        const raw = await AsyncStorage.getItem(STATE_KEY);
        return raw ? JSON.parse(raw) : { streak: 0, points: 0, lastDate: null, completedDates: [] };
    } catch {
        return { streak: 0, points: 0, lastDate: null, completedDates: [] };
    }
};

export const isCompletedToday = async () => {
    const s = await getChallengeState();
    return !!s.completedDates?.includes(dateKey());
};

// Returns the matching challenge if the analysis results satisfy today's challenge, else null.
export const matchesTodayChallenge = (results) => {
    const c = getTodayChallenge();
    const hit = (results || []).find(
        (a) => (a.name || '').toLowerCase().includes(c.match) && (a.percentage || 0) >= 15
    );
    return hit ? c : null;
};

// Marks today's challenge complete. Returns {justCompleted, streak, points} or {alreadyDone}.
export const completeToday = async () => {
    const s = await getChallengeState();
    const ds = dateKey();
    if (s.completedDates?.includes(ds)) return { ...s, alreadyDone: true };

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yKey = dateKey(yesterday);
    const newStreak = s.lastDate === yKey ? (s.streak || 0) + 1 : 1;

    const updated = {
        streak: newStreak,
        points: (s.points || 0) + 10,
        lastDate: ds,
        completedDates: [...(s.completedDates || []), ds].slice(-90),
    };
    await AsyncStorage.setItem(STATE_KEY, JSON.stringify(updated));
    return { ...updated, justCompleted: true };
};
