import { afterLoad } from "../utils/performance/performance-utils";
import metricsStore from "./store-metrics";
import { onFCP, onFID, onLCP, onCLS } from "web-vitals";

export default class PerfoemanceMonitor {
  private readonly data: metricsStore;

  constructor() {
    this.data = new metricsStore();
  }

  private initFP() {}

  private initFCP() {
    onFCP(console.log);
  }

  private initLCP() {
    onLCP(console.log);
  }

  private initFID() {
    onFID(console.log);
  }

  private initCLS() {
    onCLS(console.log);
  }

  private initNT() {}
  private initRF() {}
}
