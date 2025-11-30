export const stringJoin = (...parts: string[]) => parts.join('/').replace(/\/+/g, '/')
