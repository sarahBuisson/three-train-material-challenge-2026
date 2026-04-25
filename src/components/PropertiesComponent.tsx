import { useState } from 'react'
import ColorInputControl from './ColorInputControl'
import TextureInputControl from './TextureInputControl'
import { MATERIAL_FIELD_DEFINITIONS } from '../materialIntrospection/config'
import type {
  ParameterFieldHint,
  UniformPrimitiveValue,
  UniformsValue,
  Vector2Value,
} from '../materialIntrospection/types'
import UniformsInputControl from './UniformsInputControl'

export type PropertyField = ParameterFieldHint & { label: string }

interface PropertiesComponentProps {
  currentProperties: PropertyField[]
  localProps: Record<string, unknown>
  onPropertyChange: (key: string, value: unknown) => void
}

const isUniformPrimitiveValue = (value: unknown): value is UniformPrimitiveValue =>
  typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'

const readUniformsValue = (
  localProps: Record<string, unknown>,
  defaultValue: unknown
): UniformsValue => {
  const uniforms: UniformsValue = {}

  if (defaultValue && typeof defaultValue === 'object') {
    Object.entries(defaultValue as Record<string, unknown>).forEach(([key, value]) => {
      if (isUniformPrimitiveValue(value)) {
        uniforms[key] = value
      }
    })
  }

  const directUniforms = localProps.uniforms
  if (directUniforms && typeof directUniforms === 'object') {
    Object.entries(directUniforms as Record<string, unknown>).forEach(([key, value]) => {
      if (isUniformPrimitiveValue(value)) {
        uniforms[key] = value
      }
    })
  }

  Object.entries(localProps).forEach(([key, value]) => {
    if (!key.startsWith('uniforms.')) {
      return
    }

    const uniformName = key.slice('uniforms.'.length)
    if (uniformName && isUniformPrimitiveValue(value)) {
      uniforms[uniformName] = value
    }
  })

  return uniforms
}

const readVector2 = (
  localProps: Record<string, unknown>,
  key: string,
  defaultValue: unknown
): Vector2Value => {
  const value = localProps[key]
  if (
    value &&
    typeof value === 'object' &&
    typeof (value as Vector2Value).x === 'number' &&
    typeof (value as Vector2Value).y === 'number'
  ) {
    return value as Vector2Value
  }

  if (
    defaultValue &&
    typeof defaultValue === 'object' &&
    typeof (defaultValue as Vector2Value).x === 'number' &&
    typeof (defaultValue as Vector2Value).y === 'number'
  ) {
    return defaultValue as Vector2Value
  }

  return { x: 0, y: 0 }
}

export default function PropertiesComponent({
  currentProperties,
  localProps,
  onPropertyChange,
}: PropertiesComponentProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="properties-container">
      <div className="collapsible-header-row">
        <h3>Properties</h3>
        <button
          type="button"
          className="collapsible-toggle-button"
          onClick={() => setIsExpanded((previous) => !previous)}
          aria-expanded={isExpanded}
          aria-controls="properties-controls-content"
        >
          {isExpanded ? 'Hide' : 'Show'}
        </button>
      </div>

      {isExpanded &&
        (currentProperties.length === 0 ? (
          <p className="no-properties" id="properties-controls-content">
            No properties available
          </p>
        ) : (
          <div id="properties-controls-content">
            {currentProperties.map((prop) => {
              const fieldDefinition =
                MATERIAL_FIELD_DEFINITIONS[prop.key] ?? 'No definition available.'

              return (
                <div key={prop.key} className="control-group">
                  <label htmlFor={prop.key}>{prop.label}:</label>
                  <div className="field-input-with-help">
                    {prop.type === 'color' && (
                      <ColorInputControl
                        id={prop.key}
                        value={
                          ((localProps[prop.key] as string | undefined) ??
                            prop.defaultValue) as string
                        }
                        onChange={(value) => onPropertyChange(prop.key, value)}
                      />
                    )}
                    {prop.type === 'number' && (
                      <>
                        {prop.min !== undefined && prop.max !== undefined ? (
                          <input
                            id={prop.key}
                            type="range"
                            min={prop.min}
                            max={prop.max}
                            step={prop.step ?? 0.01}
                            value={
                              ((localProps[prop.key] as number | undefined) ??
                                prop.defaultValue) as number
                            }
                            onChange={(e) =>
                              onPropertyChange(prop.key, parseFloat(e.target.value))
                            }
                            className="slider"
                          />
                        ) : (
                          <input
                            id={prop.key}
                            type="number"
                            step={prop.step ?? 0.01}
                            value={
                              ((localProps[prop.key] as number | undefined) ??
                                prop.defaultValue) as number
                            }
                            onChange={(e) =>
                              onPropertyChange(prop.key, parseFloat(e.target.value))
                            }
                          />
                        )}
                        <span className="value-display">
                          {Number(
                            (localProps[prop.key] as number | undefined) ?? prop.defaultValue
                          ).toFixed(2)}
                        </span>
                      </>
                    )}
                    {prop.type === 'boolean' && (
                      <input
                        id={prop.key}
                        type="checkbox"
                        checked={Boolean(
                          (localProps[prop.key] as boolean | undefined) ?? prop.defaultValue
                        )}
                        onChange={(e) => onPropertyChange(prop.key, e.target.checked)}
                        className="checkbox"
                      />
                    )}
                    {prop.type === 'texture' && (
                      <TextureInputControl
                        id={prop.key}
                        value={
                          ((localProps[prop.key] as string | undefined) ??
                            (prop.defaultValue as string)) as string
                        }
                        onChange={(value) => onPropertyChange(prop.key, value)}
                      />
                    )}
                    {prop.type === 'text' && (
                      <textarea
                        id={prop.key}
                        value={
                          ((localProps[prop.key] as string | undefined) ??
                            (prop.defaultValue as string)) as string
                        }
                        onChange={(e) => onPropertyChange(prop.key, e.target.value)}
                        rows={6}
                      />
                    )}
                    {prop.type === 'vector2' && (
                      <>
                        {(() => {
                          const vector = readVector2(localProps, prop.key, prop.defaultValue)
                          return (
                            <>
                              <input
                                id={`${prop.key}-x`}
                                type="number"
                                step={prop.step ?? 0.01}
                                value={vector.x}
                                onChange={(e) =>
                                  onPropertyChange(prop.key, {
                                    ...vector,
                                    x: parseFloat(e.target.value),
                                  })
                                }
                              />
                              <input
                                id={`${prop.key}-y`}
                                type="number"
                                step={prop.step ?? 0.01}
                                value={vector.y}
                                onChange={(e) =>
                                  onPropertyChange(prop.key, {
                                    ...vector,
                                    y: parseFloat(e.target.value),
                                  })
                                }
                              />
                            </>
                          )
                        })()}
                      </>
                    )}
                    {prop.type === 'uniforms' && (
                      <UniformsInputControl
                        id={prop.key}
                        value={readUniformsValue(localProps, prop.defaultValue)}
                        onChange={(nextUniforms) => {
                          const previousUniforms = readUniformsValue(localProps, prop.defaultValue)

                          onPropertyChange(prop.key, nextUniforms)

                          Object.keys(previousUniforms).forEach((uniformKey) => {
                            if (!(uniformKey in nextUniforms)) {
                              onPropertyChange(`uniforms.${uniformKey}`, undefined)
                            }
                          })

                          Object.entries(nextUniforms).forEach(([uniformKey, uniformValue]) => {
                            onPropertyChange(`uniforms.${uniformKey}`, uniformValue)
                          })
                        }}
                      />
                    )}
                    <span
                      className="field-help-tooltip"
                      title={fieldDefinition}
                      aria-label={fieldDefinition}
                    >
                      ?
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        ))}
    </div>
  )
}

