export class LocalCache {
  async get(key: string): Promise<any> {
    return localStorage.getItem(key)
  }

  async set(key: string, value: any): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value))
  }

  async remove(key: string): Promise<void> {
    localStorage.removeItem(key)
  }
} 