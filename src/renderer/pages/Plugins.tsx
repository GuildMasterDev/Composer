import ItemGrid, { BaseItem } from '../components/ItemGrid'

interface Plugin extends BaseItem {
  type: string
  formats: string
  platforms: string
  price: string
  features: string
  category: string
  image_url?: string
}

export default function Plugins() {
  const loadPlugins = async (): Promise<Plugin[]> => {
    if (!window.electronAPI) return []
    return await window.electronAPI.database.getPlugins()
  }

  const renderPluginDetails = (plugin: Plugin) => (
    <>
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Type:</span>
          <span className="px-2 py-1 bg-secondary text-xs rounded">{plugin.type}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Formats:</span>
          <span className="text-muted-foreground">{plugin.formats}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Platforms:</span>
          <span className="text-muted-foreground">{plugin.platforms}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Price:</span>
          <span className="text-muted-foreground">{plugin.price}</span>
        </div>
      </div>
      
      {plugin.features && (
        <div className="mb-4">
          <h3 className="font-medium text-sm mb-2">Key Features:</h3>
          <p className="text-sm text-muted-foreground">{plugin.features}</p>
        </div>
      )}
    </>
  )

  return (
    <ItemGrid<Plugin>
      title="Plugins & Virtual Instruments"
      itemType="plugin"
      loadItems={loadPlugins}
      filterKey="type"
      renderItemDetails={renderPluginDetails}
      getFilterOptions={(plugins) => Array.from(new Set(plugins.map(p => p.type)))}
    />
  )
}