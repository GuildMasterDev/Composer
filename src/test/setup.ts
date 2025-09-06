import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock window.electronAPI
const mockElectronAPI = {
  database: {
    getDaws: vi.fn(() => Promise.resolve([])),
    getPlugins: vi.fn(() => Promise.resolve([])),
    getResources: vi.fn(() => Promise.resolve([])),
    search: vi.fn(() => Promise.resolve([])),
    addBookmark: vi.fn(() => Promise.resolve({ success: true, id: 'test-id' })),
    getBookmarks: vi.fn(() => Promise.resolve([])),
    removeBookmark: vi.fn(() => Promise.resolve({ success: true }))
  },
  store: {
    get: vi.fn(() => Promise.resolve(null)),
    set: vi.fn(() => Promise.resolve({ success: true })),
    delete: vi.fn(() => Promise.resolve({ success: true }))
  },
  openExternal: vi.fn(() => Promise.resolve({ success: true })),
  appVersion: vi.fn(() => Promise.resolve('1.0.0'))
}

// Add to window object
Object.defineProperty(window, 'electronAPI', {
  value: mockElectronAPI,
  writable: true
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})