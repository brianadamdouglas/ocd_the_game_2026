# OCD The Game 2026

A browser-based game built with JavaScript, featuring an MVC architecture and ES6 syntax.

## Overview

This is an interactive game that simulates OCD (Obsessive-Compulsive Disorder) experiences through gameplay mechanics. The game features a first-person perspective with a rotating stage, interactive objects, and thought-based gameplay elements.

## Features

- **MVC Architecture**: Clean separation of concerns with Model-View-Controller pattern
- **ES6 Syntax**: Modern JavaScript with const/let, arrow functions, and template literals
- **Mobile Support**: Responsive design with touch controls and orientation handling
- **Asset Loading System**: Progressive loading with progress tracking
- **Audio Integration**: Background music with looping support
- **Thought System**: Dynamic thought animations and triggers

## Project Structure

```
OCD_GAME/
├── game.html              # Main game HTML file
├── css/                   # Stylesheets
│   └── gameboard_mobile.css
├── dev/
│   ├── js_MVC/           # Main JavaScript MVC files (organized by type)
│   │   ├── vendors/      # Third-party libraries
│   │   │   ├── jQuery_v2_1_3.js
│   │   │   ├── jquery.mobile-1.4.5.js
│   │   │   ├── jquerymobile-swipeupdown.js
│   │   │   ├── jquery.easing.1.3.js
│   │   │   └── e-smart-hittest-jquery.js
│   │   ├── core/         # Core framework classes
│   │   │   ├── Controller.js      # Base controller class
│   │   │   ├── View.js             # Base view class
│   │   │   ├── EventHandler.js     # Event system
│   │   │   ├── ImageLoading.js     # Image loading utilities
│   │   │   ├── OSC.js              # Object state controller
│   │   │   ├── globals.js          # Screen dimensions
│   │   │   └── config.js           # Global configuration and instances
│   │   ├── models/       # Data models
│   │   │   └── Gameboard_Model.js  # Game board data model
│   │   ├── controllers/ # Game controllers (32 files)
│   │   │   ├── Main_Controller.js
│   │   │   ├── Player_Controller.js
│   │   │   ├── Stage_Controller.js
│   │   │   ├── Tile_Controller.js
│   │   │   └── [28 more controller files]
│   │   ├── views/        # View classes (17 files)
│   │   │   ├── Tile_View.js
│   │   │   ├── Player_View.js
│   │   │   └── [15 more view files]
│   │   └── utils/        # Utility scripts
│   │       ├── main.js              # Game initialization
│   │       ├── mobileResize.js       # Mobile orientation handling
│   │       └── StageBuilder.js      # Stage construction utilities
│   ├── audio/            # Audio files
│   │   └── OCD.mp3
│   └── [other dev files]
├── img/                   # Game assets (images, sprites)
│   ├── gameDev/          # Game development assets
│   └── menuDev/          # Menu assets
└── php/                   # PHP backend files (if needed)
```

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3 (for local development server)

### Running Locally

1. **Start a local server**:
   ```bash
   python3 -m http.server 8000
   ```

2. **Open in browser**:
   Navigate to `http://localhost:8000/game.html`

### Alternative: Using Node.js

If you have Node.js installed, you can use `http-server`:
```bash
npx http-server -p 8000
```

## Key Files

- **`game.html`**: Main entry point with all script references
- **`dev/js_MVC/core/config.js`**: Global game instances and configuration
- **`dev/js_MVC/utils/main.js`**: Game initialization logic
- **`dev/js_MVC/models/Gameboard_Model.js`**: Game data model
- **`dev/js_MVC/controllers/Main_Controller.js`**: Main game controller
- **`dev/js_MVC/controllers/StartScreen_Controller.js`**: Start screen and loading management
- **`dev/js_MVC/core/Controller.js`**: Base controller class
- **`dev/js_MVC/core/View.js`**: Base view class
- **`dev/js_MVC/core/EventHandler.js`**: Event system for component communication

## Architecture

### MVC Pattern

- **Models**: Data structures and game state (located in `models/`)
  - `Gameboard_Model.js`: Game board data and element management
- **Views**: DOM manipulation and rendering (located in `views/`)
  - Base: `core/View.js`
  - Examples: `Tile_View.js`, `Player_View.js`, `Timer_View.js`
- **Controllers**: Game logic and event handling (located in `controllers/`)
  - Base: `core/Controller.js`
  - Examples: `Main_Controller.js`, `Player_Controller.js`, `Stage_Controller.js`

### Directory Organization

The JavaScript files are organized into logical subdirectories:
- **`vendors/`**: Third-party libraries (jQuery, jQuery Mobile, plugins)
- **`core/`**: Core framework classes (base Controller, View, EventHandler, utilities)
- **`models/`**: Data models
- **`controllers/`**: All controller classes (32 files)
- **`views/`**: All view classes (17 files)
- **`utils/`**: Utility scripts (initialization, mobile handling, stage building)

### Global Configuration

All global instances are centralized in `core/config.js`:
- `g_eventHandler`: Event system
- `g_gameboardModel`: Game data model
- `g_mainGameController`: Main game controller
- `g_startScreen`: Start screen controller
- `g_touchController`: Touch input handler

### Event System

The game uses a custom event system (`EventHandler.js`) for decoupled communication between components.

## Development

### Code Style

- ES6 syntax throughout
- `const`/`let` instead of `var`
- Arrow functions for callbacks
- Template literals for strings
- Strict equality (`===`)

### Adding New Features

1. Create controller/view/model files following the existing pattern
2. Place files in the appropriate directory:
   - Controllers → `controllers/`
   - Views → `views/`
   - Models → `models/`
   - Utilities → `utils/`
3. Register with the event handler if needed
4. Add script tags to `game.html` in the correct order (vendors → core → views → controllers → models → utils)
5. Update `core/config.js` if new global instances are needed

## Browser Compatibility

- Modern browsers with ES6 support
- Mobile browsers (iOS Safari, Chrome Mobile)
- Touch event support required for mobile controls

## License

[Add your license here]

## Author

Brian Douglas

## Repository

https://github.com/brianadamdouglas/ocd_the_game_2026

