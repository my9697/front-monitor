/**
 * 这里我们要知道replaceState和pushState本身不会触发popstate事件。
 * 也不会触发任何事件，因此通过addEventListener不能监听到这两个
 * 所以我们需要改写一下，在改写函数的内部，把replaceState和pushState派发出去
 */

type HistoryName = "replaceState" | "pushState";

export function writeReplaceStateAndPushState() {
  history.replaceState = writeHistoryEvent("replaceState");
  history.pushState = writeHistoryEvent("pushState");
}

function writeHistoryEvent(type: HistoryName) {
  const originEvent = history[type];
  return function (this: any) {
    const result = (
      data: any,
      unused: string,
      url?: string | URL | null | undefined
    ) => {
      originEvent.apply(this, [data, unused, url]);
    };
    const event = new Event(type);
    window.dispatchEvent(event);
    return result;
  };
}
