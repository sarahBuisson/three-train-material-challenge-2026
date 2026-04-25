import * as THREE from 'three'
import { MATERIAL_FACTORIES } from './config'
import type { Vector2Value } from './types'

function isVector2Value(value: unknown): value is Vector2Value {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as { x?: unknown; y?: unknown }
  return typeof candidate.x === 'number' && typeof candidate.y === 'number'
}

export function createMaterialFromType(
  materialType: string,
  props: Record<string, unknown>,
  loadedTexturesByKey: Record<string, THREE.Texture> = {}
): THREE.Material {
  const factory = MATERIAL_FACTORIES[materialType] ?? MATERIAL_FACTORIES.MeshStandardMaterial
  const material = factory()
  const templateRecord = material as unknown as Record<string, unknown>

  if ('side' in templateRecord) {
    templateRecord.side = THREE.DoubleSide
  }

  Object.entries(props).forEach(([key, value]) => {
    if (
      key === 'uniforms' &&
      value &&
      typeof value === 'object' &&
      material instanceof THREE.ShaderMaterial
    ) {
      Object.entries(value as Record<string, unknown>).forEach(([uniformName, uniformValue]) => {
        const uniform = material.uniforms[uniformName]
        if (!uniform) {
          return
        }

        if (uniform.value instanceof THREE.Color && typeof uniformValue === 'string') {
          uniform.value = new THREE.Color(uniformValue)
          return
        }

        uniform.value = uniformValue
      })
      return
    }

    if (key.startsWith('uniforms.') && material instanceof THREE.ShaderMaterial) {
      const uniformName = key.replace('uniforms.', '')
      const uniform = material.uniforms[uniformName]
      if (!uniform) {
        return
      }

      if (uniform.value instanceof THREE.Color && typeof value === 'string') {
        uniform.value = new THREE.Color(value)
        return
      }

      uniform.value = value
      return
    }

    const isTextureKey = /(Map|matcap)$/i.test(key)
    if (isTextureKey) {
      console.log("texture")
      if (loadedTexturesByKey[key]) {
        templateRecord[key] = loadedTexturesByKey[key]
        return
      }

      if (typeof value === 'string' && value.trim() !== '') {
        const loader = new THREE.TextureLoader()
        templateRecord[key] = loader.load(value)
      }
      return
    }

    if (!(key in templateRecord)) {
      return
    }

    const templateValue = templateRecord[key]
    if (templateValue instanceof THREE.Color && typeof value === 'string') {
      templateRecord[key] = new THREE.Color(value)
      return
    }

    if (templateValue instanceof THREE.Vector2 && isVector2Value(value)) {
      templateRecord[key] = new THREE.Vector2(value.x, value.y)
      return
    }

    templateRecord[key] = value
  })

  return material
}

