import { useState, type ChangeEvent } from 'react'
import type {
  EnvironmentPreset,
  EnvironmentSettings,
  EnvironmentSource,
} from './Scene3D'

const PRESET_OPTIONS = [
  'apartment',
  'city',
  'dawn',
  'forest',
  'lobby',
  'night',
  'park',
  'studio',
  'sunset',
  'warehouse',
] as const satisfies ReadonlyArray<EnvironmentPreset>

interface EnvironmentControlProps {
  environment: EnvironmentSettings
  onEnvironmentChange: (next: EnvironmentSettings) => void
}

const toNumber = (
  event: ChangeEvent<HTMLInputElement>,
  fallback: number,
  min?: number,
  max?: number
): number => {
  const parsed = Number(event.target.value)
  if (Number.isNaN(parsed)) {
    return fallback
  }

  let result = parsed
  if (typeof min === 'number') {
    result = Math.max(min, result)
  }
  if (typeof max === 'number') {
    result = Math.min(max, result)
  }

  return result
}

export default function EnvironmentControl({
  environment,
  onEnvironmentChange,
}: EnvironmentControlProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const patchEnvironment = (patch: Partial<EnvironmentSettings>) => {
    onEnvironmentChange({ ...environment, ...patch })
  }

  const handleSourceChange = (source: EnvironmentSource) => {
    patchEnvironment({ source })
  }

  return (
    <div className="control-group environment-control-group">
      <div className="collapsible-header-row">
        <label>Environment:</label>
        <button
          type="button"
          className="collapsible-toggle-button"
          onClick={() => setIsExpanded((previous) => !previous)}
          aria-expanded={isExpanded}
          aria-controls="environment-controls-content"
        >
          {isExpanded ? 'hide' : 'show'}
        </button>
      </div>

      {isExpanded && (
        <div id="environment-controls-content" className="environment-grid">
          <label className="environment-checkbox-row environment-wide-field">
            <input
              type="checkbox"
              className="checkbox"
              checked={environment.enabled}
              onChange={(event) => patchEnvironment({ enabled: event.target.checked })}
            />
            Enable environment map
          </label>

          <div className="environment-inline-field">
            <label htmlFor="environment-source">Source</label>
            <select
              id="environment-source"
              value={environment.source}
              onChange={(event) => handleSourceChange(event.target.value as EnvironmentSource)}
            >
              <option value="preset">Preset</option>
              <option value="files">Files URL</option>
            </select>
          </div>

          <div className="environment-inline-field">
            <label htmlFor="environment-preset">Preset</label>
            <select
              id="environment-preset"
              value={environment.preset}
              onChange={(event) =>
                patchEnvironment({ preset: event.target.value as EnvironmentPreset })
              }
              disabled={environment.source !== 'preset'}
            >
              {PRESET_OPTIONS.map((preset) => (
                <option key={preset} value={preset}>
                  {preset}
                </option>
              ))}
            </select>
          </div>

          <div className="environment-inline-field environment-wide-field">
            <label htmlFor="environment-files">Files URL(s)</label>
            <input
              id="environment-files"
              type="text"
              value={environment.files}
              disabled={environment.source !== 'files'}
              onChange={(event) => patchEnvironment({ files: event.target.value })}
              placeholder="/textures/studio.hdr"
            />
          </div>

          <div className="environment-inline-field environment-wide-field">
            <label htmlFor="environment-path">Path</label>
            <input
              id="environment-path"
              type="text"
              value={environment.path}
              disabled={environment.source !== 'files'}
              onChange={(event) => patchEnvironment({ path: event.target.value })}
              placeholder="Optional base path"
            />
          </div>

          <label className="environment-checkbox-row">
            <input
              type="checkbox"
              className="checkbox"
              checked={environment.background}
              onChange={(event) => patchEnvironment({ background: event.target.checked })}
            />
            Use as scene background
          </label>

          <label className="environment-checkbox-row">
            <input
              type="checkbox"
              className="checkbox"
              checked={environment.groundEnabled}
              onChange={(event) => patchEnvironment({ groundEnabled: event.target.checked })}
            />
            Enable ground projection
          </label>

          <div className="environment-inline-field">
            <label htmlFor="environment-blur">Blur ({environment.blur.toFixed(2)})</label>
            <input
              id="environment-blur"
              type="range"
              min={0}
              max={1}
              step={0.01}
              className="slider"
              value={environment.blur}
              onChange={(event) =>
                patchEnvironment({ blur: toNumber(event, environment.blur, 0, 1) })
              }
            />
          </div>

          <div className="environment-inline-field">
            <label htmlFor="environment-frames">Frames</label>
            <input
              id="environment-frames"
              type="number"
              min={1}
              value={environment.frames}
              onChange={(event) =>
                patchEnvironment({ frames: toNumber(event, environment.frames, 1) })
              }
            />
          </div>

          <div className="environment-inline-field">
            <label htmlFor="environment-near">Near</label>
            <input
              id="environment-near"
              type="number"
              min={0.01}
              step={0.1}
              value={environment.near}
              onChange={(event) =>
                patchEnvironment({ near: toNumber(event, environment.near, 0.01) })
              }
            />
          </div>

          <div className="environment-inline-field">
            <label htmlFor="environment-far">Far</label>
            <input
              id="environment-far"
              type="number"
              min={0.1}
              step={1}
              value={environment.far}
              onChange={(event) => patchEnvironment({ far: toNumber(event, environment.far, 0.1) })}
            />
          </div>

          <div className="environment-inline-field">
            <label htmlFor="environment-resolution">Resolution</label>
            <input
              id="environment-resolution"
              type="number"
              min={16}
              step={16}
              value={environment.resolution}
              onChange={(event) =>
                patchEnvironment({
                  resolution: toNumber(event, environment.resolution, 16),
                })
              }
            />
          </div>

          {environment.groundEnabled && (
            <>
              <div className="environment-inline-field">
                <label htmlFor="environment-ground-height">Ground Height</label>
                <input
                  id="environment-ground-height"
                  type="number"
                  step={0.1}
                  value={environment.groundHeight}
                  onChange={(event) =>
                    patchEnvironment({
                      groundHeight: toNumber(event, environment.groundHeight),
                    })
                  }
                />
              </div>

              <div className="environment-inline-field">
                <label htmlFor="environment-ground-radius">Ground Radius</label>
                <input
                  id="environment-ground-radius"
                  type="number"
                  min={0}
                  step={1}
                  value={environment.groundRadius}
                  onChange={(event) =>
                    patchEnvironment({
                      groundRadius: toNumber(event, environment.groundRadius, 0),
                    })
                  }
                />
              </div>

              <div className="environment-inline-field">
                <label htmlFor="environment-ground-scale">Ground Scale</label>
                <input
                  id="environment-ground-scale"
                  type="number"
                  min={0.01}
                  step={0.1}
                  value={environment.groundScale}
                  onChange={(event) =>
                    patchEnvironment({
                      groundScale: toNumber(event, environment.groundScale, 0.01),
                    })
                  }
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

