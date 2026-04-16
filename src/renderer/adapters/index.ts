import type { DataAdapter } from './types'
import { createElectronAdapter } from './electron'
import { createWebAdapter } from './web'

declare global {
  // Vite-injected at build time via `define`.
  // eslint-disable-next-line no-var
  var __APP_VERSION__: string
}

let cached: DataAdapter | null = null

export const getDataAdapter = (): DataAdapter => {
  if (cached) return cached

  const electronAPI = typeof window !== 'undefined' ? window.electronAPI : undefined

  if (electronAPI && electronAPI.database) {
    cached = createElectronAdapter(electronAPI)
  } else {
    cached = createWebAdapter()
  }

  return cached
}

export const isWebMode = (): boolean => getDataAdapter().mode === 'web'

export type { DataAdapter } from './types'
