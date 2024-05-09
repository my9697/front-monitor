import type { ResourceFlowTiming } from "../types/performance";

export function getResourceTiming(): ResourceFlowTiming[] {
  const resources = performance.getEntriesByType("resource");
  const resourceTiming: ResourceFlowTiming[] = resources.map((item) => {
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
    } = item;

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
  });

  return resourceTiming;
}
