import type { UserActionOptions } from "../userAction";
import type { PerfomanceOption } from "../performance";
import type { ErrorOptions } from "../error";
import type Monitor from "src/core/core";

/**
 * @param sdkVersion sdk版本
 * @param requestUrl 上报数据的接口
 * @param userActionMonitor 用户行为上报
 * @param performanceMonitor 性能数据上报
 * @param errorMonitor 错误信息上报
 */

export interface Options {
  sdkVersion: string | number;
  requestUrl: string;
  userActionMonitor: UserActionOptions;
  performanceMonitor: PerfomanceOption;
  errorMonitor: ErrorOptions;
}

export enum MonitorConfig {
  version = "1.0.0",
}

export type Report = Monitor["report"];
