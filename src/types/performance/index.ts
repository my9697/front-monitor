export enum MetricsName {
  FCP = "first-content-paint",
  LCP = "largest-content-paint",
  FID = "first-input-delay",
  CLS = "content-location-skewing",
  NT = "navigation-timing",
  RF = "resorce-flow",
  CD = "cache-data",
}

export type Imetrics = Record<string | number, any>;

export type PerformanceHandler = (entry: any) => void;

/**
 * @param DNS DNS查询的时间
 * @param SSL SSL链接的时间
 * @param TCP TCP链接的时间
 * @param TTFB 请求到响应过程的时间
 * @param Tranfer 数据传输的时间
 * @param FP 白屏时间
 * @param DOMParse DOM解析的时间
 * @param TTI 首次可交互的时间
 * @param DOMReady HTML加载完成的时间，DOM树构建完成
 * @param Resouce 资源加载的时间
 * @param Load 页面完全加载的时间
 */

export interface PerformanceNavigationTiming {
  DNS: { start: number; end: number; value: number };
  SSL: { start: number; end: number; value: number };
  TCP: { start: number; end: number; value: number };
  TTFB: { start: number; end: number; value: number };
  Transfer: { start: number; end: number; value: number };
  FP: { start: number; end: number; value: number };
  DOMParse: { start: number; end: number; value: number };
  TTI: { start: number; end: number; value: number };
  DOMRaeady: { start: number; end: number; value: number };
  Resource: { start: number; end: number; value: number };
  Load: { start: number; end: number; value: number };
}

export interface ResourceFlowTiming {
  name: string;
  initiatorType: string;
  transferSize: number;
  start: number;
  end: number;
  DNS: number;
  TCP: number;
  SSL: number;
  TTFB: number;
  Trans: number;
}

export interface PerfomanceOption {
  FCP?: boolean;
  LCP?: boolean;
  FID?: boolean;
  CLS?: boolean;
  NT?: boolean;
  RF?: boolean;
  CD?: boolean;
}
