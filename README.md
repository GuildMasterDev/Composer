# Composer's Hub 🎵

A comprehensive desktop application designed to be the ultimate resource hub and manual for music composers. Access information about DAWs, plugins, workflows, and industry tools all in one place.

## Features

### 🎹 DAW & Tools Database
- Comprehensive catalog of Digital Audio Workstations (Reason 13, Ableton Live, FL Studio, Logic Pro, Cubase, Pro Tools, etc.)
- Detailed plugin directory (VST, VST3, AU, AAX formats)
- Hardware integration guides and compatibility charts
- Feature comparison matrices to help choose the right tools

### 📚 Learning Resources
- Curated tutorials organized by skill level (Beginner, Intermediate, Advanced)
- Embedded video tutorials from trusted sources
- PDF viewer for manuals and technical documentation
- Personal bookmark system for quick reference

### 🎼 Workflow Templates
- Genre-specific production templates
- Signal chain examples and best practices
- MIDI routing diagrams and configurations
- Mix/master checklists for professional results

### 🔍 Smart Search & Organization
- Full-text search across all content
- Advanced filters (category, price, OS compatibility)
- Tag-based navigation system
- Quick access to favorites and recent items

### 💾 Offline First
- Works completely offline after initial setup
- Local SQLite database for fast performance
- Periodic content updates when connected
- Export/import personal settings and notes

## Installation

### Prerequisites
- Node.js 18+ and npm
- Git

### Quick Start

```bash
# Clone the repository
git clone https://github.com/guildmasterdev/Composer.git
cd Composer

# Install dependencies
npm install

# Rebuild native modules for Electron (required for SQLite)
npx electron-rebuild

# Compile TypeScript files for main process
npm run compile:main

# Start the application in development mode
npm run dev
```

The application will open automatically. The first time you run it, it will create a local database and populate it with initial DAW and plugin data.

### Running the Application

#### Development Mode
```bash
# Start with hot-reload for development
npm run dev
```

This runs both the Vite development server (for the React frontend) and the Electron app concurrently.

#### Production Build

```bash
# Build for your current platform
npm run build

# The built application will be in the dist-electron folder
# - Windows: .exe installer
# - macOS: .dmg file  
# - Linux: .AppImage file
```

### Troubleshooting

If you encounter issues with native modules:
```bash
# Clean and rebuild
rm -rf node_modules
npm install
npx electron-rebuild
npm run compile:main
```

If the app doesn't start:
```bash
# Check that port 5173 is free (used by Vite)
lsof -i :5173

# Compile main process files manually
npm run compile:main

# Then try running again
npm run dev
```

## Tech Stack

- **Electron** - Cross-platform desktop framework
- **React** - UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **SQLite** - Local database
- **Zustand** - State management

## For Composers

This tool is built by composers, for composers. Whether you're:
- A beginner looking to understand different DAWs
- An intermediate producer exploring new plugins
- A professional seeking workflow optimization
- An educator teaching music production

Composer's Hub provides the resources you need in one centralized, offline-capable application.

## Contributing

We welcome contributions from the music production community! Whether it's adding new DAW information, sharing workflow templates, or improving the codebase, your input is valuable.

## License

MIT License - See [LICENSE](LICENSE) file for details

## Support

For issues, feature requests, or questions, please open an issue on GitHub.

---

Built with ❤️ for the music production community by GuildMaster Development