import type { ResourceFlowTiming } from "../types/performance";

export function getResourceTiming(): ResourceFlowTiming {
  const {
    name,
    transferSize,
    initiatorType,
    startTime,
    responseEnd,
    domainLookupEnd,
    domainLookupStart,
    connectEnd,
    connectStart,
    secureConnectionStart,
    responseStart,
    requestStart,
  } = performance.getEntriesByType("resource")[0];

  return {
    name,
    initiatorType,
    transferSize,
    start: startTime,
    end: responseEnd,
    DNS: domainLookupEnd - domainLookupStart,
    TCP: connectEnd - connectStart,
    SSL: connectEnd - secureConnectionStart,
    TTFB: responseStart - requestStart,
    Trans: responseEnd - responseStart,
  };
}
