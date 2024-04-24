import type { HttpMetrics } from "../types/userAction";
import { formatDate } from "../utils/formatDate";

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-function-return-type
export function proxyFetch(loadHandendler: (...args: any[]) => any) {
  if ("fetch" in window && typeof window.fetch === "function") {
    const OFetch = window.fetch;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(window as any).OFetch) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).OFetch = OFetch;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).fetch = async (input: any, init: RequestInit) => {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      let httpMetrics: HttpMetrics = {} as HttpMetrics;
      httpMetrics.method = init?.method ?? "";
      httpMetrics.url =
        (input && typeof input !== "string" ? input?.url : input) ?? "";
      httpMetrics.body = init?.body ?? "";
      httpMetrics.requestTime = new Date().getTime();
      httpMetrics.requestTimeFormat = formatDate(new Date());

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return await OFetch.call(window, input, init).then(async (Response) => {
        const res = Response.clone();
        httpMetrics = {
          ...httpMetrics,
          status: res.status,
          statusText: res.statusText,
          response: res.text() ?? JSON.parse(await res.text()),
          responseTime: new Date().getTime(),
        };
        if (typeof loadHandendler === "function") loadHandendler(httpMetrics);
        return Response;
      });
    };
  }
}
