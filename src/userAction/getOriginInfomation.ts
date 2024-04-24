import type { OriginInfomation } from "../types/userAction";

export function getOriginInfomation(): OriginInfomation {
  return {
    referer: document.referrer,
    type: performance.getEntriesByType("navigation")[0].type,
  };
}
