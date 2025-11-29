export const fmt = (v?: number | null) => (typeof v === 'number' ? v.toLocaleString() : '-')
