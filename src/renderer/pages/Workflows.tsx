import { useState } from 'react'
import { Workflow, Plus } from 'lucide-react'

export default function Workflows() {
  const [workflows] = useState([])
  
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Production Workflows</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" />
          Create Workflow
        </button>
      </div>
      
      {workflows.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <Workflow className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">No Workflows Yet</h2>
          <p className="text-muted-foreground mb-6">
            Create custom workflows to streamline your music production process.
          </p>
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            Create Your First Workflow
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {workflows.map((workflow: any) => (
            <div key={workflow.id} className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">{workflow.name}</h2>
              <p className="text-muted-foreground mb-4">{workflow.description}</p>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  View Details
                </button>
                <button className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}