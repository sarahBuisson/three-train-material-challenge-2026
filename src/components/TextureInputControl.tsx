import { useEffect, useRef, useState, type ChangeEvent } from 'react'

interface TextureInputControlProps {
  id: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
}

export default function TextureInputControl({
  id,
  value,
  placeholder = 'Texture URL',
  onChange,
}: TextureInputControlProps) {
  const [hasError, setHasError] = useState(false)
  const createdBlobUrlRef = useRef<string | null>(null)

  useEffect(() => {
    setHasError(false)
  }, [value])

  useEffect(() => {
    return () => {
      if (createdBlobUrlRef.current) {
        URL.revokeObjectURL(createdBlobUrlRef.current)
      }
    }
  }, [])

  const handleTextChange = (nextValue: string) => {
    if (createdBlobUrlRef.current) {
      URL.revokeObjectURL(createdBlobUrlRef.current)
      createdBlobUrlRef.current = null
    }

    onChange(nextValue)
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    if (createdBlobUrlRef.current) {
      URL.revokeObjectURL(createdBlobUrlRef.current)
    }

    const blobUrl = URL.createObjectURL(file)
    createdBlobUrlRef.current = blobUrl
    onChange(blobUrl)
    event.target.value = ''
  }

  const hasTexture = value.trim().length > 0

  return (
    <div className="texture-input-control">
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleTextChange(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      <div className="texture-preview" aria-live="polite">
        {hasTexture && !hasError ? (
          <img
            src={value}
            alt="Texture preview"
            className="texture-preview-image"
            onError={() => setHasError(true)}
          />
        ) : (
          <span className="texture-preview-placeholder">
            {hasTexture ? 'Texture unavailable' : 'No texture'}
          </span>
        )}
      </div>
    </div>
  )
}

