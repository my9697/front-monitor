export enum metricsName {
  FCP = 'first-content-paint',
  LCP = 'largest-content-paint',
  FID = 'first-input-delay',
  NT = 'navigation-timing',
  RF = 'resorce-flow'
}

export type Imetrics = Record<string | number, any>

export type PerformanceHandler = (entry: any) => void

/**
 * @param DNS DNS查询的时间
 * @param SSL SSl链接的时间
 * @param CLS CLS链接的时间
 * @param TTFB 请求到响应过程的时间
 * @param tranfer 数据传输的时间
 * @param FP 白屏时间
 * @param DOMParse DOM解析的时间
 * @param TTI 首次可交互的时间
 * @param
 */
export interface NavigationType {

}
