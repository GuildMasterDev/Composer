# Composer's Hub 🎵

A comprehensive desktop application designed to be the ultimate resource hub and manual for music composers. Access information about DAWs, plugins, workflows, and industry tools all in one place.

## ✨ What's New in v1.0.0

### Full Stack Modernization
- **Electron 41** (up from 28) with `@electron/rebuild` v4
- **Vite 6**, **Tailwind CSS 4**, **TypeScript 5.9**, **ESLint 9 flat config**
- **React 18.3**, updated Radix UI, Zustand, and all utility libraries
- **better-sqlite3 12** for Electron 41 compatibility
- **0 npm audit vulnerabilities** (down from 54)
- **GitHub Actions CI** running typecheck, lint, and tests on push/PR

See [CHANGELOG.md](CHANGELOG.md) for the full v1.0.0 release notes.

## Features

### 🎹 DAW & Tools Database
- Comprehensive catalog of Digital Audio Workstations (Reason 13, Ableton Live, FL Studio, Logic Pro, Cubase, Pro Tools, etc.)
- Detailed plugin directory (VST, VST3, AU, AAX formats)
- Hardware integration guides and compatibility charts
- Feature comparison matrices to help choose the right tools
- **NEW:** Advanced filtering and real-time search capabilities

### 📚 Learning Resources
- Curated tutorials organized by skill level (Beginner, Intermediate, Advanced)
- Embedded video tutorials from trusted sources
- PDF viewer for manuals and technical documentation
- Personal bookmark system for quick reference
- **NEW:** Improved bookmark management with notes and timestamps

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
- **NEW:** Persistent search state and improved filtering UX

### 💾 Offline First
- Works completely offline after initial setup
- Local SQLite database for fast performance
- Periodic content updates when connected
- Export/import personal settings and notes
- **NEW:** Optimized data loading with caching

### 🛡️ Enhanced Reliability
- **NEW:** Error boundaries to prevent app crashes
- **NEW:** Comprehensive error logging
- **NEW:** Automatic retry for failed operations
- **NEW:** Input validation across all forms

## Installation

### Prerequisites
- Node.js 20+ and npm
- Git

### Quick Start

```bash
# Clone the repository
git clone https://github.com/GuildMasterDev/Composer.git
cd Composer

# Install dependencies
npm install

# Rebuild native modules for Electron (required for SQLite)
npx electron-rebuild

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

#### Testing
```bash
# Run tests
npm test

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

#### Code Quality
```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Fix linting issues
npm run lint:fix
```

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
```

If TypeScript compilation is slow:
```bash
# Compile TypeScript files manually
cd src/main
npx tsc *.ts --module commonjs --esModuleInterop --skipLibCheck
cd ../..
```

## Tech Stack

- **Electron 41** - Cross-platform desktop framework
- **React 18.3** - UI library with hooks
- **TypeScript 5.9** - Type-safe development
- **Vite 6** - Fast build tool with HMR
- **Tailwind CSS 4** - Utility-first styling
- **SQLite (better-sqlite3 12)** - Local database
- **Zustand** - Lightweight state management
- **Vitest** - Fast unit testing framework
- **React Testing Library** - Component testing
- **ESLint 9** (flat config) - Linting

## Project Structure

```
Composer/
├── src/
│   ├── main/           # Electron main process
│   │   ├── main.ts      # Entry point
│   │   ├── database.ts  # Database operations
│   │   ├── ipc.ts       # IPC handlers
│   │   ├── preload.ts   # Preload script
│   │   └── data/        # JSON seed data
│   ├── renderer/        # React application
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── store/       # Zustand stores
│   │   ├── utils/       # Utility functions
│   │   └── App.tsx      # Root component
│   ├── shared/          # Shared types
│   └── test/           # Test configuration
├── vitest.config.ts    # Test configuration
├── electron.vite.config.ts
└── package.json
```

## For Composers

This tool is built by composers, for composers. Whether you're:
- A beginner looking to understand different DAWs
- An intermediate producer exploring new plugins
- A professional seeking workflow optimization
- An educator teaching music production

Composer's Hub provides the resources you need in one centralized, offline-capable application.

## Contributing

We welcome contributions from the music production community! Whether it's adding new DAW information, sharing workflow templates, or improving the codebase, your input is valuable.

### Development Guidelines
- Write tests for new features
- Maintain TypeScript type safety
- Follow the existing code style
- Update documentation as needed

## License

MIT License - See [LICENSE](LICENSE) file for details

## Support

For issues, feature requests, or questions, please open an issue on GitHub.

---

Built with ❤️ for the music production community by GuildMaster Development