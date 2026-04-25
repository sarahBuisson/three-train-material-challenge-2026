import { useState, type ChangeEvent } from 'react'
import type {
  AmbientLightSettings,
  DirectionalLightSettings,
  LightSettings,
  PointLightSettings,
} from './Scene3D'

interface LightControlProps {
  lights: LightSettings
  onLightsChange: (next: LightSettings) => void
}

const toNumber = (
  event: ChangeEvent<HTMLInputElement>,
  fallback: number,
  min?: number
): number => {
  const parsed = Number(event.target.value)
  if (Number.isNaN(parsed)) {
    return fallback
  }

  if (typeof min === 'number') {
    return Math.max(min, parsed)
  }

  return parsed
}

export default function LightControl({
  lights,
  onLightsChange,
}: LightControlProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const patchLight = <K extends keyof LightSettings>(
    key: K,
    patch: Partial<LightSettings[K]>
  ) => {
    onLightsChange({
      ...lights,
      [key]: {
        ...lights[key],
        ...patch,
      },
    })
  }

  const renderCommonFields = (
    prefix: string,
    light: AmbientLightSettings | DirectionalLightSettings | PointLightSettings,
    lightKey: keyof LightSettings
  ) => (
    <>
      <label className="environment-checkbox-row" htmlFor={`${prefix}-enabled`}>
        <input
          id={`${prefix}-enabled`}
          type="checkbox"
          className="checkbox"
          checked={light.enabled}
          onChange={(event) => patchLight(lightKey, { enabled: event.target.checked })}
        />
        Enabled
      </label>

      <div className="light-inline-field">
        <label htmlFor={`${prefix}-color`}>Color</label>
        <input
          id={`${prefix}-color`}
          type="color"
          value={light.color}
          onChange={(event) => patchLight(lightKey, { color: event.target.value })}
        />
      </div>

      <div className="light-inline-field">
        <label htmlFor={`${prefix}-intensity`}>
          Intensity ({light.intensity.toFixed(2)})
        </label>
        <input
          id={`${prefix}-intensity`}
          type="range"
          min={0}
          max={5}
          step={0.05}
          className="slider"
          value={light.intensity}
          onChange={(event) =>
            patchLight(lightKey, {
              intensity: toNumber(event, light.intensity, 0),
            })
          }
        />
      </div>
    </>
  )

  return (
    <div className="control-group light-control-group">
      <div className="collapsible-header-row">
        <label>Lights:</label>
        <button
          type="button"
          className="collapsible-toggle-button"
          onClick={() => setIsExpanded((previous) => !previous)}
          aria-expanded={isExpanded}
          aria-controls="light-controls-content"
        >
          {isExpanded ? 'Hide' : 'Show'}
        </button>
      </div>

      {isExpanded && (
        <div id="light-controls-content" className="light-sections-wrapper">
          <div className="light-section">
            <h3>Ambient</h3>
            <div className="light-grid">
              {renderCommonFields('ambient-light', lights.ambient, 'ambient')}
            </div>
          </div>

          <div className="light-section">
            <h3>Directional</h3>
            <div className="light-grid">
              {renderCommonFields('directional-light', lights.directional, 'directional')}

              <div className="light-inline-field">
                <label htmlFor="directional-light-pos-x">Position X</label>
                <input
                  id="directional-light-pos-x"
                  type="number"
                  step={0.1}
                  value={lights.directional.position[0]}
                  onChange={(event) =>
                    patchLight('directional', {
                      position: [
                        toNumber(event, lights.directional.position[0]),
                        lights.directional.position[1],
                        lights.directional.position[2],
                      ],
                    })
                  }
                />
              </div>

              <div className="light-inline-field">
                <label htmlFor="directional-light-pos-y">Position Y</label>
                <input
                  id="directional-light-pos-y"
                  type="number"
                  step={0.1}
                  value={lights.directional.position[1]}
                  onChange={(event) =>
                    patchLight('directional', {
                      position: [
                        lights.directional.position[0],
                        toNumber(event, lights.directional.position[1]),
                        lights.directional.position[2],
                      ],
                    })
                  }
                />
              </div>

              <div className="light-inline-field">
                <label htmlFor="directional-light-pos-z">Position Z</label>
                <input
                  id="directional-light-pos-z"
                  type="number"
                  step={0.1}
                  value={lights.directional.position[2]}
                  onChange={(event) =>
                    patchLight('directional', {
                      position: [
                        lights.directional.position[0],
                        lights.directional.position[1],
                        toNumber(event, lights.directional.position[2]),
                      ],
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="light-section">
            <h3>Point</h3>
            <div className="light-grid">
              {renderCommonFields('point-light', lights.point, 'point')}

              <div className="light-inline-field">
                <label htmlFor="point-light-pos-x">Position X</label>
                <input
                  id="point-light-pos-x"
                  type="number"
                  step={0.1}
                  value={lights.point.position[0]}
                  onChange={(event) =>
                    patchLight('point', {
                      position: [
                        toNumber(event, lights.point.position[0]),
                        lights.point.position[1],
                        lights.point.position[2],
                      ],
                    })
                  }
                />
              </div>

              <div className="light-inline-field">
                <label htmlFor="point-light-pos-y">Position Y</label>
                <input
                  id="point-light-pos-y"
                  type="number"
                  step={0.1}
                  value={lights.point.position[1]}
                  onChange={(event) =>
                    patchLight('point', {
                      position: [
                        lights.point.position[0],
                        toNumber(event, lights.point.position[1]),
                        lights.point.position[2],
                      ],
                    })
                  }
                />
              </div>

              <div className="light-inline-field">
                <label htmlFor="point-light-pos-z">Position Z</label>
                <input
                  id="point-light-pos-z"
                  type="number"
                  step={0.1}
                  value={lights.point.position[2]}
                  onChange={(event) =>
                    patchLight('point', {
                      position: [
                        lights.point.position[0],
                        lights.point.position[1],
                        toNumber(event, lights.point.position[2]),
                      ],
                    })
                  }
                />
              </div>

              <div className="light-inline-field">
                <label htmlFor="point-light-distance">Distance</label>
                <input
                  id="point-light-distance"
                  type="number"
                  min={0}
                  step={0.1}
                  value={lights.point.distance}
                  onChange={(event) =>
                    patchLight('point', {
                      distance: toNumber(event, lights.point.distance, 0),
                    })
                  }
                />
              </div>

              <div className="light-inline-field">
                <label htmlFor="point-light-decay">Decay</label>
                <input
                  id="point-light-decay"
                  type="number"
                  min={0}
                  step={0.1}
                  value={lights.point.decay}
                  onChange={(event) =>
                    patchLight('point', {
                      decay: toNumber(event, lights.point.decay, 0),
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

