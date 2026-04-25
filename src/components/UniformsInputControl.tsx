import { useMemo } from 'react'
import type { UniformPrimitiveValue, UniformsValue } from '../materialIntrospection/types'

interface UniformsInputControlProps {
  id: string
  value: UniformsValue
  onChange: (value: UniformsValue) => void
}

const parseUniformValue = (rawValue: string): UniformPrimitiveValue => {
  const trimmedValue = rawValue.trim()

  if (trimmedValue === 'true') {
    return true
  }

  if (trimmedValue === 'false') {
    return false
  }

  if (trimmedValue !== '' && !Number.isNaN(Number(trimmedValue))) {
    return Number(trimmedValue)
  }

  return rawValue
}

const formatUniformValue = (value: UniformPrimitiveValue): string => String(value)

export default function UniformsInputControl({
  id,
  value,
  onChange,
}: UniformsInputControlProps) {
  const uniformEntries = useMemo(() => Object.entries(value ?? {}), [value])

  const addUniform = () => {
    let index = 1
    let candidateKey = `uValue${index}`

    while (candidateKey in value) {
      index += 1
      candidateKey = `uValue${index}`
    }

    onChange({
      ...value,
      [candidateKey]: 0,
    })
  }

  const removeUniform = (uniformKey: string) => {
    const nextValue: UniformsValue = { ...value }
    delete nextValue[uniformKey]
    onChange(nextValue)
  }

  const renameUniform = (previousKey: string, nextKeyRaw: string) => {
    const nextKey = nextKeyRaw.trim()
    if (!nextKey || nextKey === previousKey) {
      return
    }

    const nextValue: UniformsValue = {}
    Object.entries(value).forEach(([key, uniformValue]) => {
      if (key === previousKey) {
        nextValue[nextKey] = uniformValue
        return
      }

      nextValue[key] = uniformValue
    })

    onChange(nextValue)
  }

  const updateUniformValue = (uniformKey: string, rawValue: string) => {
    onChange({
      ...value,
      [uniformKey]: parseUniformValue(rawValue),
    })
  }

  return (
    <div id={id} className="uniforms-input-control">
      <div className="uniforms-list">
        {uniformEntries.length === 0 ? (
          <p className="uniforms-empty">No uniforms yet.</p>
        ) : (
          uniformEntries.map(([uniformKey, uniformValue]) => (
            <div key={uniformKey} className="uniform-row">
              <input
                type="text"
                defaultValue={uniformKey}
                onBlur={(e) => renameUniform(uniformKey, e.target.value)}
                className="uniform-key-input"
                aria-label={`Uniform name ${uniformKey}`}
              />
              <input
                type="text"
                value={formatUniformValue(uniformValue)}
                onChange={(e) => updateUniformValue(uniformKey, e.target.value)}
                className="uniform-value-input"
                aria-label={`Uniform value for ${uniformKey}`}
              />
              <button
                type="button"
                onClick={() => removeUniform(uniformKey)}
                className="uniform-remove-button"
                aria-label={`Remove uniform ${uniformKey}`}
              >
                x
              </button>
            </div>
          ))
        )}
      </div>
      <button type="button" onClick={addUniform} className="uniform-add-button">
        + Add uniform
      </button>
    </div>
  )
}


