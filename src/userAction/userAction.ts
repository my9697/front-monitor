import type {
  UserActionOptions,
  HttpMetrics,
  IPVData,
} from "../types/userAction";
import { getPageInformation } from "./getPageInformation";
import { MetricsName } from "../types/userAction";
import { getOriginInfomation } from "./getOriginInfomation";
import BehaviorStore from "./behaviorRecord";
import { proxyFetch } from "./proxyFetch";
import { proxyXMLHttp } from "./proxyXMLHttp";
import { trackRouteChange } from "./trackRouteChange";
import { formatDate } from "../utils/formatDate";
import { afterLoad } from "../utils/performance-utils";
import type { Report } from "../types/core";
import type Monitor from "../core/core";
import { writeReplaceStateAndPushState } from "./writeReplaceStateAndPushState";

export default class UserActionMonitor {
  private readonly data: Record<string, any>;
  private readonly options: UserActionOptions;
  public readonly behaviorStack: BehaviorStore;
  private readonly elementTrackedList: string[];
  private readonly classTrackedList: string[];
  private readonly eventTrackedList: string[];
  private readonly report: Report;
  private readonly monitor: Monitor;

  constructor(options: UserActionOptions, report: Report, monitor: Monitor) {
    this.data = {};
    this.options = Object.assign(
      {
        PI: true,
        OI: true,
        RCR: true,
        CBR: true,
        CDR: true,
        HR: true,
        BS: true,
        PV: true,
        behavior: true,
        elementTrackedList: ["button", "div"],
        classTrackedList: ["tracked"],
        eventTrackedList: ["click"],
        maxBehaviorRecords: 100,
      },
      options
    );
    this.behaviorStack = new BehaviorStore({
      maxBehaviorRecords: options.maxBehaviorRecords!,
    });
    this.elementTrackedList = this.options.elementTrackedList!;
    this.classTrackedList = this.options.classTrackedList!;
    this.eventTrackedList = this.options.eventTrackedList!;
    this.report = report;
    this.monitor = monitor;
    writeReplaceStateAndPushState();
    (window as any).myuSendData = this.sendDataCustom.bind(this);
    this.addUserActionMonitor();
    this.userActionDataReport();
  }

  private initPageInformation() {
    const pageInfomation = getPageInformation();
    this.data[MetricsName.PI] = pageInfomation;
  }

  private initOriginInfomation() {
    const originInfo = getOriginInfomation();
    this.data[MetricsName.OI] = originInfo;
  }

  private initRouteChange() {
    trackRouteChange((e: Event) => {
      const routerChangeData = {
        jumpType: e.type,
        pageInfo: getPageInformation(),
        time: new Date().getTime(),
        timeFormat: formatDate(new Date()),
      };
      if (this.data[MetricsName.RCR]) {
        this.data[MetricsName.RCR].push(routerChangeData);
      } else {
        this.data[MetricsName.RCR] = [routerChangeData];
      }
      const behaviorData = {
        name: MetricsName.RCR,
        page: getPageInformation().pathname,
        value: {
          jumpType: e.type,
        },
        time: new Date().getTime(),
        timeFormat: formatDate(new Date()),
      };
      this.behaviorStack.push(behaviorData);
    });
  }

  private initHttpRecords() {
    const loadHandenler = (httpMetrics: HttpMetrics) => {
      if (!this.data[MetricsName.HR]) {
        this.data[MetricsName.HR] = [httpMetrics];
      } else {
        this.data[MetricsName.HR].push(httpMetrics);
      }
    };
    proxyFetch(loadHandenler);
    proxyXMLHttp(loadHandenler);
  }

  private initPV() {
    const handler = () => {
      let time = 0;
      const getTime = new Date().getTime();
      const PVData: IPVData = {
        pageInfo: getPageInformation(),
        originInfo: getOriginInfomation(),
        PVTime: undefined,
      };
      if (time === 0) {
        time = getTime;
      } else {
        PVData.PVTime = getTime - time;
        this.report(PVData, "PV");
      }
    };
    afterLoad(handler);
    trackRouteChange(handler);
  }

  private initCustomDefineRecord() {
    this.eventTrackedList.forEach((eventName) => {
      window.addEventListener(eventName, (e) => {
        let target = this.elementTrackedList.includes(
          (e.target as HTMLElement)?.tagName?.toLocaleLowerCase()
        )
          ? (e.target as HTMLElement)
          : undefined;

        target =
          target ??
          Array.from((e.target as HTMLElement)?.classList).find((className) => {
            return this.classTrackedList.includes(className);
          })
            ? (e.target as HTMLElement)
            : undefined;

        if (!target) return;

        const domData = {
          tagInfo: {
            id: target.id,
            classList: Array.from(target.classList),
            tagName: target.tagName,
            text: target.textContent,
          },
          pageInfo: getPageInformation(),
          time: new Date().getTime(),
          timeFormat: formatDate(new Date()),
        };
        if (!this.data[MetricsName.CDR]) {
          this.data[MetricsName.CDR] = { [eventName]: [domData] };
        } else if (!this.data[MetricsName.CDR][eventName]) {
          this.data[MetricsName.CDR][eventName] = [domData];
        } else {
          this.data[MetricsName.CDR][eventName].push(domData);
        }

        const behaviorData = {
          name: eventName,
          page: getPageInformation().pathname,

          time: new Date().getTime(),
          timeFormat: formatDate(new Date()),
          value: {
            tagInfo: {
              id: target.id,
              classList: Array.from(target.classList),
              tagName: target.tagName,
              text: target.textContent,
            },
            pageInfo: getPageInformation(),
          },
        };

        this.behaviorStack.push(behaviorData);
      });
    });
  }

  private addUserActionMonitor() {
    if (this.options.PI) this.initPageInformation();
    if (this.options.OI) this.initOriginInfomation();
    if (this.options.HR) this.initHttpRecords();
    if (this.options.RCR) this.initRouteChange();
    if (this.options.PV) this.initPV();
    if (this.options.CDR) this.initCustomDefineRecord();
  }

  private userActionDataReport() {
    window.addEventListener("beforeunload", () => {
      this.report(this.data, "userAction");
      if (this.options.behavior)
        this.report(this.behaviorStack.get(), "behaviorStack");
    });
  }

  private sendDataCustom(data: Record<string, any>) {
    this.report(data, "custom");
    this.behaviorStack.push({
      name: "custom",
      page: getPageInformation().pathname,
      value: data,
      time: new Date().getTime(),
      timeFormat: formatDate(new Date()),
    });
  }
}
