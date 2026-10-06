<p align="center">
  <img src="docs/cover-2x1.png" alt="WPY? Which Painter Are You" width="820">
</p>

# WPY? Which Painter Are You

Point your phone at a painting, a doodle or the view from your window, and find out which famous painters it looks like.

WPY? is a small Android and iOS app built with Expo. It sends your picture to a Gemini vision model, gets back the three to five painters your image is closest to, each with a percentage and a short reason, and then lets you dig into their best known work. It runs on your own free Gemini API key, so there is no server and no account.

> **Status:** a hobby and development project, not a commercial product. It is shared as is, for learning and fun.

<p align="center">
  <img src="docs/screenshots/01-home.jpg" alt="Home screen" width="260">
  <img src="docs/screenshots/02-result.jpg" alt="Painter matches with reasons" width="260">
</p>

## Features

- **Painter matches with reasons.** Take a photo or pick one from your gallery. The model returns the painters your image resembles, each with a percentage and one or two sentences about what it actually sees: the brushwork, the palette, the light.
- **Draw and analyze.** A built-in canvas lets you sketch with your finger and run the same analysis on the drawing. Scribbles tend to land on Cy Twombly, which is the right kind of funny.
- **Daily challenge.** Each day picks one painter's style as a target. Capture something that matches it and your streak grows.
- **Real artwork, real context.** Every match links to the painter's iconic work (public domain, from Wikimedia) and a Wikipedia summary.
- **"How it feels" and style tips.** A second, non-blocking call adds the mood of your image and a few concrete tips for shooting or making something more in that painter's style.
- **History, favorites, share cards.** Past results are kept on the device, the ones you like get pinned, and any result can be shared as a clean image card.
- **Bring your own key.** You paste your own Gemini API key once. It is kept in the phone's secure storage (Android Keystore, iOS Keychain) and is only ever sent to Google.

## How it works

Most of the work happens in the prompt. Instead of asking "which artist is this", it walks the model through four steps: classify the image (artwork, composed photo, or neither), analyze it for composition, color, texture, subject and period, score each candidate painter on five dimensions, then normalize the totals to 100. A selfie or a screenshot short-circuits to a friendly "this does not look like art" instead of a confident wrong answer.

The result screen reads the model's JSON, animates the bars, and fires the mood and tips call only after the main answer is already on screen. When Gemini is busy (503) or rate limited (429), the request retries quietly with backoff.

- **Stack:** React Native 0.81, Expo SDK 54, React Navigation.
- **Model:** `gemini-3.1-flash-lite`, called straight from the device with the user's key.
- **Storage:** expo-secure-store for the key, AsyncStorage for history, favorites and the challenge streak.
- **Look:** a night sky theme taken from the app icon, frosted glass cards, twinkling stars, haptics.

## Project structure

```
.
├── App.js                      # navigation, sends first-time users to the key screen
├── assets/                     # app icon, adaptive icon, splash
├── docs/                       # cover and screenshots
└── src/
    ├── screens/                # ApiKey, Home, Result, Draw
    ├── components/             # ArtistCard, ArtistProfileModal, ShareCard, StarField, ...
    ├── services/               # artAnalysis, apiKeyService, history, favorites, challenge, wikipedia
    ├── data/                   # painter to iconic painting map
    └── constants/              # theme and all user-facing strings
```

## Running it

You need Node 20+ and either the Expo Go app or an Android SDK.

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go. On first launch the app asks for a Gemini API key. You can create one for free at [aistudio.google.com/apikey](https://aistudio.google.com/apikey). Change or remove it later with the "API key" button on the home screen.

To build a standalone Android APK:

```bash
npx expo prebuild --platform android
cd android && ./gradlew assembleRelease
```

Gemini's free tier has daily limits. Usage on your key is between you and Google.

## License

MIT. See [LICENSE](LICENSE).
