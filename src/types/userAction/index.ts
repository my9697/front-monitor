export enum MetricsName {
  PI = "page-information",
  OI = "origin-information",
  RCR = "router-change-record",
  CDR = "custom-define-record",
  HR = "http-record",
}

export interface UserActionOptions {
  PI?: boolean;
  OI?: boolean;
  RCR?: boolean;
  CBR?: boolean;
  CDR?: boolean;
  HR?: boolean;
  PV?: boolean;
  behavior?: boolean;
  elementTrackedList?: string[];
  classTrackedList?: string[];
  eventTrackedList?: string[];
  maxBehaviorRecords?: number;
}

/**
 * @param href 获取page完整的url
 * @param origin 获取page的源，即协议域名端口
 * @param protocol 获取协议
 * @param host 获取域名和端口
 * @param hostname 域名
 * @param port 端口号
 * @param pathname 路由，即/page
 * @param search 查询字符串，如?param1 = value1 & param2 = value2
 * @param hash 路由中#后面的参数
 * @param title 网页标题
 * @param language 浏览器的语种
 * @param userAgentData 用户的信息
 * @param winScreen 屏幕的宽高
 * @param docScreen 文档的宽高（当前页面显示文档的实际宽高）
 */

export interface PageInfomation {
  href: string;
  origin: string;
  protocol: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  title: string;
  language: string;
  userAgentData: Record<string, any>;
  winScreen: string;
  docScreen: string;
}

export interface OriginInfomation {
  type: string;
  referer: string;
}

export interface behaviorRecordOptions {
  maxBehaviorRecords: number;
}

export interface BehaviorStack {
  name: MetricsName | string;
  page: string;
  time: number | string;
  timeFormat: string;
  value: Record<string, any>;
}

/**
 * Document 请求体是HTML,比如通过post ， put发送的请求用来提交HTML文档，比如表单，或者使用AJAX发送请求
 * XMLHttpRequestBodeyInit 是基本数据类型，比如字符串，二进制
 * null和undefined是不提交任何东西
 * ReadableStream 表示用来请求大数据或者实时数据
 */

export interface HttpMetrics {
  method: string;
  url: string | URL;
  body: Document | XMLHttpRequestBodyInit | null | undefined | ReadableStream;
  requestTime: number;
  requestTimeFormat: string;
  responseTime: number;
  responseTimeFormat: string;
  status: number;
  statusText: string;
  response?: any;
}
