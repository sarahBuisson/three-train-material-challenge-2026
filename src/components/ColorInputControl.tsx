interface ColorInputControlProps {
  id: string
  value: string
  onChange: (value: string) => void
}

function normalizeHexColor(value: string): string {
  const candidate = value.trim().toLowerCase()
  const hex3 = /^#[0-9a-f]{3}$/
  const hex6 = /^#[0-9a-f]{6}$/

  if (hex6.test(candidate)) {
    return candidate
  }

  if (hex3.test(candidate)) {
    const [, a, b, c] = candidate
    return `#${a}${a}${b}${b}${c}${c}`
  }

  return '#ffffff'
}

export default function ColorInputControl({
  id,
  value,
  onChange,
}: ColorInputControlProps) {
  const normalized = normalizeHexColor(value)

  return (
    <div className="inline-preview-control">
      <input
        id={id}
        type="color"
        value={normalized}
        onChange={(e) => onChange(e.target.value)}
      />
      <span
        className="inline-color-swatch"
        style={{ backgroundColor: normalized }}
        aria-hidden="true"
      />
      <code className="inline-preview-code">{normalized.toUpperCase()}</code>
    </div>
  )
}

