import { ErrorType } from "../types/error";

export function getErrorKey(event: ErrorEvent | Event) {
  const isJSError = event instanceof Error;
  if (!isJSError) {
    return ErrorType.RS;
  }
  return event.message === "Script error." ? ErrorType.CS : ErrorType.JS;
}
