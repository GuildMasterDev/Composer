import { X, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info
}

const colorMap = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  warning: 'bg-yellow-500',
  info: 'bg-blue-500'
}

export default function Notifications() {
  const { notifications, removeNotification } = useAppStore()

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => {
        const Icon = iconMap[notification.type]
        const bgColor = colorMap[notification.type]

        return (
          <div
            key={notification.id}
            className="flex items-center gap-3 bg-background border border-border rounded-lg p-4 shadow-lg min-w-[300px] max-w-[500px] animate-in slide-in-from-right"
          >
            <div className={`p-2 rounded-full ${bgColor} text-white`}>
              <Icon className="h-4 w-4" />
            </div>
            <p className="flex-1 text-sm">{notification.message}</p>
            <button
              onClick={() => removeNotification(notification.id)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}