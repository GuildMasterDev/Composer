import { NavLink } from 'react-router-dom'
import { 
  Home, 
  Music, 
  Package, 
  BookOpen, 
  Workflow, 
  Bookmark, 
  Settings 
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'DAWs', href: '/daws', icon: Music },
  { name: 'Plugins', href: '/plugins', icon: Package },
  { name: 'Resources', href: '/resources', icon: BookOpen },
  { name: 'Workflows', href: '/workflows', icon: Workflow },
  { name: 'Bookmarks', href: '/bookmarks', icon: Bookmark },
]

export default function Sidebar() {
  return (
    <div className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">Composer</h1>
      </div>
      
      <nav className="flex-1 px-4 pb-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 mb-1 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-border">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`
          }
        >
          <Settings className="h-5 w-5 mr-3" />
          Settings
        </NavLink>
      </div>
    </div>
  )
}