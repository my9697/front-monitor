import ErrorMonitor from "../error/error";
import PerformanceMonitor from "../performance/performance";
import UserActionMonitor from "../userAction/userAction";
import { MonitorConfig, type Options } from "../types/core";
import { formatDate } from "../utils/formatDate";

export default class Monitor {
  public appId: string;
  public uid?: string;
  public extra?: Record<string, any>;
  public options: Options;

  public performanceMonitor?: PerformanceMonitor;
  public userActionMonitor?: UserActionMonitor;
  public errorMonitor?: ErrorMonitor;

  public constructor(appId: string, options?: Options) {
    this.appId = appId;
    this.options = Object.assign(
      {
        sdkVersion: MonitorConfig.version,
        requestUrl: "http://localhost:3000",
        performanceMonitor: true,
        userActionMonitor: true,
        errorMonitor: true,
      },
      options
    );
    (window as any).mYuSetUserId = this.setUserId.bind(this);
    (window as any).mYuSetExtra = this.setExtra.bind(this);
    this.installInnerTracker();
  }

  private installInnerTracker() {
    if (this.options.performanceMonitor) {
      this.performanceMonitor = new PerformanceMonitor(
        this.options.performanceMonitor,
        this.report.bind(this),
        this
      );
    }
    if (this.options.userActionMonitor) {
      this.userActionMonitor = new UserActionMonitor(
        this.options.userActionMonitor,
        this.report.bind(this),
        this
      );
    }
    if (this.options.errorMonitor) {
      this.errorMonitor = new ErrorMonitor(
        this.options.errorMonitor,
        this.report.bind(this),
        this
      );
    }
  }

  public report<T extends Record<string, any>>(data: T, type: string) {
    const params = Object.assign(
      { data, type },
      {
        appId: this.appId,
        uid: this.uid,
        extra: this.extra,
        time: new Date().getTime(),
        timeFormat: formatDate(new Date()),
      }
    );
    const blob = new Blob([JSON.stringify(params)]);
    navigator.sendBeacon(this.options.requestUrl, blob);
  }

  private setUserId(uid: string) {
    this.uid = uid;
  }

  private setExtra(extra: Record<string, any>) {
    this.extra = extra;
  }
}
