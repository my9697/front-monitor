/**
 * 静态资源的缓存命中率
 * 怎么判断静态资源是否被缓存了呢？
 * 满足两个特征就可以判断：duration=0 和 transferSize !== 0
 * 前者是responeEnd和startTime（资源开始加载或者性能条目开始的时间戳）之差
 * 但是有一点得注意，就是如果是跨站请求，那么transferSize其实会是零
 */

export function getCacheData() {
  const resourceDatas = performance.getEntriesByType("resource");
  let cacheHitCount = 0;
  resourceDatas.forEach((resourceData) => {
    if (resourceData.duration === 0 && resourceData.transferSize !== 0) {
      cacheHitCount++;
    }
  });
  return {
    cacheHitCount,
    noCacheHitRate: resourceDatas.length - cacheHitCount,
    cacheHitRate: (cacheHitCount / resourceDatas.length).toFixed(2),
  };
}
