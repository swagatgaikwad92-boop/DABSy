# D.A.B.S.y FINAL

This is the self-contained GitHub Pages build of D.A.B.S.y.

## What is included
- Black, character-first home screen
- Exact cyan eye + white bow-tie face geometry
- Double-tap bow tie: utility menu
- Double-tap either eye: eye-specific carousel
- Swipe carousel left/right
- Long-press an eye: pet/rub reaction
- Subtitles and expressive face states
- Projection mode: face shrinks into the corner while information is displayed
- Camera capture + image understanding
- Screen capture + image understanding
- Gemini AI chat/study helper
- Voice input where the browser supports SpeechRecognition
- Speech output through browser speech synthesis
- Tasks
- Reminders
- Planner
- Local memory
- Pet state
- Mini game
- Face tricks
- Music/vibe reactions
- Offline shell through a service worker
- Installable PWA manifest with 192px and 512px icons
- Install prompt when the browser offers it

## GitHub Pages
Upload the contents of this folder to the repository root, then enable GitHub Pages from the repository's Pages settings.

Do not put this build inside an extra nested folder unless your GitHub Pages deployment is configured for that folder.

The app intentionally uses `./` relative URLs so it works from a repository Pages path such as:
`https://username.github.io/repository-name/`

## Install
On a supported Chromium browser, open the GitHub Pages URL over HTTPS. If the browser offers installation, D.A.B.S.y shows its own Install banner. You can also use the browser menu's Install app / Add to home screen option.

## Gemini
Open D.A.B.S.y > double-tap bow tie > Settings.
Paste your Gemini API key and keep the default model:
`gemini-3.8-flash`

The key is stored locally in this browser only. This is suitable for personal testing, not for a public production app. A public release should use a backend/proxy so the secret is never exposed to visitors.

## Important browser permissions
Camera and screen features require explicit browser permission and HTTPS.
Voice input depends on browser support.

## Files
- index.html
- manifest.json
- sw.js
- icons/icon-192.png
- icons/icon-512.png
