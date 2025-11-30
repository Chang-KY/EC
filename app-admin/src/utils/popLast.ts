export const popLast = (p: string) => p.split('/').filter(Boolean).pop() ?? ''
