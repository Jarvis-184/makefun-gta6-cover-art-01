[![make.fun · gta6-cover-art-01](https://make.fun/badge/gta6-cover-art-01.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![rank](https://make.fun/badge/gta6-cover-art-01/Jarvis-184/makefun-gta6-cover-art-01/rank.svg)](https://make.fun/bounty/gta6-cover-art-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)
[![reward](https://make.fun/badge/gta6-cover-art-01/Jarvis-184/makefun-gta6-cover-art-01/reward.svg)](https://make.fun/bounty/gta6-cover-art-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-cover-art-01)

# GTA 6 Cover Art Maker

The **GTA 6 Cover Art Maker** is a sophisticated, static, offline-first web application designed to empower users to create high-quality, authentic GTA-6-style poster cover art using their own personal photos.

## Purpose
This application bridges the gap between casual photo editing and the distinct, iconic visual style of the Grand Theft Auto series. By utilizing client-side image processing, it ensures total user privacy and instant rendering, making it the perfect tool for creative enthusiasts.

## Core Features

- **Offline-First Architecture:** The application operates entirely within your browser. All image processing, canvas rendering, and user interactions are handled locally, ensuring zero data transmission and maximum privacy.
- **GTA-Style Multi-Panel Layout:** Faithfully recreates the signature GTA visual style, complete with a hero-plus-strips composition, thick white panel borders, and panel-independent image controls.
- **Precision Image Control:** Assign unique photos to the hero and strip panels, with real-time zooming, dragging, and cropping to achieve the perfect composition.
- **Customizable Captions:** Features a fully customizable title and subtitle system. Captions are rendered directly onto the canvas with advanced shadowing and styling, utilizing imported professional-grade typography.
- **Advanced Color Grading:** Includes meticulously crafted presets like *Vice Sunset*, *Neon Night*, and *Golden Hour* to apply professional-grade color correction as an overlay, ensuring every export feels like a cinematic poster.
- **Flexible Export Options:** Supports various export configurations, including standard ratios (1080x1080, 1080x1350) and a high-fidelity 1920x1080 mode. Export directly to your local machine as high-quality PNG or JPEG images.
- **Automated Workflow Integration:** Built-in automation tools (based on Playwright) allow for consistent, high-volume poster generation and testing, streamlining the creation process for large projects.

## Setup and Usage

### Prerequisites
- Node.js (v18+ recommended)
- Modern web browser (Chrome or Firefox recommended)

### Getting Started
1. **Clone the repository:**
   ```bash
   git clone [repository-url]
   cd repo-gta6-cover-art-01
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Launch the development environment:**
   ```bash
   npm run serve
   ```
4. **Access the application:**
   Open `http://localhost:8181` in your browser.

## Project Structure
- `app/`: Source code for the web application (HTML, CSS, JavaScript).
- `app/src/`: Core JavaScript application logic.
- `app/samples/`: Sample images for quick testing.
- `app/fonts/`: Project-specific typography files.
- `capture.js`: Automation script for screenshot generation and testing.
- `main.ts`: Build and packaging tool for production exports.
- `screenshots/`: Generated project previews.

## Contributing
We welcome contributions to improve the GTA 6 Cover Art Maker. If you have feature requests, bug reports, or improvements, please open an issue or submit a pull request.

## License
This project is provided under the terms of the project's license. See the `LICENSE` file for details.
