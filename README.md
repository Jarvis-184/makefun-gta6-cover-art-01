[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/Jarvis-184/makefun-gta6-cover-art-01/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/Jarvis-184/makefun-gta6-cover-art-01/reward.svg)](https://make.fun/bounty/gta6-cover-art-01/reward?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

# GTA 6 Cover Art Maker

The **GTA 6 Cover Art Maker** is a fully offline, static web application that allows users to create authentic, GTA-6-style poster cover art entirely in their browser.

## Features

- **GTA-Style Layout:** Create 3-panel GTA-style poster layouts.
- **Image Editing:** Per-panel photo assignment with intuitive pan and zoom controls.
- **Captions:** Add customizable captions with professional-grade text outlines.
- **Color Grading:** Apply 3 authentic Vice City inspired color grades.
- **Export:** Export your creations in 1080x1080, 1080x1350, and 1920x1080 resolutions using browser `toDataURL`.
- **Privacy First:** The application operates completely offline.

## How to Run

### Development
1. Serve the `app/` directory using any static web server:
   ```bash
   # Example using a simple static server
   npx serve app/
   ```

### Building the Dossier
To build the project dossier for production:
```bash
MAKEFUN_OUTPUT_DIR=out node main.ts
```

### Regenerating Screenshots
To regenerate the screenshots using the automation script:
```bash
node capture.js
```

## License
- **Font:** The font located in `app/fonts/` is provided under the SIL Open Font License (OFL).
- **Code:** All other code is licensed under the MIT License.
