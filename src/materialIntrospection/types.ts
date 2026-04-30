import{Material}  from 'three'

export type EditableFieldType = 'color' | 'number' | 'boolean'

export type ExtendedEditableFieldType =
  | EditableFieldType
  | 'text'
  | 'texture'
  | 'vector2'
  | 'uniforms'

export interface Vector2Value {
  x: number
  y: number
}

export type UniformPrimitiveValue = string | number | boolean

export interface UniformsValue {
  [key: string]: UniformPrimitiveValue
}

export type EditableDefaultValue =
  | string
  | number
  | boolean
  | Vector2Value
  | UniformsValue

export interface EditableMaterialField {
  key: string
  label: string
  type: ExtendedEditableFieldType
  min?: number
  max?: number
  step?: number
  defaultValue: EditableDefaultValue
}

export type MaterialFactory = () => Material

export type ClassConstructor<
  TInstance = unknown,
  TArgs extends unknown[] = unknown[],
> = new (...args: TArgs) => TInstance

export type MaterialTarget = string | MaterialFactory | Material

export type ParameterFieldHint = {
  key: string
  type: ExtendedEditableFieldType
  defaultValue: EditableDefaultValue
  min?: number
  max?: number
  step?: number
}

export interface MaterialDefinition {
  name: string
  description: string
  factory: (param: undefined | any ) => Material
  constructorParameterFactory?: () => any
  parameterFields?: ParameterFieldHint[]
  priorityFields?: string[]

}

