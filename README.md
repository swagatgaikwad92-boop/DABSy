# D.A.B.S.y Premium

This is a self-contained PWA foundation for D.A.B.S.y.

## Core interaction language

- Default screen: black + the supplied glowing eyes + glowing bow tie.
- Double-tap bow tie: utility menu.
- Double-tap an eye: that eye opens its own carousel.
- Swipe left/right in an eye carousel.
- Long-press an eye: pet/rub interaction.
- Camera: explicit permission, then image analysis.
- Screen: explicit browser screen-share permission, then a captured frame can be analyzed.
- Voice: browser speech recognition when supported.
- Speech output: browser speech synthesis.
- Tasks/reminders/memory/pet state: localStorage.
- Projection mode: face shrinks while large information appears above it.
- PWA shell and offline asset cache included.

## Gemini setup

Open D.A.B.S.y -> double-tap bow tie -> Settings.

Paste your own Gemini API key into the local settings field.

The frontend uses the current stable Flash model configured in `scripts/config.js`. Change it there or in Settings if Google's model catalog changes.

### Security

Do NOT commit a real API key into this repository. Google's documentation explicitly recommends keeping API keys confidential and using a backend/proxy for production apps. This build deliberately starts with an empty key and stores a testing key only in local browser storage.

For a production version, put Gemini behind a server/edge function and use ephemeral credentials for realtime Live API voice/video.

## Browser capability notes

Camera/microphone require permission and normally HTTPS (GitHub Pages qualifies).
Screen sharing is browser-dependent and requires an explicit user gesture.
SpeechRecognition availability varies by browser.

## Suggested next production layers

1. Gemini Live API session for true realtime voice + video.
2. Backend proxy / auth for production AI.
3. Push notifications for reliable reminders.
4. Calendar connectors.
5. Tool/function calling for real actions.
6. IndexedDB for richer local memory.
7. Better gesture recognition with MediaPipe if desired.
8. A larger expression/animation library while keeping the supplied face geometry unchanged.
