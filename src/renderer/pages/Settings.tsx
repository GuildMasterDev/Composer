import { useState, useEffect } from 'react'
import { Moon, Sun, Save } from 'lucide-react'

export default function Settings() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [autoUpdate, setAutoUpdate] = useState(true)
  const [notifications, setNotifications] = useState(true)
  
  useEffect(() => {
    loadSettings()
  }, [])
  
  const loadSettings = async () => {
    if (window.electronAPI) {
      const savedTheme = await window.electronAPI.store.get('theme')
      const savedAutoUpdate = await window.electronAPI.store.get('autoUpdate')
      const savedNotifications = await window.electronAPI.store.get('notifications')
      
      if (savedTheme) setTheme(savedTheme as 'light' | 'dark')
      if (savedAutoUpdate !== undefined && savedAutoUpdate !== null) {
        setAutoUpdate(savedAutoUpdate as boolean)
      }
      if (savedNotifications !== undefined && savedNotifications !== null) {
        setNotifications(savedNotifications as boolean)
      }
      
      applyTheme((savedTheme as string) || 'light')
    }
  }
  
  const applyTheme = (selectedTheme: string) => {
    if (selectedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  
  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme)
    applyTheme(newTheme)
  }
  
  const saveSettings = async () => {
    if (window.electronAPI) {
      await window.electronAPI.store.set('theme', theme)
      await window.electronAPI.store.set('autoUpdate', autoUpdate)
      await window.electronAPI.store.set('notifications', notifications)
    }
  }
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="max-w-2xl space-y-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Theme</label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    theme === 'light'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }`}
                >
                  <Sun className="h-4 w-4" />
                  Light
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }`}
                >
                  <Moon className="h-4 w-4" />
                  Dark
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Application</h2>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <div>
                <span className="font-medium">Auto Update</span>
                <p className="text-sm text-muted-foreground">
                  Automatically download and install updates
                </p>
              </div>
              <input
                type="checkbox"
                checked={autoUpdate}
                onChange={(e) => setAutoUpdate(e.target.checked)}
                className="w-5 h-5 rounded border-input"
              />
            </label>
            
            <label className="flex items-center justify-between">
              <div>
                <span className="font-medium">Notifications</span>
                <p className="text-sm text-muted-foreground">
                  Show notifications for new content and updates
                </p>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="w-5 h-5 rounded border-input"
              />
            </label>
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">About</h2>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version</span>
              <span>0.1.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">License</span>
              <span>MIT</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Developer</span>
              <span>GuildMaster Development</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={saveSettings}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Save className="h-4 w-4" />
          Save Settings
        </button>
      </div>
    </div>
  )
}