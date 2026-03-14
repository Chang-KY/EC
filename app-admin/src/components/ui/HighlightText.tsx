type HighlightTextProps = {
  text: string
  keyword?: string
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function HighlightText({ text, keyword }: HighlightTextProps) {
  const normalizedKeyword = keyword?.trim()

  if (!normalizedKeyword) {
    return <>{text}</>
  }

  const regex = new RegExp(`(${escapeRegExp(normalizedKeyword)})`, 'gi')
  const parts = text.split(regex)

  return (
    <>
      {parts.map((part, index) => {
        const isMatch = part.toLowerCase() === normalizedKeyword.toLowerCase()

        return isMatch ? (
          <span key={index} className="bg-yellow-200">
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      })}
    </>
  )
}
