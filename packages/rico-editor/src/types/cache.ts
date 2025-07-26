export interface CacheEntry {
  key: string
  value: any
  timestamp: Date
  expiresAt?: Date
}

export interface CacheProvider {
  get(key: string): Promise<any>
  set(key: string, value: any): Promise<void>
  remove(key: string): Promise<void>
} 