import { type ReactNode } from 'react'
import './TabsComponent.css'

export interface Tab {
  id: string
  label: string
  sublabel?: string
}

interface TabsComponentProps {
  tabs: Tab[]
  activeTabId: string
  onTabSelect: (id: string) => void
  onTabAdd: () => void
  onTabRemove: (id: string) => void
  children: ReactNode
}

export default function TabsComponent({
  tabs,
  activeTabId,
  onTabSelect,
  onTabAdd,
  onTabRemove,
  children,
}: TabsComponentProps) {
  return (
    <div className="tabs-component">
      <div className="tabs-sidebar">
        <div className="tabs-list">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`tab-button${tab.id === activeTabId ? ' tab-button--active' : ''}`}
              onClick={() => onTabSelect(tab.id)}
            >
              <span className="tab-label-group">
                <span className="tab-label">{tab.label}</span>
                {tab.sublabel && <span className="tab-sublabel">{tab.sublabel}</span>}
              </span>
              {tabs.length > 1 && (
                <button
                  type="button"
                  className="tab-remove-button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onTabRemove(tab.id)
                  }}
                  aria-label={`Remove ${tab.label}`}
                  title={`Remove ${tab.label}`}
                >
                  ×
                </button>
              )}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="tab-add-button"
          onClick={onTabAdd}
          aria-label="Add material layer"
          title="Add material layer"
        >
          +
        </button>
      </div>
      <div className="tabs-content">{children}</div>
    </div>
  )
}

