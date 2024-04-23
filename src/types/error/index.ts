import type { BehaviorStack, PageInfomation } from "../userAction";

export enum ErrorType {
  JS = "js",
  RS = "resource",
  HP = "http",
  CS = "cors",
  PM = "promise",
}

export interface ErrorStackData {
  fileName?: string;
  function?: string;
  row?: number;
  col?: number;
}

// 格式化后错误的数据结构构体
export interface ErrorData {
  errorUid: string;
  erroeType: ErrorType;
  type: string;
  errorMessage?: string;
  meta: Record<string, any>;
  errorStack?: ErrorStackData[];
  behaviorStack: BehaviorStack[] | undefined;
  pageInfo?: PageInfomation;
}

export interface ErrorOptions {
  js?: boolean;
  resource?: boolean;
  http?: boolean;
  core?: boolean;
  promise?: boolean;
}
