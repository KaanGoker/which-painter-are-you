// All user-facing text in one place
export const t = {
    // App general
    appName: 'WPY?',
    appTagline: 'Which Painter Are You?',

    // Home screen
    home: {
        welcome: 'Show me a picture',
        description: 'A painting, a doodle, the view from your window. WPY? tells you which famous painters it looks like, and why.',
        takePhoto: 'Take a Photo',
        pickFromGallery: 'Choose from Gallery',
        drawMode: 'Draw Something',
        howItWorks: 'How it works',
        step1: '1. Take or choose a picture',
        step2: '2. A vision model compares it with famous painters',
        step3: '3. See your top matches and the reasons',
        prompts: [
            'What would your morning light look like on a Hopper canvas?',
            'Which master painter would love your view from the window?',
            'Which artist would enjoy your lunch today?',
            'What hidden art is in your everyday surroundings?',
            'Which corner of your home belongs in a painting?',
            'Which artist would see the world through your eyes?',
            'What object nearby could hang in a gallery?',
            'Whose brushstroke does this moment deserve?',
        ],
    },

    // Camera screen
    camera: {
        title: 'Frame Your Artwork',
        capture: 'Capture',
        flip: 'Flip',
        cancel: 'Cancel',
        permissionTitle: 'Camera Permission Required',
        permissionMessage: 'Camera permission is required to take photos.',
        grantPermission: 'Grant Permission',
    },

    // Result screen
    result: {
        analyzing: 'Analyzing...',
        analyzingDesc: 'AI is examining your artwork',
        resultsTitle: 'Analysis Results',
        resemblance: 'Resemblance',
        reason: 'Why?',
        tryAgain: 'New Picture',
        reanalyze: 'Look Again, Differently',
        share: 'Share Result',
        noResults: 'No results found',
        notArtwork: 'This image could not be identified as artwork. Try a painting, drawing, or artistic photograph.',
        errorTitle: 'An Error Occurred',
        errorMessage: 'Please try again.',
        noKey: 'Add your Gemini API key first.',
        invalidKey: 'Google rejected your Gemini key. Check it or add a new one.',
        setKey: 'Add API Key',
        dominantMovement: 'Movement',
        dominantPeriod: 'Period',
        mood: 'How it feels',
        styleHints: 'Try this style',
        trivia: [
            'Van Gogh sold only one painting in his entire lifetime.',
            'The Mona Lisa was stolen in 1911 — and went unnoticed for two years.',
            'Picasso\'s first word was "pencil" — his father was an artist.',
            'Michelangelo painted the Sistine Chapel standing up, not lying down.',
            'Leonardo da Vinci wrote his notebooks entirely in mirror script.',
            '55% of Frida Kahlo\'s paintings are self-portraits.',
            'Monet became nearly colorblind due to cataracts — his late work reflects this.',
            'Klimt used real gold leaf in his "Golden Phase" paintings.',
            'Salvador Dalí would nap holding a spoon to jolt himself awake for surreal moments.',
            'Only 34–36 Vermeer paintings are known to exist in the world.',
        ],
    },

    // Artist info
    artists: {
        picasso: 'Pablo Picasso',
        vangogh: 'Vincent van Gogh',
        monet: 'Claude Monet',
        dali: 'Salvador Dalí',
        rembrandt: 'Rembrandt',
        davinci: 'Leonardo da Vinci',
        michelangelo: 'Michelangelo',
        vermeer: 'Johannes Vermeer',
        kandinsky: 'Wassily Kandinsky',
        matisse: 'Henri Matisse',
        warhol: 'Andy Warhol',
        kahlo: 'Frida Kahlo',
        klimt: 'Gustav Klimt',
        munch: 'Edvard Munch',
        renoir: 'Pierre-Auguste Renoir',
    },


    // History
    history: {
        title: 'Recent Analyses',
    },

    // Favorites
    favorites: {
        title: 'Favorites',
        add: 'Add to Favorites',
        saved: 'Saved ✓',
    },

    // Artist profile card
    artistProfile: {
        iconicWork: 'Iconic Work',
        noInfo: 'No additional information available.',
        readMore: 'Read on Wikipedia',
    },

    // Daily challenge
    challenge: {
        title: 'Daily challenge',
        streak: 'Streak',
        points: 'Points',
        todayDone: 'Done today ✓',
        completedTitle: '🎉 Challenge Complete!',
        completedBody: 'You completed today\'s challenge. +10 points!',
    },

    // Drawing mode
    draw: {
        title: 'Drawing Mode',
        subtitle: 'Draw something, discover which artist you resemble',
        hint: 'Draw here with your finger',
        analyze: 'Analyze My Drawing',
        undo: 'Undo',
        clear: 'Clear',
        emptyWarning: 'Draw something first!',
    },

    // API key screen
    apiKey: {
        title: 'Your Gemini Key',
        body: 'WPY? runs on your own Google Gemini API key. Making one is free and takes a minute. The key stays on this phone and only goes to Google with your requests.',
        getKey: 'Get a free key at aistudio.google.com →',
        placeholder: 'Paste your key here',
        save: 'Save and Start',
        checking: 'Checking...',
        invalid: 'That key did not work. Make sure you copied all of it.',
        remove: 'Remove Key',
        removed: 'Key removed from this phone.',
        hasKey: 'A key is saved on this phone. Paste a new one to replace it.',
        settings: 'API key',
        hobby: 'A hobby and development project, not a commercial product.',
    },

    // Common
    common: {
        loading: 'Loading...',
        error: 'Error',
        retry: 'Retry',
        close: 'Close',
        ok: 'OK',
        cancel: 'Cancel',
        back: 'Back',
    },
};

export default t;
