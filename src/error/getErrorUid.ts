// 解析错误堆
const FULL_MATCH =
  /^\s*at (?:(.*?)?\()?((?:file|http?|blob|chrome-extension|address|native|eval|webpack|<anonymous>|[-a-z]+:|.*bundle|\/).*?)(?::(\d+))?\)?\s*$/i;

// 限制追溯的长度
const STACKTRACE_LIMIT = 10;

// 解析每一行
export function parseErrorStackLine(line: string) {
  const lineMatch = line.match(FULL_MATCH);
  if (!lineMatch) return {};
  const fileName = lineMatch[2];
  const functionName = lineMatch[1] || "";
  const row = parseInt(lineMatch[3], 10) || undefined;
  const col = parseInt(lineMatch[4], 10) || undefined;
  return {
    fileName,
    functionName,
    row,
    col,
  };
}

// 解析错误堆栈
export function parseErrorStackFrame(error: Error) {
  const { stack } = error;
  if (!stack) return [];
  const frames = [];
  for (const line of stack.split("\n").slice(1)) {
    const frame = parseErrorStackLine(line);
    if (frame) {
      frames.push(frame);
    }
  }
  return frames.slice(0, STACKTRACE_LIMIT);
}
