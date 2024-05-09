import { type ErrorData, ErrorType, type ErrorOptions } from "../types/error";
import type { HttpMetrics } from "../types/userAction";
import { getErrorKey } from "./getErrorKey";
import { getErrorUidUtil } from "../utils/getErrorUidUtil";
import { parseErrorStackFrame } from "./getErrorUid";
import { getPageInformation } from "../userAction/getPageInformation";
import { proxyFetch } from "../userAction/proxyFetch";
import { proxyXMLHttp } from "../userAction/proxyXMLHttp";
import type { Report } from "../types/core";
import type Monitor from "../core/core";

export default class ErrorMonitor {
  private readonly options: ErrorOptions;
  private readonly submitErrorUid: string[];
  private readonly report: Report;
  private readonly monitor: Monitor;

  constructor(options: ErrorOptions, report: Report, monitor: Monitor) {
    this.options = Object.assign(
      {
        js: true,
        resource: true,
        core: true,
        http: true,
      },
      options
    );
    this.submitErrorUid = [];
    this.report = report;
    this.monitor = monitor;
    this.addErrorMonitor();
  }

  private initJSError() {
    window.addEventListener(
      "error",
      (event) => {
        if (getErrorKey(event) !== ErrorType.JS) return;
        const errorData: ErrorData = {
          errorUid: getErrorUidUtil(
            `${ErrorType.JS}-${event.message}-${event.filename}`
          ),
          erroeType: ErrorType.JS,
          type: event.error?.name ?? "Unknown",
          errorMessage: event.message,
          meta: {
            file: event.filename,
            row: event.lineno,
            col: event.colno,
          },
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          errorStack: parseErrorStackFrame(event.error),
          behaviorStack: this.monitor.userActionMonitor?.behaviorStack.get(),
          pageInfo: getPageInformation(),
        };
        this.errorDataReport(errorData);
      },
      true
    );
  }

  private initResourceError() {
    window.addEventListener(
      "error",
      (event) => {
        if (getErrorKey(event) !== ErrorType.RS) return;
        const target = event.target as HTMLScriptElement;
        const errorData: ErrorData = {
          errorUid: getErrorUidUtil(
            `${ErrorType.RS}-${target.src}-${target.tagName}`
          ),
          erroeType: ErrorType.RS,
          type: "RessourceError",
          errorMessage: "",
          meta: {
            url: target.src,
            html: target.outerHTML,
            type: target.tagName,
          },

          behaviorStack: this.monitor.userActionMonitor?.behaviorStack.get(),
          pageInfo: getPageInformation(),
        };
        this.errorDataReport(errorData);
      },
      true
    );
  }

  private initPromiseError() {
    window.addEventListener(
      "unhandledrejection",
      (event) => {
        const errorData: ErrorData = {
          errorUid: getErrorUidUtil(
            `${ErrorType.PM}-${event.reason.message ?? event.reason}-${
              event.reason.name ?? "UnKnown"
            }`
          ),
          erroeType: ErrorType.PM,
          type: event.reason?.name ?? "UnKnown",
          errorMessage: event.reason?.message ?? event.reason,
          meta: {},
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          errorStack: parseErrorStackFrame(event.reason),
          behaviorStack: this.monitor.userActionMonitor?.behaviorStack.get(),
          pageInfo: getPageInformation(),
        };
        this.errorDataReport(errorData);
      },
      true
    );
  }

  private initHttpError() {
    const loadHandler = (metrics: HttpMetrics) => {
      if (metrics.status < 400) return;
      const errorData: ErrorData = {
        errorUid: getErrorUidUtil(
          `${ErrorType.HP}-${metrics.response}-${metrics.statusText}`
        ),
        erroeType: ErrorType.HP,
        type: "HTTPError",
        errorMessage: metrics.response,
        meta: {
          ...metrics,
        },
        behaviorStack: this.monitor.userActionMonitor?.behaviorStack.get(),
        pageInfo: getPageInformation(),
      };
      this.errorDataReport(errorData);
    };
    proxyXMLHttp(loadHandler);
    proxyFetch(loadHandler);
  }

  private initCorsError() {
    window.addEventListener(
      "error",
      (event) => {
        if (getErrorKey(event) !== ErrorType.CS) return;
        const errorData: ErrorData = {
          errorUid: getErrorUidUtil(`${ErrorType.CS}-${event.message}`),
          erroeType: ErrorType.CS,
          type: "CorsError",
          errorMessage: event.message,
          meta: {},
          behaviorStack: this.monitor.userActionMonitor?.behaviorStack.get(),
          pageInfo: getPageInformation(),
        };
        this.errorDataReport(errorData);
      },
      true
    );
  }

  addErrorMonitor() {
    if (this.options.js) this.initJSError();
    if (this.options.resource) this.initResourceError();
    if (this.options.promise) this.initPromiseError();
    if (this.options.http) this.initHttpError();
    if (this.options.core) this.initCorsError();
  }

  private errorDataReport(errorData: ErrorData) {
    if (this.submitErrorUid.includes(errorData.errorUid)) return;
    this.submitErrorUid.push(errorData.errorUid);
    this.report(errorData, "error");
  }
}
