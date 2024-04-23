export const getErrorUidUtil = (input: string) => {
  return window.btoa(decodeURIComponent(encodeURIComponent(input)));
};
