export function getExt(file: File) {
  const ext = file.name.split('.').pop()?.toLowerCase()
  return ext && ext !== file.name.toLowerCase() ? ext : undefined
}
