import * as THREE from 'three'
import { MATERIAL_FACTORIES } from './config'
import type { Vector2Value } from './types'
import { Color, DoubleSide, type Material, ShaderMaterial, Texture, Vector2 } from 'three';

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
  loadedTexturesByKey: Record<string, Texture> = {}
): Material {
  const factory = MATERIAL_FACTORIES[materialType] ?? MATERIAL_FACTORIES.MeshStandardMaterial
  const material = factory()
  const templateRecord = material as unknown as Record<string, unknown>

  if ('side' in templateRecord) {
    templateRecord.side = DoubleSide
  }

  Object.entries(props).forEach(([key, value]) => {
    if (
      key === 'uniforms' &&
      value &&
      typeof value === 'object' &&
      material instanceof ShaderMaterial
    ) {
      Object.entries(value as Record<string, unknown>).forEach(([uniformName, uniformValue]) => {
        const uniform = material.uniforms[uniformName]
        if (!uniform) {
          return
        }

        if (uniform.value instanceof Color && typeof uniformValue === 'string') {
          uniform.value = new Color(uniformValue)
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
      templateRecord[key] = new Color(value)
      return
    }

    if (templateValue instanceof Vector2 && isVector2Value(value)) {
      templateRecord[key] = new Vector2(value.x, value.y)
      return
    }

    templateRecord[key] = value
  })

  return material
}

