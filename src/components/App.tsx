import { useEffect, useRef, useState } from 'react'
import Scene3D from './Scene3D'
import type { EnvironmentSettings, LightSettings } from './Scene3D'
import MaterialControls from './MaterialControls'
import { MATERIAL_DEFINITIONS } from '../materialIntrospection/config'
import './App.css'

const MOBILE_BREAKPOINT = 768
const DEFAULT_CONTROLS_WIDTH_PERCENT = 50
const MIN_CONTROLS_WIDTH = 320
const MIN_CANVAS_WIDTH = 320

const DEFAULT_ENVIRONMENT: EnvironmentSettings = {
  enabled: true,
  source: 'preset',
  preset: 'city',
  files: '',
  path: '',
  background: false,
  blur: 0,
  frames: 1,
  near: 1,
  far: 1000,
  resolution: 256,
  groundEnabled: false,
  groundHeight: 15,
  groundRadius: 60,
  groundScale: 100,
}

const DEFAULT_LIGHTS: LightSettings = {
  ambient: {
    enabled: true,
    color: '#ffffff',
    intensity: 0.5,
  },
  directional: {
    enabled: true,
    color: '#ffffff',
    intensity: 0.8,
    position: [5, 5, 5],
  },
  point: {
    enabled: true,
    color: '#ffffff',
    intensity: 0.3,
    position: [-5, -5, 5],
    distance: 0,
    decay: 2,
  },
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

const getDefaultPropsFromDefinitions = (
  materialType: string
): Record<string, unknown> => {
  const definition = MATERIAL_DEFINITIONS.find((d) => d.name === materialType)
  if (!definition?.parameterFields) {
    return {}
  }

  return definition.parameterFields.reduce<Record<string, unknown>>((acc, field) => {
    acc[field.key] = field.defaultValue
    return acc
  }, {})
}

function App() {
  const defaultMaterialType = 'MeshStandardMaterial'
  const containerRef = useRef<HTMLDivElement>(null)
  const [materialType, setMaterialType] = useState(defaultMaterialType)
  const [materialProps, setMaterialProps] = useState<Record<string, unknown>>(
    () => getDefaultPropsFromDefinitions(defaultMaterialType)
  )
  const [controlsWidthPercent, setControlsWidthPercent] = useState(
    DEFAULT_CONTROLS_WIDTH_PERCENT
  )
  const [isResizing, setIsResizing] = useState(false)
  const [geometryType, setGeometryType] = useState<
    'scene' | 'box' | 'sphere' | 'cylinder' | 'uploaded'
  >('scene')
  const [uploadedGeometryUrl, setUploadedGeometryUrl] = useState<string | null>(null)
  const [uploadedGeometryName, setUploadedGeometryName] = useState<string | null>(null)
  const [availableGroups, setAvailableGroups] = useState<string[]>([])
  const [selectedGroup, setSelectedGroup] = useState<string | null>('all')
  const [environmentProps, setEnvironmentProps] = useState<EnvironmentSettings>(
    DEFAULT_ENVIRONMENT
  )
  const [lightProps, setLightProps] = useState<LightSettings>(DEFAULT_LIGHTS)

  const defaultSceneUrl = `${import.meta.env.BASE_URL}scene.gltf`
  const activeGeometryUrl =
    geometryType === 'uploaded' && uploadedGeometryUrl ? uploadedGeometryUrl : defaultSceneUrl

  useEffect(() => {
    if (!isResizing) {
      return undefined
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current || window.innerWidth <= MOBILE_BREAKPOINT) {
        return
      }

      const bounds = containerRef.current.getBoundingClientRect()
      const maxControlsWidth = Math.max(MIN_CONTROLS_WIDTH, bounds.width - MIN_CANVAS_WIDTH)
      const nextControlsWidth = clamp(
        bounds.right - event.clientX,
        MIN_CONTROLS_WIDTH,
        maxControlsWidth
      )

      setControlsWidthPercent((nextControlsWidth / bounds.width) * 100)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isResizing])

  const handleResizeStart = () => {
    if (window.innerWidth <= MOBILE_BREAKPOINT) {
      return
    }

    setIsResizing(true)
  }

  const handleResizeReset = () => {
    setControlsWidthPercent(DEFAULT_CONTROLS_WIDTH_PERCENT)
  }

  const handleGeometryUpload = (file: File) => {
    const objectUrl = URL.createObjectURL(file)

    setUploadedGeometryUrl((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous)
      }
      return objectUrl
    })

    setUploadedGeometryName(file.name)
    setGeometryType('uploaded')
    setSelectedGroup('all')
  }

  useEffect(() => {
    return () => {
      if (uploadedGeometryUrl) {
        URL.revokeObjectURL(uploadedGeometryUrl)
      }
    }
  }, [uploadedGeometryUrl])

  useEffect(() => {
    if (selectedGroup !== 'all' && selectedGroup && !availableGroups.includes(selectedGroup)) {
      setSelectedGroup('all')
    }
  }, [availableGroups, selectedGroup])

  return (
    <div
      ref={containerRef}
      className={`app-container${isResizing ? ' is-resizing' : ''}`}
    >
      <div className="canvas-panel">
        <Scene3D
          geometryType={geometryType}
          modelUrl={activeGeometryUrl}
          materialType={materialType}
          materialProps={materialProps}
          environmentProps={environmentProps}
          lightProps={lightProps}
          selectedGroup={selectedGroup}
          onGroupsChange={setAvailableGroups}
        />
      </div>
      <button
        type="button"
        className="panel-resize-handle"
        onMouseDown={handleResizeStart}
        onDoubleClick={handleResizeReset}
        aria-label="Resize control panel"
        title="Click and drag to resize. Double-click to reset to 50%."
      >
        <span className="panel-resize-handle-bar" />
      </button>
      <div
        className="controls-panel"
        style={{ width: `clamp(${MIN_CONTROLS_WIDTH}px, ${controlsWidthPercent}%, calc(100% - ${MIN_CANVAS_WIDTH}px))` }}
      >
        <MaterialControls
          materialType={materialType}
          onMaterialTypeChange={setMaterialType}
          materialProps={materialProps}
          onMaterialPropsChange={setMaterialProps}
          geometryType={geometryType}
          uploadedGeometryName={uploadedGeometryName}
          onGeometryTypeChange={setGeometryType}
          onGeometryUpload={handleGeometryUpload}
          availableGroups={availableGroups}
          selectedGroup={selectedGroup}
          onSelectedGroupChange={setSelectedGroup}
          environmentProps={environmentProps}
          onEnvironmentPropsChange={setEnvironmentProps}
          lightProps={lightProps}
          onLightPropsChange={setLightProps}
        />

      </div>
    </div>
  )
}

export default App
