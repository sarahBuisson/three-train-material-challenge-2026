import { useEffect, useMemo, useState, type ChangeEvent } from 'react'
import './MaterialControls.css'
import { MATERIAL_DEFINITIONS } from '../materialIntrospection/config'
import PropertiesComponent, { type PropertyField } from './PropertiesComponent'
import EnvironmentControl from './EnvironmentControl'
import LightControl from './LightControl'
import MaterialView from './MaterialView'
import type { EnvironmentSettings, LightSettings } from './Scene3D'

interface MaterialControlsProps {
  materialType: string
  onMaterialTypeChange: (type: string) => void
  materialProps: Record<string, unknown>
  onMaterialPropsChange: (props: Record<string, unknown>) => void
  geometryType?: 'scene' | 'box' | 'sphere' | 'cylinder' | 'uploaded'
  uploadedGeometryName?: string | null
  onGeometryTypeChange?: (
    type: 'scene' | 'box' | 'sphere' | 'cylinder' | 'uploaded'
  ) => void
  onGeometryUpload?: (file: File) => void
  availableGroups?: string[]
  selectedGroup?: string | null
  onSelectedGroupChange?: (group: string | null) => void
  environmentProps: EnvironmentSettings
  onEnvironmentPropsChange: (props: EnvironmentSettings) => void
  lightProps: LightSettings
  onLightPropsChange: (props: LightSettings) => void
}

type EditableField = PropertyField

const MATERIAL_TYPES = MATERIAL_DEFINITIONS.map((definition) => definition.name)

const toLabel = (key: string): string =>
  key
    .replace(/([A-Z])/g, ' $1')
    .replace(/\./g, ' / ')
    .replace(/^./, (s) => s.toUpperCase())

const getDefinition = (materialType: string) =>
  MATERIAL_DEFINITIONS.find((definition) => definition.name === materialType)

const getDefaultPropsFromDefinitions = (
  materialType: string
): Record<string, unknown> => {
  const definition = getDefinition(materialType)
  if (!definition?.parameterFields) {
    return {}
  }

  return definition.parameterFields.reduce<Record<string, unknown>>((acc, field) => {
    acc[field.key] = field.defaultValue
    return acc
  }, {})
}

const getEditableFieldsFromDefinitions = (materialType: string): EditableField[] => {
  const definition = getDefinition(materialType)
  if (!definition?.parameterFields) {
    return []
  }

  const priority = definition.priorityFields ?? []
  const priorityIndex = new Map(priority.map((key, index) => [key, index]))

  return [...definition.parameterFields]
    .sort((a, b) => {
      const aIndex = priorityIndex.get(a.key)
      const bIndex = priorityIndex.get(b.key)

      if (aIndex !== undefined && bIndex !== undefined) {
        return aIndex - bIndex
      }
      if (aIndex !== undefined) {
        return -1
      }
      if (bIndex !== undefined) {
        return 1
      }
      return a.key.localeCompare(b.key)
    })
    .map((field) => ({
      ...field,
      label: toLabel(field.key),
    }))
}

export default function MaterialControls({
  materialType,
  onMaterialTypeChange,
  materialProps,
  onMaterialPropsChange,
  geometryType = 'scene',
  uploadedGeometryName,
  onGeometryTypeChange,
  onGeometryUpload,
  availableGroups = [],
  selectedGroup = 'all',
  onSelectedGroupChange,
  environmentProps,
  onEnvironmentPropsChange,
  lightProps,
  onLightPropsChange,
}: MaterialControlsProps) {
  const [localProps, setLocalProps] = useState<Record<string, unknown>>(
    materialProps
  )

  const currentProperties = useMemo(
    () => getEditableFieldsFromDefinitions(materialType),
    [materialType]
  )

  useEffect(() => {
    setLocalProps(materialProps)
  }, [materialProps])

  const handleMaterialTypeChange = (newType: string) => {
    onMaterialTypeChange(newType)
    const newProps = getDefaultPropsFromDefinitions(newType)
    setLocalProps(newProps)
    onMaterialPropsChange(newProps)
  }

  const handlePropertyChange = (key: string, value: unknown) => {
    setLocalProps((previousProps) => {
      const newProps = { ...previousProps }

      if (value === undefined) {
        delete newProps[key]
      } else {
        newProps[key] = value
      }

      onMaterialPropsChange(newProps)
      return newProps
    })
  }

  const formatGroupLabel = (group: string): string => {
    if (group === 'all') return 'All Geometry'
    const match = group.match(/^group_(\d+)$/)
    return match ? `Group ${match[1]}` : group
  }

  const handleGeometryFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    onGeometryUpload?.(file)
    onGeometryTypeChange?.('uploaded')
    event.target.value = ''
  }

  return (
    <div className="material-controls">
<h1>Train Material</h1>
      <h2>Material Editor</h2>
      <div className="control-group">
        <label htmlFor="material-type">Material Type:</label>
        <select
          id="material-type"
          value={materialType}
          onChange={(e) => handleMaterialTypeChange(e.target.value)}
        >
          {MATERIAL_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {getDefinition(materialType) && (
          <p className="material-description">
            {getDefinition(materialType)?.description}
          </p>
        )}
      </div>

      <div className="control-group geometry-controls-group">
        <label htmlFor="geometry-source">Geometry:</label>
        <div className="geometry-controls-row">
          <div className="geometry-inline-field">
            <label htmlFor="geometry-source">Source</label>
            <select
              id="geometry-source"
              value={geometryType}
              onChange={(e) =>
                onGeometryTypeChange?.(
                  e.target.value as 'scene' | 'box' | 'sphere' | 'cylinder' | 'uploaded'
                )
              }
            >
              <option value="scene">scene.gltf (default)</option>
              <option value="box">Box</option>
              <option value="sphere">Sphere</option>
              <option value="cylinder">Cylinder</option>
              {uploadedGeometryName && (
                <option value="uploaded">{uploadedGeometryName}</option>
              )}
            </select>
          </div>

          <div className="geometry-inline-field">
            <label htmlFor="geometry-upload">Upload (.gltf/.glb)</label>
            <input
              id="geometry-upload"
              type="file"
              accept=".gltf,.glb,model/gltf+json,model/gltf-binary"
              onChange={handleGeometryFileUpload}
            />
          </div>
        </div>
      </div>

      {availableGroups && (
        <div className="control-group">
          <label htmlFor="geometry-group">Apply to:</label>
          <select
            id="geometry-group"
            value={selectedGroup ?? 'all'}
            onChange={(e) => onSelectedGroupChange?.(e.target.value || 'all')}
          >
            <option value="all">{formatGroupLabel('all')}</option>
            {availableGroups.map((group) => (
              <option key={group} value={group}>
                {formatGroupLabel(group)}
              </option>
            ))}
          </select>
        </div>
      )}


      <PropertiesComponent
        currentProperties={currentProperties}
        localProps={localProps}
        onPropertyChange={handlePropertyChange}
      />

      <h2>Scene detail</h2>
      <EnvironmentControl
          environment={environmentProps}
          onEnvironmentChange={onEnvironmentPropsChange}
      />

      <LightControl lights={lightProps} onLightsChange={onLightPropsChange} />

      <MaterialView materialType={materialType} materialProps={localProps} />

    </div>
  )
}

