import ItemGrid, { BaseItem } from '../components/ItemGrid'

interface DAW extends BaseItem {
  version: string
  platforms: string
  price: string
  features: string
  category: string
  image_url?: string
}

export default function DAWs() {
  const loadDaws = async (): Promise<DAW[]> => {
    if (!window.electronAPI) return []
    return await window.electronAPI.database.getDaws()
  }

  const renderDAWDetails = (daw: DAW) => (
    <>
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Version:</span>
          <span className="text-muted-foreground">{daw.version}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Platforms:</span>
          <span className="text-muted-foreground">{daw.platforms}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Price:</span>
          <span className="text-muted-foreground">{daw.price}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Category:</span>
          <span className="text-muted-foreground">{daw.category}</span>
        </div>
      </div>
      
      {daw.features && (
        <div className="mb-4">
          <h3 className="font-medium text-sm mb-2">Key Features:</h3>
          <p className="text-sm text-muted-foreground">{daw.features}</p>
        </div>
      )}
    </>
  )

  return (
    <ItemGrid<DAW>
      title="Digital Audio Workstations"
      itemType="daw"
      loadItems={loadDaws}
      filterKey="category"
      renderItemDetails={renderDAWDetails}
      getFilterOptions={(daws) => Array.from(new Set(daws.map(d => d.category)))}
    />
  )
}