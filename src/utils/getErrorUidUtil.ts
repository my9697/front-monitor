export const getErrorUidUtil = (input: string) => {
  return window.btoa(encodeURIComponent(input));
};
