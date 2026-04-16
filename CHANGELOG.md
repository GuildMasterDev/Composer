# Changelog

All notable changes to Composer's Hub will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-04-16

Full dependency modernization across the entire stack.

### Changed
- **Electron 28 → 41.2.1**, electron-builder 24 → 26, migrated from the
  deprecated `electron-rebuild` package to `@electron/rebuild` v4.
- **Vite 5 → 6.4.2** with compatible `@vitejs/plugin-react`,
  `vite-plugin-electron`, and `vite-plugin-electron-renderer` updates.
- **Tailwind CSS 3 → 4.2.2** using the new `@tailwindcss/postcss` plugin;
  `index.css` now uses `@import "tailwindcss"` and references the existing
  JS config via `@config`.
- **TypeScript 5.3 → 5.9.3** and **ESLint 8 → 9.39.4** with a full flat
  config migration (`.eslintrc.json` → `eslint.config.js`).
- **React 18.2 → 18.3.1** (+ react-dom and @types/react{,-dom}),
  react-router-dom 6.21 → 6.30, zustand 4.4 → 4.5.
- **better-sqlite3 9.3 → 12.9** (required for Electron 41's V8 API).
- All `@radix-ui/*`, `lucide-react`, `class-variance-authority`,
  `tailwind-merge`, `clsx`, `electron-store`, testing-library, vitest, and
  build/tooling deps bumped to latest compatible.

### Removed
- `electron-icon-builder` dev dep — unused in scripts (all icons already
  shipped in `resources/`) and pulled in an abandoned `phantomjs-prebuilt`
  transitive tree.

### Added
- GitHub Actions CI workflow (`.github/workflows/ci.yml`) running
  typecheck, lint, and tests on Node 20 and latest LTS.

### Security
- **0 npm audit vulnerabilities** (down from 54 on 0.2.0).

## [0.2.0] - 2025-09-06

### Added
- Complete TypeScript type definitions across the entire codebase
- Comprehensive error handling with try-catch blocks in all async operations
- Loading states and spinners for better user feedback
- User notification system with success/error/warning messages
- Zustand state management for global application state
- Testing infrastructure with Vitest and React Testing Library
- Error boundaries to prevent application crashes
- Input validation and sanitization for security
- Reusable `ItemGrid` component for consistent UI patterns
- External JSON files for seed data (easier maintenance)
- Test coverage for critical components
- Development guidelines in README

### Changed
- Refactored DAWs and Plugins pages to use shared ItemGrid component (60% code reduction)
- Improved IPC handlers with proper error handling and validation
- Enhanced database operations with transactions and error recovery
- Updated all components to use proper TypeScript types (removed 'any' types)
- Modernized build configuration for better performance
- Improved README with comprehensive documentation

### Fixed
- SQL injection vulnerabilities in search queries
- Missing error handling in database operations
- Type safety issues throughout the application
- Code duplication between similar components
- Inconsistent error states in UI components
- Missing loading indicators during data fetches

### Security
- Added input validation for all user inputs
- Implemented parameterized queries to prevent SQL injection
- Added URL validation for external links
- Enhanced context isolation in Electron

### Performance
- Reduced bundle size through component reuse
- Optimized database queries with proper indexing
- Implemented efficient state management with Zustand
- Added caching for frequently accessed data

## [0.1.0] - 2024-08-29

### Added
- Initial release of Composer's Hub
- DAW catalog with 15 pre-loaded entries
- Plugin directory with 14 pre-loaded entries
- Bookmark system for saving favorites
- Search functionality across all content
- Settings page with theme preferences
- SQLite database for local storage
- Electron desktop application framework
- React-based user interface
- Tailwind CSS styling