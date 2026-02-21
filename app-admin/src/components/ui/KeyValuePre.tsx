import clsx from 'clsx'

function formatKeyValueLines(obj: unknown) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return ''

  const entries = Object.entries(obj as Record<string, unknown>).filter(
    ([, v]) => v != null && String(v).trim() !== '',
  )

  if (entries.length === 0) return ''

  return entries.map(([k, v]) => `${k}: ${String(v)}`).join('\n')
}

export function KeyValuePre({
  value,
  emptyText = '',
  className,
}: {
  value: unknown
  emptyText?: string
  className?: string
}) {
  const text = formatKeyValueLines(value)

  return (
    <pre
      className={clsx(
        'max-h-40 overflow-auto rounded-md border bg-gray-50 p-3 text-xs text-gray-700',
        className,
      )}
    >
      {text || emptyText}
    </pre>
  )
}
