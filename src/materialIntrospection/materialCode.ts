import { MATERIAL_DEFINITIONS } from './config'

type MaterialProps = Record<string, unknown>

const INDENT = '  '

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === 'object' && !Array.isArray(value)

const isHexColor = (value: string): boolean => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value)

const formatString = (value: string): string => {
  if (value.includes('\n')) {
    return `\`${value.replace(/`/g, '\\`')}\``
  }

  return JSON.stringify(value)
}

const toR3FTag = (materialType: string): string =>
  materialType.length > 0 ? `${materialType[0].toLowerCase()}${materialType.slice(1)}` : 'meshStandardMaterial'

const deepEqual = (left: unknown, right: unknown): boolean => {
  if (left === right) {
    return true
  }

  if (Array.isArray(left) && Array.isArray(right)) {
    if (left.length !== right.length) {
      return false
    }

    return left.every((item, index) => deepEqual(item, right[index]))
  }

  if (isPlainObject(left) && isPlainObject(right)) {
    const leftKeys = Object.keys(left)
    const rightKeys = Object.keys(right)
    if (leftKeys.length !== rightKeys.length) {
      return false
    }

    return leftKeys.every((key) => deepEqual(left[key], right[key]))
  }

  return false
}

const removeDefaults = (current: unknown, defaults: unknown): unknown => {
  if (defaults === undefined) {
    return current
  }

  if (deepEqual(current, defaults)) {
    return undefined
  }

  if (isPlainObject(current) && isPlainObject(defaults)) {
    const next: Record<string, unknown> = {}

    Object.entries(current).forEach(([key, value]) => {
      const filteredValue = removeDefaults(value, defaults[key])
      if (filteredValue !== undefined) {
        next[key] = filteredValue
      }
    })

    return Object.keys(next).length > 0 ? next : undefined
  }

  return current
}

const formatValue = (key: string, value: unknown, depth = 1): string => {
  if (typeof value === 'string') {
    if (key.startsWith('uniforms.') && isHexColor(value)) {
      return `new THREE.Color(${JSON.stringify(value)})`
    }
    return formatString(value)
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => formatValue(key, item, depth + 1)).join(', ')}]`
  }

  if (isPlainObject(value)) {
    const isVector2 = typeof value.x === 'number' && typeof value.y === 'number'
    if (isVector2 && Object.keys(value).length === 2) {
      return `new THREE.Vector2(${value.x}, ${value.y})`
    }

    const entries = Object.entries(value)
    if (entries.length === 0) {
      return '{}'
    }

    const spacing = INDENT.repeat(depth)
    const nestedSpacing = INDENT.repeat(depth + 1)
    const content = entries
      .map(([entryKey, entryValue]) => {
        const nestedKey = key === 'uniforms' ? `uniforms.${entryKey}` : entryKey
        const renderedValue = formatValue(nestedKey, entryValue, depth + 1)

        if (key === 'uniforms') {
          return `${nestedSpacing}${entryKey}: { value: ${renderedValue} }`
        }

        return `${nestedSpacing}${entryKey}: ${renderedValue}`
      })
      .join(',\n')

    return `{\n${content}\n${spacing}}`
  }

  if (value === undefined) {
    return 'undefined'
  }

  if (value === null) {
    return 'null'
  }

  return JSON.stringify(value)
}

const buildDefaults = (materialType: string): MaterialProps => {
  const definition = MATERIAL_DEFINITIONS.find((item) => item.name === materialType)
  if (!definition?.parameterFields) {
    return {}
  }

  return definition.parameterFields.reduce<MaterialProps>((acc, field) => {
    acc[field.key] = field.defaultValue
    return acc
  }, {})
}

const getDefinition = (materialType: string) =>
  MATERIAL_DEFINITIONS.find((item) => item.name === materialType)

const orderKeys = (materialType: string, source: MaterialProps): string[] => {
  const definition = getDefinition(materialType)
  const priority = definition?.priorityFields ?? []
  const seen = new Set<string>()
  const ordered: string[] = []

  priority.forEach((key) => {
    if (key in source) {
      ordered.push(key)
      seen.add(key)
    }
  })

  Object.keys(source)
    .filter((key) => !seen.has(key))
    .sort((a, b) => a.localeCompare(b))
    .forEach((key) => ordered.push(key))

  return ordered
}

const normalizeUniforms = (source: MaterialProps): MaterialProps => {
  const normalized: MaterialProps = {}
  const uniforms = isPlainObject(source.uniforms) ? { ...source.uniforms } : {}

  Object.entries(source).forEach(([key, value]) => {
    if (key === 'uniforms') {
      return
    }

    if (key.startsWith('uniforms.')) {
      const uniformName = key.slice('uniforms.'.length)
      if (uniformName) {
        uniforms[uniformName] = value
      }
      return
    }

    normalized[key] = value
  })

  if (Object.keys(uniforms).length > 0) {
    normalized.uniforms = uniforms
  }

  return normalized
}

const toFilteredProps = (materialType: string, materialProps: MaterialProps): MaterialProps => {
  const normalizedDefaults = normalizeUniforms(buildDefaults(materialType))
  const normalizedCurrent = normalizeUniforms(materialProps)
  const filtered = removeDefaults(normalizedCurrent, normalizedDefaults)

  return isPlainObject(filtered) ? filtered : {}
}

export function buildMaterialCode(materialType: string, materialProps: MaterialProps): string {
  const filteredProps = toFilteredProps(materialType, materialProps)

  const orderedKeys = orderKeys(materialType, filteredProps)
  const body = orderedKeys
    .map((key) => `${INDENT}${key}: ${formatValue(key, filteredProps[key], 1)}`)
    .join(',\n')

  return `import * as THREE from 'three'\n\nconst material = new THREE.${materialType}({\n${body}\n})`
}

const formatR3FProp = (key: string, value: unknown): string => {
  if (typeof value === 'string') {
    if (value.includes('\n')) {
      return `${key}={${formatString(value)}}`
    }

    return `${key}=${JSON.stringify(value)}`
  }

  return `${key}={${formatValue(key, value, 1)}}`
}

export function buildReactMaterialCode(materialType: string, materialProps: MaterialProps): string {
  const filteredProps = toFilteredProps(materialType, materialProps)
  const orderedKeys = orderKeys(materialType, filteredProps)
  const materialTag = toR3FTag(materialType)

  if (orderedKeys.length === 0) {
    return `function MaterialPreview() {\n  return (\n    <mesh>\n      <${materialTag} />\n    </mesh>\n  )\n}`
  }

  const propsBlock = orderedKeys
    .map((key) => `${INDENT}${formatR3FProp(key, filteredProps[key])}`)
    .join('\n')

  return `function MaterialPreview() {\n  return (\n    <mesh>\n      <${materialTag}\n${propsBlock
      .split('\n')
      .map((line) => `${INDENT}${line}`)
      .join('\n')}\n      />\n    </mesh>\n  )\n}`
}




