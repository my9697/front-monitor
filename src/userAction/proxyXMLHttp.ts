import type { HttpMetrics } from "src/types/userAction";
import { formatDate } from "src/utils/formatDate";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-explicit-any
export function proxyXMLHttp(loadHandendler: (...args: any[]) => any) {
  // 判断在当前环境下是否支持XMLHttpRequest，并且在当前环境下他是函数类型而不是对象或者类类型
  // in是一种运算符，判断对象身上有没有某个属性
  if (
    "XMLHttpRequest" in window &&
    typeof window.XMLHttpRequest === "function"
  ) {
    // 这里我们声明一个全局的XMLHttpRequest对象，用于上报数据，统一代码同时又将业务与数据上报区分开来，逻辑清晰易于维护
    const OXMLHttpRequest = window.XMLHttpRequest;
    // 这里要将window断言为any，让ts不去检查window，因为ts不知道window身上有没有proxyXMLHttpRequest属性就会报错
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(window as any).OXMLHttpRequest) {
      // 判断全局的上报数据的XMLHttpRequest是否声明成功，没有就声明一个
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).OXMLHttpRequest = OXMLHttpRequest;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).XMLHttpRequest = function () {
      //重写window.XMLHttpRequest用于数据上报
      const xhr = new OXMLHttpRequest();
      const { open, send } = xhr;
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      let httpMetrics: HttpMetrics = {} as HttpMetrics;
      // open：初始化请求，准备进行请求
      xhr.open = (method, url) => {
        httpMetrics.method = method;
        httpMetrics.url = url;
        // true表示着该操作是异步操作
        open.call(xhr, method, url, true);
      };
      // 开始发送请求
      xhr.send = (body) => {
        httpMetrics.body = body ?? "";
        httpMetrics.requestTime = new Date().getTime();
        httpMetrics.requestTimeFormat = formatDate(new Date());
        send.call(xhr, body);
      };
      // 请求结束后触发
      xhr.addEventListener("loadend", () => {
        const { status, statusText, response } = xhr;
        httpMetrics = {
          ...httpMetrics,
          status,
          statusText,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          response: response && JSON.parse(response),
          responseTime: new Date().getTime(),
          responseTimeFormat: formatDate(new Date()),
        };
        // 用于数据上报
        if (typeof loadHandendler === "function") loadHandendler(httpMetrics);
      });
      return xhr;
    };
  }
}
