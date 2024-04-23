import { type PerformanceNavigationTiming } from "../types/performance";

export function getNavigationTiming(): PerformanceNavigationTiming {
  const {
    domainLookupStart,
    domainLookupEnd,
    connectStart,
    connectEnd,
    secureConnectionStart,
    requestStart,
    responseStart,
    responseEnd,
    fetchStart,
    domInteractive,
    domContentLoadedEventEnd,
    loadEventEnd,
  } = performance.getEntriesByType("navigation")[0];

  return {
    DNS: {
      start: domainLookupStart,
      end: domainLookupEnd,
      value: domainLookupEnd - domainLookupStart,
    },
    TCP: {
      start: connectStart,
      end: connectEnd,
      value: connectEnd - connectEnd,
    },
    SSL: {
      start: secureConnectionStart,
      end: connectEnd,
      value: connectEnd - secureConnectionStart,
    },
    TTFB: {
      start: requestStart,
      end: responseStart,
      value: responseStart,
    },
    Transfer: {
      start: responseStart,
      end: responseEnd,
      value: responseEnd - responseStart,
    },
    FP: {
      start: fetchStart,
      end: responseEnd,
      value: responseEnd - fetchStart,
    },
    DOMParse: {
      start: responseEnd,
      end: domInteractive,
      value: domInteractive - responseEnd,
    },
    TTI: {
      start: fetchStart,
      end: domInteractive,
      value: domInteractive - fetchStart,
    },
    DOMRaeady: {
      start: fetchStart,
      end: domContentLoadedEventEnd,
      value: domContentLoadedEventEnd - fetchStart,
    },
    Resource: {
      start: responseEnd,
      end: loadEventEnd,
      value: loadEventEnd - responseEnd,
    },
    Load: {
      start: fetchStart,
      end: loadEventEnd,
      value: loadEventEnd - fetchStart,
    },
  };
}
