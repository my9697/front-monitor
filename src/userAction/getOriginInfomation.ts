import type { OriginInfomation } from "src/types/userAction";

export function getOriginInfomation(): OriginInfomation {
  return {
    referer: document.referrer,
    type: performance.getEntriesByType("navigation")[0].type,
  };
}
