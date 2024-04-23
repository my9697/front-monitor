import { type PerformanceHandler } from "../types/performance";

export const afterLoad = (callback: (...args: any[]) => any) => {
  if (document.readyState === "complete") {
    // 放到setTimeote里面目的是放到宏队列里面，不阻碍正在渲染的界面
    setTimeout(callback);
  } else {
    // once会在调用一次后就会自动移除，capture会在事件捕获的时候就会执行callback
    window.addEventListener("pageshow", callback, {
      once: true,
      capture: true,
    });
  }
};

export const observe = (
  type: string,
  callback: PerformanceHandler
): PerformanceObserver | undefined => {
  if (PerformanceObserver.supportedEntryTypes?.includes(type)) {
    const ob: PerformanceObserver = new PerformanceObserver((list) =>
      list.getEntries().map(callback)
    );
    ob.observe({ type, buffered: true });
    return ob;
  }
  return undefined;
};
