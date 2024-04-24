import { type MetricsName, type Imetrics } from '../types/performance'

export default class MetricsStore {
  storeData: Map<MetricsName | string, Imetrics>

  constructor () {
    this.storeData = new Map<MetricsName | string, Imetrics>()
  }

  set (key: MetricsName | string, value: Imetrics): void {
    this.storeData.set(key, value)
  }

  get (key: MetricsName | string): Imetrics | undefined{
    return this.get(key)
  }

  add (key: MetricsName | string, value: Imetrics): void {
    const keyVal: Imetrics | undefined = this.storeData.get(key)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    this.storeData.set(key, keyVal ? keyVal.concat([value]) : [value])
  }

  has (key: MetricsName | string): boolean {
    return this.storeData.has(key)
  }

  clear (): void {
    this.storeData.clear()
  }

  getDta (): Imetrics {
    return Object.fromEntries(this.storeData)
  }
}
