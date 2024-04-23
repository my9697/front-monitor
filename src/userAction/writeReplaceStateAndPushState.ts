/**
 * 首先我们要明白，popstate是当我们的历史记录发生变化的时候就会被调用
 * 而replaceState和pushState则是对历史记录进行更改的
 * 简单点就是路由切换使历史变化，历史变化需要更改就会触发replaceState和pushState，
 * 历史更改就会触发popstate.
 * 而我们之所以要重写replaceState和pushState，是为了获取前一个页面的信息
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
