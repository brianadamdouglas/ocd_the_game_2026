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
│   ├── js_MVC/           # Main JavaScript MVC files
│   │   ├── config.js     # Global configuration and instances
│   │   ├── main.js       # Game initialization
│   │   ├── globals.js    # Screen dimensions
│   │   └── [controllers, views, models]
│   ├── audio/            # Audio files
│   │   └── OCD.mp3
│   └── [other dev files]
├── img/                   # Game assets (images, sprites)
│   └── gameDev/
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

- **`game.html`**: Main entry point
- **`dev/js_MVC/config.js`**: Global game instances and configuration
- **`dev/js_MVC/main.js`**: Game initialization logic
- **`dev/js_MVC/Gameboard_Model.js`**: Game data model
- **`dev/js_MVC/Main_Controller.js`**: Main game controller
- **`dev/js_MVC/StartScreen_Controller.js`**: Start screen and loading management

## Architecture

### MVC Pattern

- **Models**: Data structures and game state (`Gameboard_Model.js`)
- **Views**: DOM manipulation and rendering (`View.js`, `Tile_View.js`, etc.)
- **Controllers**: Game logic and event handling (`Controller.js`, `Main_Controller.js`, etc.)

### Global Configuration

All global instances are centralized in `config.js`:
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
2. Register with the event handler if needed
3. Add script tags to `game.html` in the correct order
4. Update `config.js` if new global instances are needed

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

