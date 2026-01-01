export function sanitizeFileName(name: string) {
  return name.replace(/[^\w.\-]+/g, '_')
}
