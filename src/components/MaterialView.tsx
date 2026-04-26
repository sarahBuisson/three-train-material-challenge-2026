import { useMemo, useState } from 'react'
import { buildMaterialCode, buildReactMaterialCode } from '../materialIntrospection/materialCode'
import './MaterialView.css'

interface MaterialViewProps {
  materialType: string
  materialProps: Record<string, unknown>
}

export default function MaterialView({ materialType, materialProps }: MaterialViewProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [viewMode, setViewMode] = useState<'three' | 'react'>('three')

  const materialThreeCode = useMemo(
    () => buildMaterialCode(materialType, materialProps),
    [materialType, materialProps]
  )

  const materialReactCode = useMemo(
    () => buildReactMaterialCode(materialType, materialProps),
    [materialType, materialProps]
  )

  return (
    <section className="material-view-container">
      <div className="collapsible-header-row">
        <h3>MaterialView</h3>
        <button
          type="button"
          className="collapsible-toggle-button"
          onClick={() => setIsExpanded((previous) => !previous)}
          aria-expanded={isExpanded}
          aria-controls="material-view-content"
        >
          {isExpanded ? 'Hide' : 'Show'}
        </button>
      </div>

      {isExpanded && (
        <div id="material-view-content" className="material-view-content">
          <div className="material-view-mode-switch" role="tablist" aria-label="Material code view">
            <button
              type="button"
              className={`material-view-mode-button${viewMode === 'three' ? ' is-active' : ''}`}
              onClick={() => setViewMode('three')}
              role="tab"
              aria-selected={viewMode === 'three'}
            >
              Three.js
            </button>
            <button
              type="button"
              className={`material-view-mode-button${viewMode === 'react' ? ' is-active' : ''}`}
              onClick={() => setViewMode('react')}
              role="tab"
              aria-selected={viewMode === 'react'}
            >
              React (R3F)
            </button>
          </div>

          <p className="material-view-hint">Only values different from defaults are shown.</p>
          <pre className="material-view-code-block">
            <code>{viewMode === 'three' ? materialThreeCode : materialReactCode}</code>
          </pre>
        </div>
      )}
    </section>
  )
}


