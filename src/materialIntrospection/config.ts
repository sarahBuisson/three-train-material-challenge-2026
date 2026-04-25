import * as THREE from 'three'
import type { MaterialDefinition, MaterialFactory } from './types'


export const MATERIAL_DEFINITIONS: MaterialDefinition[] = [

    {
        name: 'MeshBasicMaterial',
        description: 'An unlit material for flat color and texture rendering.',
        factory: (param) => new THREE.MeshBasicMaterial(param),
        parameterFields: [
            {key: 'color', type: 'color', defaultValue: '#ffffff'},
            {key: 'opacity', type: 'number', defaultValue: 1, min: 0, max: 1, step: 0.01},
            {key: 'transparent', type: 'boolean', defaultValue: false},
            {key: 'wireframe', type: 'boolean', defaultValue: false},
            {key: 'map', type: 'texture', defaultValue: ''},
            {key: 'alphaMap', type: 'texture', defaultValue: ''},
            {key: 'aoMap', type: 'texture', defaultValue: ''},
            {key: 'lightMap', type: 'texture', defaultValue: ''},
            {key: 'envMap', type: 'texture', defaultValue: ''},
        ],
        priorityFields: ['color', 'opacity', 'transparent', 'wireframe'],
    },
    {
        name: 'MeshNormalMaterial',
        description: 'A material that maps the normal vectors to RGB colors.',
        factory: (param) => new THREE.MeshNormalMaterial(param),
        parameterFields: [
            {key: 'bumpMap', type: 'texture', defaultValue: ''},
            {key: 'normalMap', type: 'texture', defaultValue: ''},
            {key: 'displacementMap', type: 'texture', defaultValue: ''},
            {
                key: 'normalScale',
                type: 'vector2',
                defaultValue: {x: 1, y: 1},
                step: 0.01,
            },
            {key: 'wireframe', type: 'boolean', defaultValue: false},
            {key: 'flatShading', type: 'boolean', defaultValue: false},
        ],
        priorityFields: ['wireframe', 'flatShading'],
    },
    {
        name: 'MeshPhongMaterial',
        description: 'A phong-lit material with specular highlights.',
        factory: (param) => new THREE.MeshPhongMaterial(param),
        parameterFields: [
            {key: 'color', type: 'color', defaultValue: '#ffffff'},
            {key: 'emissive', type: 'color', defaultValue: '#000000'},
            {key: 'shininess', type: 'number', defaultValue: 30, min: 0, max: 200, step: 1},
            {key: 'specular', type: 'color', defaultValue: '#111111'},
            {key: 'wireframe', type: 'boolean', defaultValue: false},
            {key: 'map', type: 'texture', defaultValue: ''},
            {key: 'specularMap', type: 'texture', defaultValue: ''},
            {key: 'emissiveMap', type: 'texture', defaultValue: ''},
            {key: 'normalMap', type: 'texture', defaultValue: ''},
            {key: 'bumpMap', type: 'texture', defaultValue: ''},
            {key: 'displacementMap', type: 'texture', defaultValue: ''},
        ],
        priorityFields: ['color', 'emissive', 'shininess', 'specular', 'wireframe'],
    },
    {
        name: 'MeshStandardMaterial',
        description: 'A physically based material using metalness and roughness.',
        factory: (param) => new THREE.MeshStandardMaterial(param),
        parameterFields: [
            {key: 'color', type: 'color', defaultValue: '#ffffff'},
            {key: 'metalness', type: 'number', defaultValue: 0, min: 0, max: 1, step: 0.01},
            {key: 'roughness', type: 'number', defaultValue: 1, min: 0, max: 1, step: 0.01},
            {key: 'emissive', type: 'color', defaultValue: '#000000'},
            {key: 'wireframe', type: 'boolean', defaultValue: false},
            {key: 'map', type: 'texture', defaultValue: ''},
            {key: 'normalMap', type: 'texture', defaultValue: ''},
            {key: 'roughnessMap', type: 'texture', defaultValue: ''},
            {key: 'metalnessMap', type: 'texture', defaultValue: ''},
            {key: 'envMap', type: 'texture', defaultValue: ''},
            {key: 'aoMap', type: 'texture', defaultValue: ''},
            {key: 'alphaMap', type: 'texture', defaultValue: ''},
            {key: 'lightMap', type: 'texture', defaultValue: ''},
        ],
        priorityFields: ['color', 'map', 'metalness', 'roughness', 'emissive', 'wireframe'],
    },
    {
        name: 'MeshLambertMaterial',
        description: 'A non-PBR diffuse lambert material.',
        factory: (param) => new THREE.MeshLambertMaterial(param),
        parameterFields: [
            {key: 'color', type: 'color', defaultValue: '#ffffff'},
            {key: 'emissive', type: 'color', defaultValue: '#000000'},
            {key: 'wireframe', type: 'boolean', defaultValue: false},
            {key: 'map', type: 'texture', defaultValue: ''},
            {key: 'emissiveMap', type: 'texture', defaultValue: ''},
            {key: 'normalMap', type: 'texture', defaultValue: ''},
            {key: 'bumpMap', type: 'texture', defaultValue: ''},
            {key: 'displacementMap', type: 'texture', defaultValue: ''},
            {key: 'alphaMap', type: 'texture', defaultValue: ''},
        ],
        priorityFields: ['color', 'emissive', 'wireframe'],
    },
    {
        name: 'MeshMatcapMaterial',
        description: 'A material using a matcap texture for baked lighting look.',
        factory: (param) => new THREE.MeshMatcapMaterial(param),
        parameterFields: [
            {key: 'color', type: 'color', defaultValue: '#ffffff'},
            {key: 'flatShading', type: 'boolean', defaultValue: false},
            {key: 'opacity', type: 'number', defaultValue: 1, min: 0, max: 1, step: 0.01},
            {key: 'transparent', type: 'boolean', defaultValue: false},
            {key: 'matcap', type: 'texture', defaultValue: ''},
            {key: 'map', type: 'texture', defaultValue: ''},
            {key: 'bumpMap', type: 'texture', defaultValue: ''},
            {key: 'normalMap', type: 'texture', defaultValue: ''},
            {key: 'displacementMap', type: 'texture', defaultValue: ''},
            {key: 'alphaMap', type: 'texture', defaultValue: ''},
            {
                key: 'normalScale',
                type: 'vector2',
                defaultValue: {x: 1, y: 1},
                step: 0.01,
            },
            {
                key: 'wireframeLinewidth',
                type: 'number',
                defaultValue: 1,
                min: 0,
                max: 10,
                step: 0.1,
            },
        ],
        priorityFields: ['matcap','color', 'flatShading', 'opacity', 'transparent'],
    },
    {
        name: 'MeshPhysicalMaterial',
        description: 'An advanced physically based material with clearcoat and transmission.',
        factory: (param) => new THREE.MeshPhysicalMaterial(param),
        parameterFields: [
            {key: 'color', type: 'color', defaultValue: '#ffffff'},
            {key: 'metalness', type: 'number', defaultValue: 0, min: 0, max: 1, step: 0.01},
            {key: 'roughness', type: 'number', defaultValue: 1, min: 0, max: 1, step: 0.01},
            {key: 'transmission', type: 'number', defaultValue: 0, min: 0, max: 1, step: 0.01},
            {key: 'ior', type: 'number', defaultValue: 1.5, min: 1, max: 2.333, step: 0.001},
            {key: 'thickness', type: 'number', defaultValue: 0, min: 0, max: 10, step: 0.01},
            {key: 'clearcoat', type: 'number', defaultValue: 0, min: 0, max: 1, step: 0.01},
            {key: 'clearcoatRoughness', type: 'number', defaultValue: 0, min: 0, max: 1, step: 0.01},
            {key: 'map', type: 'texture', defaultValue: ''},
            {key: 'normalMap', type: 'texture', defaultValue: ''},
            {key: 'roughnessMap', type: 'texture', defaultValue: ''},
            {key: 'metalnessMap', type: 'texture', defaultValue: ''},
            {key: 'clearcoatMap', type: 'texture', defaultValue: ''},
            {key: 'clearcoatNormalMap', type: 'texture', defaultValue: ''},
            {key: 'clearcoatRoughnessMap', type: 'texture', defaultValue: ''},
            {key: 'transmissionMap', type: 'texture', defaultValue: ''},
            {key: 'thicknessMap', type: 'texture', defaultValue: ''},
        ],
        priorityFields: [
            'color',
            'metalness',
            'roughness',
            'transmission',
            'ior',
            'thickness',
            'clearcoat',
            'clearcoatRoughness',
        ],
    },
    {
            name: 'MeshToonMaterial',
        description: 'A toon or cel-shading material.',
        factory: (param) => new THREE.MeshToonMaterial(param),
        parameterFields: [
            {key: 'color', type: 'color', defaultValue: '#ffffff'},
            {key: 'emissive', type: 'color', defaultValue: '#000000'},
            {key: 'opacity', type: 'number', defaultValue: 1, min: 0, max: 1, step: 0.01},
            {key: 'transparent', type: 'boolean', defaultValue: false},
            {key: 'wireframe', type: 'boolean', defaultValue: false},
            {key: 'gradientMap', type: 'texture', defaultValue: ''},
            {key: 'map', type: 'texture', defaultValue: ''},
            {key: 'normalMap', type: 'texture', defaultValue: ''},
            {key: 'bumpMap', type: 'texture', defaultValue: ''},
            {key: 'displacementMap', type: 'texture', defaultValue: ''},
            {key: 'alphaMap', type: 'texture', defaultValue: ''},
        ],
        priorityFields: ['color', 'emissive', 'opacity', 'transparent', 'wireframe'],
    },
    {
        name: 'MeshDepthMaterial',
        description: 'A depth-based material often used for shadows and effects.',
        factory: (param) => new THREE.MeshDepthMaterial(param),
        parameterFields: [
            {key: 'wireframe', type: 'boolean', defaultValue: false},
            {
                key: 'displacementScale',
                type: 'number',
                defaultValue: 0,
                min: -5,
                max: 5,
                step: 0.01,
            },
            {
                key: 'displacementBias',
                type: 'number',
                defaultValue: 0,
                min: -5,
                max: 5,
                step: 0.01,
            },
            {key: 'map', type: 'texture', defaultValue: ''},
            {key: 'alphaMap', type: 'texture', defaultValue: ''},
            {key: 'displacementMap', type: 'texture', defaultValue: ''},
        ],
        priorityFields: ['wireframe', 'displacementScale', 'displacementBias'],
    },
    {
        name: 'MeshDistanceMaterial',
        description: 'A distance-based material used in shadow mapping workflows.',
        factory: (param) => new THREE.MeshDistanceMaterial(param),
        parameterFields: [
            {
                key: 'displacementScale',
                type: 'number',
                defaultValue: 0,
                min: -5,
                max: 5,
                step: 0.01,
            },
            {
                key: 'displacementBias',
                type: 'number',
                defaultValue: 0,
                min: -5,
                max: 5,
                step: 0.01,
            },
            {key: 'map', type: 'texture', defaultValue: ''},
            {key: 'alphaMap', type: 'texture', defaultValue: ''},
            {key: 'displacementMap', type: 'texture', defaultValue: ''},
        ],
        priorityFields: ['displacementScale', 'displacementBias'],
    },
    {
        name: 'ShadowMaterial',
        description: 'A transparent material that displays shadows.',
        factory: (param) => new THREE.ShadowMaterial(param),
        parameterFields: [
            {key: 'color', type: 'color', defaultValue: '#000000'},
            {key: 'opacity', type: 'number', defaultValue: 1, min: 0, max: 1, step: 0.01},
            {key: 'transparent', type: 'boolean', defaultValue: true},
        ],
        priorityFields: ['opacity', 'transparent', 'color'],
    },
    {
        name: 'ShaderMaterial',
        description: 'A custom GLSL shader material.',
        factory: (param) =>
            new THREE.ShaderMaterial({
                uniforms: {
                    uColor: {value: new THREE.Color('#8ac6ff')},
                    uIntensity: {value: 1},
                },
                vertexShader: `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,
                fragmentShader: `
uniform vec3 uColor;
uniform float uIntensity;

void main() {
  gl_FragColor = vec4(uColor * uIntensity, 1.0);
}
`,
                ...(param as THREE.ShaderMaterialParameters),
            }),
        parameterFields: [
            {
                key: 'vertexShader',
                type: 'text',
                defaultValue:
                    'varying vec2 vUv;\n\nvoid main() {\n  vUv = uv;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}',
            },
            {
                key: 'fragmentShader',
                type: 'text',
                defaultValue:
                    'uniform vec3 uColor;\nuniform float uIntensity;\n\nvoid main() {\n  gl_FragColor = vec4(uColor * uIntensity, 1.0);\n}',
            },
            {
                key: 'uniforms',
                type: 'uniforms',
                defaultValue: {
                    uTime: 0,
                },
            },
            {key: 'uniforms.uColor', type: 'color', defaultValue: '#8ac6ff'},
            {
                key: 'uniforms.uIntensity',
                type: 'number',
                defaultValue: 1,
                min: 0,
                max: 5,
                step: 0.01,
            },
            {key: 'transparent', type: 'boolean', defaultValue: false},
            {key: 'wireframe', type: 'boolean', defaultValue: false},
        ],
        priorityFields: [
            'vertexShader',
            'fragmentShader',
            'uniforms',
            'uniforms.uColor',
            'uniforms.uIntensity',
            'transparent',
            'wireframe',
        ],
    },
    {
        name: 'RawShaderMaterial',
        description: 'A custom GLSL shader material without automatic shader chunks.',
        factory: (param) =>
            new THREE.RawShaderMaterial({
                uniforms: {
                    uColor: {value: new THREE.Color('#ff9f8a')},
                    uIntensity: {value: 1},
                },
                vertexShader: `
precision mediump float;
precision mediump int;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
attribute vec3 position;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,
                fragmentShader: `
precision mediump float;

uniform vec3 uColor;
uniform float uIntensity;

void main() {
  gl_FragColor = vec4(uColor * uIntensity, 1.0);
}
`,
                ...(param as THREE.ShaderMaterialParameters),
            }),
        parameterFields: [
            {
                key: 'vertexShader',
                type: 'text',
                defaultValue:
                    'precision mediump float;\nprecision mediump int;\n\nuniform mat4 projectionMatrix;\nuniform mat4 modelViewMatrix;\nattribute vec3 position;\n\nvoid main() {\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n}',
            },
            {
                key: 'fragmentShader',
                type: 'text',
                defaultValue:
                    'precision mediump float;\n\nuniform vec3 uColor;\nuniform float uIntensity;\n\nvoid main() {\n  gl_FragColor = vec4(uColor * uIntensity, 1.0);\n}',
            },
            {
                key: 'uniforms',
                type: 'uniforms',
                defaultValue: {
                    uTime: 0,
                },
            },
            {key: 'uniforms.uColor', type: 'color', defaultValue: '#ff9f8a'},
            {
                key: 'uniforms.uIntensity',
                type: 'number',
                defaultValue: 1,
                min: 0,
                max: 5,
                step: 0.01,
            },
            {key: 'transparent', type: 'boolean', defaultValue: false},
            {key: 'wireframe', type: 'boolean', defaultValue: false},
        ],
        priorityFields: [
            'vertexShader',
            'fragmentShader',
            'uniforms',
            'uniforms.uColor',
            'uniforms.uIntensity',
            'transparent',
            'wireframe',
        ],
    },
]

const DEFAULT_VERTEX_SHADER = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const DEFAULT_FRAGMENT_SHADER = `
uniform vec3 uColor;
uniform float uIntensity;

void main() {
  gl_FragColor = vec4(uColor * uIntensity, 1.0);
}
`

export const MATERIAL_FACTORIES: Record<string, MaterialFactory> = {
    MeshNormalMaterial: () => new THREE.MeshNormalMaterial(),
    MeshBasicMaterial: () => new THREE.MeshBasicMaterial(),
    MeshPhongMaterial: () => new THREE.MeshPhongMaterial(),
    MeshStandardMaterial: () => new THREE.MeshStandardMaterial(),
    MeshLambertMaterial: () => new THREE.MeshLambertMaterial(),
    MeshMatcapMaterial: () => new THREE.MeshMatcapMaterial(),
    MeshPhysicalMaterial: () => new THREE.MeshPhysicalMaterial(),
    MeshToonMaterial: () => new THREE.MeshToonMaterial(),
    MeshDepthMaterial: () => new THREE.MeshDepthMaterial(),
    MeshDistanceMaterial: () => new THREE.MeshDistanceMaterial(),
    ShadowMaterial: () => new THREE.ShadowMaterial(),
    ShaderMaterial: () =>
        new THREE.ShaderMaterial({
            uniforms: {
                uColor: {value: new THREE.Color('#8ac6ff')},
                uIntensity: {value: 1},
            },
            vertexShader: DEFAULT_VERTEX_SHADER,
            fragmentShader: DEFAULT_FRAGMENT_SHADER,
        }),
    RawShaderMaterial: () =>
        new THREE.RawShaderMaterial({
            uniforms: {
                uColor: {value: new THREE.Color('#ff9f8a')},
                uIntensity: {value: 1},
            },
            vertexShader: `
precision mediump float;
precision mediump int;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
attribute vec3 position;

void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,
            fragmentShader: `
precision mediump float;

uniform vec3 uColor;
uniform float uIntensity;

void main() {
  gl_FragColor = vec4(uColor * uIntensity, 1.0);
}
`,
        }),
}

export function getMaterialFactory(materialType: string): MaterialFactory {
    return MATERIAL_FACTORIES[materialType] ?? MATERIAL_FACTORIES.MeshStandardMaterial
}

export const NUMBER_FIELD_META: Record<
    string,
    { min?: number; max?: number; step?: number }
> = {
    opacity: {min: 0, max: 1, step: 0.01},
    metalness: {min: 0, max: 1, step: 0.01},
    roughness: {min: 0, max: 1, step: 0.01},
    emissiveIntensity: {min: 0, max: 10, step: 0.01},
    shininess: {min: 0, max: 200, step: 1},
    reflectivity: {min: 0, max: 1, step: 0.01},
    refractionRatio: {min: 0, max: 1, step: 0.01},
    transmission: {min: 0, max: 1, step: 0.01},
    thickness: {min: 0, max: 10, step: 0.01},
    ior: {min: 1, max: 2.333, step: 0.001},
    clearcoat: {min: 0, max: 1, step: 0.01},
    clearcoatRoughness: {min: 0, max: 1, step: 0.01},
    sheen: {min: 0, max: 1, step: 0.01},
    sheenRoughness: {min: 0, max: 1, step: 0.01},
    specularIntensity: {min: 0, max: 1, step: 0.01},
    iridescence: {min: 0, max: 1, step: 0.01},
    iridescenceIOR: {min: 1, max: 2.333, step: 0.001},
    attenuationDistance: {min: 0, max: 100, step: 0.1},
    displacementScale: {min: -5, max: 5, step: 0.01},
    displacementBias: {min: -5, max: 5, step: 0.01},
    aoMapIntensity: {min: 0, max: 5, step: 0.01},
    envMapIntensity: {min: 0, max: 10, step: 0.01},
    lightMapIntensity: {min: 0, max: 5, step: 0.01},
    bumpScale: {min: -5, max: 5, step: 0.01},
    normalScale: {min: -5, max: 5, step: 0.01},
    alphaTest: {min: 0, max: 1, step: 0.01},
    polygonOffsetFactor: {min: -10, max: 10, step: 0.1},
    polygonOffsetUnits: {min: -10, max: 10, step: 0.1},
    uIntensity: {min: 0, max: 5, step: 0.01},
}

export const DEFAULT_PRIORITY_FIELDS = [
    'color',
    'map',
    'vertexShader', 'fragmentShader',
    'emissive',
    'emissiveIntensity',
    'metalness',
    'roughness',
    'shininess',
    'opacity',
    'transparent',
    'wireframe',
]


export const EXCLUDED_KEYS = new Set([
    'id',
    'uuid',
    'name',
    'type',
    'version',
    'userData',
    'defines',
])

export const MATERIAL_FIELD_DEFINITIONS: Record<string, string> = {
    alphaMap: 'Alpha map texture; only the color of the texture is used to control per-pixel opacity.',
    aoMap: 'Ambient occlusion map; the red channel modulates indirect lighting and requires uv2 coordinates.',
    bumpMap: 'Bump map texture; stores height variation to perturb lighting without changing geometry.',
    clearcoat: 'Strength of the clear coat layer for MeshPhysicalMaterial, in the [0,1] range.',
    clearcoatMap: 'Texture controlling clearcoat intensity across the surface.',
    clearcoatNormalMap: 'Normal map used only for the clear coat layer.',
    clearcoatRoughness: 'Roughness of the clear coat layer, in the [0,1] range.',
    clearcoatRoughnessMap: 'Texture controlling clear coat roughness values.',
    color: 'Diffuse/albedo color of the material.',
    displacementBias: 'Bias added to scaled displacement-map values before vertex displacement.',
    displacementMap: 'Displacement map texture that moves mesh vertices (real geometry displacement).',
    displacementScale: 'Scale factor for displacement-map influence on vertex positions.',
    emissive: 'Emissive (self-illumination) color of the material, unaffected by scene lighting.',
    emissiveMap: 'Texture modulating emissive color and intensity on the surface.',
    envMap: 'Environment map used for reflections/refractions, depending on material settings.',
    flatShading: 'When true, computes lighting per face for a faceted flat-shaded look.',
    fragmentShader: 'GLSL fragment shader source code executed per fragment/pixel.',
    gradientMap: 'Lookup texture used by toon materials to quantize lighting bands.',
    ior: 'Index of refraction for physical materials, typically in the [1.0, 2.333] range.',
    lightMap: 'Light map texture containing baked lighting information, usually requiring uv2.',
    map: 'Base color (albedo) texture map applied to the material.',
    matcap: 'Matcap texture for view-space lighting baked into a single 2D texture.',
    metalness: 'Metalness factor for PBR materials, in the [0,1] range.',
    metalnessMap: 'Texture controlling metalness values across the surface.',
    normalMap: 'Normal map texture altering per-pixel normals for lighting detail.',
    normalScale: 'Scale applied to normal map effect; adjusts normal-map intensity per axis.',
    opacity: 'Material opacity: 0.0 is fully transparent, 1.0 is fully opaque.',
    roughness: 'Roughness factor for PBR materials, in the [0,1] range.',
    roughnessMap: 'Texture controlling roughness values across the surface.',
    shininess: 'Phong shininess exponent controlling the size of specular highlights.',
    specular: 'Specular highlight color used by phong/legacy specular workflows.',
    specularMap: 'Texture controlling specular strength/color influence on the surface.',
    thickness: 'Physical material thickness used with transmission and volume attenuation.',
    thicknessMap: 'Texture controlling per-pixel thickness values for transmission effects.',
    transmission: 'Transmission factor for glass-like transparency in physical materials.',
    transmissionMap: 'Texture controlling transmission amount across the surface.',
    transparent: 'Enables transparent rendering path; opacity then controls alpha blending.',
    uniforms: 'Collection editor for custom shader uniforms (key/value pairs) that are applied as uniforms.<name>.',
    'uniforms.uColor': 'Custom shader uniform color value read by the shader program.',
    'uniforms.uIntensity': 'Custom shader uniform scalar controlling shader intensity.',
    vertexShader: 'GLSL vertex shader source code executed per vertex.',
    wireframe: 'Renders mesh geometry as wireframe lines instead of filled triangles.',
    wireframeLinewidth: 'Wireframe line thickness (WebGL/WebGPU generally render it as 1px).',
}
