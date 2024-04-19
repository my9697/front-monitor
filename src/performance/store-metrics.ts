import { type metricsName, type Imetrics } from '../types/performance'

export default class metricsStore {
  storeData: Map<metricsName | string, Imetrics>

  constructor () {
    this.storeData = new Map<metricsName | string, Imetrics>()
  }

  set (key: metricsName | string, value: Imetrics): void {
    this.storeData.set(key, value)
  }

  get (key: metricsName | string): Imetrics {
    return this.get(key)
  }

  add (key: metricsName | string, value: Imetrics): void {
    const keyVal = this.storeData.get(key)
    this.storeData.set(key, keyVal ? keyVal.concat([value]) : [value])
  }

  has (key: metricsName | string): boolean {
    return this.storeData.has(key)
  }

  clear (): void {
    this.storeData.clear()
  }

  getDta (): Imetrics {
    return Object.fromEntries(this.storeData)
  }
}
