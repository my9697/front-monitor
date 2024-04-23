/**
 * 追踪路由变化，针对前端的SPA单页面而言，路由主要有两种方式，hash和history
 * hash路由变化会重发hashchange事件，同时也会触发popstate事件
 * 但是history就比较复杂，他有back,go,forward,replaceState,pushState
 * 而back,go,forward的触发同时也会触发popstate事件，但是热placeState，pushState并不会
 * 所以综上，我们追踪postate,replateState,pushState
 */

export function trackRouteChange(handler: (...args: any[]) => any) {
  // 我们在监听的时候，我们希望页面发生跳转就会及时的记录跳转的页面的情况，所以我们需要在
  // 事件捕获阶段就进行记录
  window.addEventListener("pushState", (e) => handler(e), true);
  window.addEventListener("replaceState", (e) => handler(e), true);
  window.addEventListener("popstate", (e) => handler(e), true);
}
