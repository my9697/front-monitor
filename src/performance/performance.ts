import { afterLoad } from "../utils/performance-utils";
import MetricsStore from "./store-metrics";
import { onFCP, onFID, onLCP, onCLS } from "web-vitals";
import type { FCPMetric, LCPMetric, FIDMetric, CLSMetric } from "web-vitals";
import { getNavigationTiming } from "./getNavigationTiming";
import { getResourceTiming } from "./getResourceTiming";
import { getCacheData } from "./getCacheData";
import { MetricsName, type PerfomanceOption } from "../types/performance";
import type { Report } from "../types/core";
import type Monitor from "../core/core";

export default class PerformanceMonitor {
  private readonly data: MetricsStore;
  private readonly options: PerfomanceOption;
  private readonly report: Report;

  constructor(options: PerfomanceOption, report: Report, monitor: Monitor) {
    this.data = new MetricsStore();
    this.options = Object.assign(
      {
        FCP: true,
        LCP: true,
        FID: true,
        CLS: true,
        NT: true,
        RT: true,
        CD: true,
      },
      options
    );
    this.report = report;
    this.addPerfomanceMonitor();
    this.performanceDataReport();
  }

  private initFCP() {
    onFCP((metricData: FCPMetric) => {
      this.data.set(MetricsName.FCP, {
        name: metricData.name,
        value: metricData.value,
        rating: metricData.rating,
      });
    });
  }

  private initLCP() {
    onLCP((metricData: LCPMetric) => {
      this.data.set(MetricsName.LCP, {
        name: metricData.name,
        value: metricData.value,
        rating: metricData.rating,
      });
    });
  }

  private initFID() {
    onFID((metricData: FIDMetric) => {
      this.data.set(MetricsName.FID, {
        name: metricData.name,
        value: metricData.value,
        rating: metricData.rating,
      });
    });
  }

  private initCLS() {
    onCLS((metricData: CLSMetric) => {
      this.data.set(MetricsName.CLS, {
        name: metricData.name,
        value: metricData.value,
        rating: metricData.rating,
      });
    });
  }

  private initNT() {
    const navigation = getNavigationTiming();
    this.data.set(MetricsName.NT, navigation);
  }

  private initRF() {
    const resourceTiming = getResourceTiming();
    this.data.set(MetricsName.RF, resourceTiming);
  }

  private initCD() {
    const cacheData = getCacheData();
    this.data.set(MetricsName.CD, cacheData);
  }

  private addPerfomanceMonitor() {
    if (this.options.FCP) this.initFCP();
    if (this.options.LCP) this.initLCP();
    if (this.options.FID) this.initFID();
    if (this.options.CLS) this.initCLS();

    afterLoad(() => {
      if (this.options.NT) this.initNT();
      if (this.options.RF) this.initRF();
      if (this.options.CD) this.initCD();
    });
  }

  private performanceDataReport() {
    window.addEventListener("beforeunload", () => {
      if (this.data.get(MetricsName.FID)) {
        this.report(this.data, "performance");
      }
    });
  }
}
