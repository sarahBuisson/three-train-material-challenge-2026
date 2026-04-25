import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls, useGLTF, useTexture } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { createMaterialFromType } from '../materialIntrospection'

export type EnvironmentSource = 'preset' | 'files'
export type EnvironmentPreset =
  | 'apartment'
  | 'city'
  | 'dawn'
  | 'forest'
  | 'lobby'
  | 'night'
  | 'park'
  | 'studio'
  | 'sunset'
  | 'warehouse'

export interface EnvironmentSettings {
  enabled: boolean
  source: EnvironmentSource
  preset: EnvironmentPreset
  files: string
  path: string
  background: boolean
  blur: number
  frames: number
  near: number
  far: number
  resolution: number
  groundEnabled: boolean
  groundHeight: number
  groundRadius: number
  groundScale: number
}

export interface AmbientLightSettings {
  enabled: boolean
  color: string
  intensity: number
}

export interface DirectionalLightSettings extends AmbientLightSettings {
  position: [number, number, number]
}

export interface PointLightSettings extends DirectionalLightSettings {
  distance: number
  decay: number
}

export interface LightSettings {
  ambient: AmbientLightSettings
  directional: DirectionalLightSettings
  point: PointLightSettings
}

interface SharedMaterialProps {
  materialType: string
  materialProps: Record<string, unknown>
}

interface Scene3DProps extends SharedMaterialProps {
  geometryType: 'scene' | 'box' | 'sphere' | 'cylinder' | 'uploaded'
  modelUrl: string
  environmentProps: EnvironmentSettings
  lightProps: LightSettings
  selectedGroup?: string | null
  onGroupsChange?: (groups: string[]) => void
}

const useLoadedTexturesByKey = (materialProps: Record<string, unknown>) => {
  const textureEntries = useMemo(
    () =>
      Object.entries(materialProps).filter(
        ([key, value]) =>
          /(Map|matcap)$/i.test(key) && typeof value === 'string' && value.trim() !== ''
      ) as Array<[string, string]>,
    [materialProps]
  )

  const textureUrls = useMemo(
    () => textureEntries.map(([, textureUrl]) => textureUrl),
    [textureEntries]
  )

  const loadedTextures = useTexture(textureUrls)

  return useMemo(() => {
    const texturesArray = Array.isArray(loadedTextures)
      ? loadedTextures
      : [loadedTextures]
    const textureByUrl = new Map<string, THREE.Texture>()

    textureUrls.forEach((url, index) => {
      const texture = texturesArray[index]
      if (texture) {
        textureByUrl.set(url, texture)
      }
    })

    return textureEntries.reduce<Record<string, THREE.Texture>>((acc, [key, url]) => {
      const texture = textureByUrl.get(url)
      if (texture) {
        acc[key] = texture
      }
      return acc
    }, {})
  }, [loadedTextures, textureEntries, textureUrls])
}

function GltfModel({
  modelUrl,
  materialType,
  materialProps,
  selectedGroup,
  onGroupsChange,
}: Omit<Scene3DProps, 'geometryType' | 'environmentProps' | 'lightProps'>) {
  const { scene } = useGLTF(modelUrl)
  const groupRef = useRef<THREE.Group>(null)
  const loadedTexturesByKey = useLoadedTexturesByKey(materialProps)

  useEffect(() => {
    const groups: string[] = []
    const seenGroupIndices = new Set<number>()

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.geometry?.groups?.length > 0) {
        const geometryGroups = (child.geometry as THREE.BufferGeometry).groups
        geometryGroups.forEach((_, index: number) => {
          if (!seenGroupIndices.has(index)) {
            groups.push(`group_${index}`)
            seenGroupIndices.add(index)
          }
        })
      }
    })

    onGroupsChange?.(groups)
  }, [scene, onGroupsChange])

  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const material = createMaterialFromType(
          materialType,
          materialProps,
          loadedTexturesByKey
        )

        if (!selectedGroup || selectedGroup === 'all') {
          child.material = material
          return
        }

        const groupMatch = selectedGroup.match(/^group_(\d+)$/)
        if (groupMatch) {
          const groupIndex = parseInt(groupMatch[1], 10)
          if (child.geometry?.groups && child.geometry.groups[groupIndex]) {
            child.material = material
          }
        }
      }
    })
  }, [loadedTexturesByKey, materialType, materialProps, scene, selectedGroup])

  return <primitive ref={groupRef} object={scene} />
}

function PrimitiveModel({
  geometryType,
  materialType,
  materialProps,
  onGroupsChange,
}: Pick<Scene3DProps, 'geometryType' | 'materialType' | 'materialProps' | 'onGroupsChange'>) {
  const loadedTexturesByKey = useLoadedTexturesByKey(materialProps)

  const material = useMemo(
    () => createMaterialFromType(materialType, materialProps, loadedTexturesByKey),
    [loadedTexturesByKey, materialProps, materialType]
  )

  useEffect(() => {
    onGroupsChange?.([])
  }, [geometryType, onGroupsChange])

  useEffect(() => {
    return () => {
      material.dispose()
    }
  }, [material])

  return (
    <mesh material={material}>
      {geometryType === 'box' && <boxGeometry args={[1.5, 1.5, 1.5]} />}
      {geometryType === 'sphere' && <sphereGeometry args={[1, 48, 32]} />}
      {geometryType === 'cylinder' && <cylinderGeometry args={[0.8, 0.8, 1.6, 32]} />}
    </mesh>
  )
}

export default function Scene3D({
  geometryType,
  modelUrl,
  materialType,
  materialProps,
  environmentProps,
  lightProps,
  selectedGroup,
  onGroupsChange,
}: Scene3DProps) {
  const isModelGeometry = geometryType === 'scene' || geometryType === 'uploaded'
  const environmentGround = environmentProps.groundEnabled
    ? {
        height: environmentProps.groundHeight,
        radius: environmentProps.groundRadius,
        scale: environmentProps.groundScale,
      }
    : undefined

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      {lightProps.ambient.enabled && (
        <ambientLight color={lightProps.ambient.color} intensity={lightProps.ambient.intensity} />
      )}
      {lightProps.directional.enabled && (
        <directionalLight
          color={lightProps.directional.color}
          position={lightProps.directional.position}
          intensity={lightProps.directional.intensity}
        />
      )}
      {lightProps.point.enabled && (
        <pointLight
          color={lightProps.point.color}
          position={lightProps.point.position}
          intensity={lightProps.point.intensity}
          distance={lightProps.point.distance}
          decay={lightProps.point.decay}
        />
      )}

      {environmentProps.enabled && (
        <Environment
          background={environmentProps.background}
          blur={environmentProps.blur}
          frames={environmentProps.frames}
          near={environmentProps.near}
          far={environmentProps.far}
          resolution={environmentProps.resolution}
          ground={environmentGround}
          preset={environmentProps.source === 'preset' ? environmentProps.preset : undefined}
          files={
            environmentProps.source === 'files' && environmentProps.files.trim() !== ''
              ? environmentProps.files.trim()
              : undefined
          }
          path={
            environmentProps.source === 'files' && environmentProps.path.trim() !== ''
              ? environmentProps.path.trim()
              : undefined
          }
        />
      )}

      {isModelGeometry ? (
        <GltfModel
          modelUrl={modelUrl}
          materialType={materialType}
          materialProps={materialProps}
          selectedGroup={selectedGroup}
          onGroupsChange={onGroupsChange}
        />
      ) : (
        <PrimitiveModel
          geometryType={geometryType}
          materialType={materialType}
          materialProps={materialProps}
          onGroupsChange={onGroupsChange}
        />
      )}

      <OrbitControls />
    </Canvas>
  )
}
