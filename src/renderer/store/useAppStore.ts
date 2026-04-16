import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { DAW, Plugin, Resource, Bookmark } from '../../shared/types'
import { getDataAdapter } from '../adapters'

interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}

interface AppState {
  // Data cache
  daws: DAW[]
  plugins: Plugin[]
  resources: Resource[]
  bookmarks: Bookmark[]
  
  // UI state
  searchQuery: string
  notifications: Notification[]
  isLoading: boolean
  
  // Actions
  setDaws: (daws: DAW[]) => void
  setPlugins: (plugins: Plugin[]) => void
  setResources: (resources: Resource[]) => void
  setBookmarks: (bookmarks: Bookmark[]) => void
  setSearchQuery: (query: string) => void
  setLoading: (loading: boolean) => void
  
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
  
  // Data actions
  refreshData: () => Promise<void>
  addBookmark: (itemType: 'daw' | 'plugin' | 'resource', itemId: string, title: string) => Promise<void>
  removeBookmark: (id: string) => Promise<void>
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        daws: [],
        plugins: [],
        resources: [],
        bookmarks: [],
        searchQuery: '',
        notifications: [],
        isLoading: false,
        
        // Data setters
        setDaws: (daws) => set({ daws }),
        setPlugins: (plugins) => set({ plugins }),
        setResources: (resources) => set({ resources }),
        setBookmarks: (bookmarks) => set({ bookmarks }),
        setSearchQuery: (searchQuery) => set({ searchQuery }),
        setLoading: (isLoading) => set({ isLoading }),
        
        // Notification management
        addNotification: (notification) => {
          const id = `notification-${Date.now()}`
          const newNotification = { ...notification, id }
          
          set((state) => ({
            notifications: [...state.notifications, newNotification]
          }))
          
          // Auto-remove notification after duration
          if (notification.duration !== 0) {
            setTimeout(() => {
              get().removeNotification(id)
            }, notification.duration || 5000)
          }
        },
        
        removeNotification: (id) => {
          set((state) => ({
            notifications: state.notifications.filter(n => n.id !== id)
          }))
        },
        
        clearNotifications: () => set({ notifications: [] }),
        
        // Data actions
        refreshData: async () => {
          set({ isLoading: true })

          try {
            const adapter = getDataAdapter()
            const [daws, plugins, resources, bookmarks] = await Promise.all([
              adapter.getDaws(),
              adapter.getPlugins(),
              adapter.getResources(),
              adapter.getBookmarks()
            ])

            set({
              daws,
              plugins,
              resources,
              bookmarks,
              isLoading: false
            })

            get().addNotification({
              type: 'success',
              message: 'Data refreshed successfully'
            })
          } catch (error) {
            console.error('Error refreshing data:', error)
            set({ isLoading: false })

            get().addNotification({
              type: 'error',
              message: 'Failed to refresh data'
            })
          }
        },

        addBookmark: async (itemType, itemId, title) => {
          try {
            const adapter = getDataAdapter()
            await adapter.addBookmark({
              type: itemType,
              id: itemId,
              title
            })

            const bookmarks = await adapter.getBookmarks()
            set({ bookmarks })

            get().addNotification({
              type: 'success',
              message: `Bookmarked "${title}"`
            })
          } catch (error) {
            console.error('Error adding bookmark:', error)
            get().addNotification({
              type: 'error',
              message: 'Failed to add bookmark'
            })
          }
        },

        removeBookmark: async (id) => {
          try {
            await getDataAdapter().removeBookmark(id)

            set((state) => ({
              bookmarks: state.bookmarks.filter(b => b.id !== id)
            }))

            get().addNotification({
              type: 'success',
              message: 'Bookmark removed'
            })
          } catch (error) {
            console.error('Error removing bookmark:', error)
            get().addNotification({
              type: 'error',
              message: 'Failed to remove bookmark'
            })
          }
        }
      }),
      {
        name: 'composer-app-storage',
        partialize: (state) => ({
          searchQuery: state.searchQuery
        })
      }
    )
  )
)