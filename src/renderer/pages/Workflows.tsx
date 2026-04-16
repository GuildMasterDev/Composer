import { useEffect, useState } from 'react'
import { Workflow as WorkflowIcon } from 'lucide-react'
import { getDataAdapter } from '../adapters'
import type { Workflow } from '../../shared/types'

export default function Workflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    getDataAdapter().getWorkflows().then(setWorkflows)
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Production Workflows</h1>
      </div>

      {workflows.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <WorkflowIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">No Workflows Yet</h2>
          <p className="text-muted-foreground">
            Workflow templates will be populated here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {workflows.map((workflow) => {
            const isOpen = expanded === workflow.id
            return (
              <div key={workflow.id} className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-start justify-between mb-2 gap-4">
                  <h2 className="text-xl font-semibold">{workflow.name}</h2>
                  <span className="px-2 py-1 text-xs rounded bg-secondary whitespace-nowrap">
                    {workflow.genre}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{workflow.description}</p>

                {isOpen && (
                  <>
                    <div className="mb-4">
                      <h3 className="font-medium text-sm mb-2">Steps:</h3>
                      <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-sans">
                        {workflow.steps}
                      </pre>
                    </div>
                    <div className="mb-4">
                      <h3 className="font-medium text-sm mb-2">Tools Required:</h3>
                      <p className="text-sm text-muted-foreground">{workflow.tools_required}</p>
                    </div>
                  </>
                )}

                <button
                  onClick={() => setExpanded(isOpen ? null : workflow.id)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {isOpen ? 'Hide Details' : 'View Details'}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
