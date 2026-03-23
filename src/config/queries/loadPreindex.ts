import fs from 'fs'

export function loadPreindexFile<T>(path: string): T | undefined {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf-8')) as T
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.warn(`[config/queries] failed to load preindex file ${path}: ${message}`)
    return undefined
  }
}
