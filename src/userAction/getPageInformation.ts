import type { PageInfomation } from "../types/userAction";
import parser from "ua-parser-js";
import Bowser from "bowser";

export function getPageInformation(): PageInfomation {
  const {
    host,
    hostname,
    href,
    protocol,
    origin,
    port,
    pathname,
    search,
    hash,
  } = window.location;
  const { height, width } = window.screen;
  const { language, userAgent } = navigator;

  return {
    host,
    hostname,
    href,
    protocol,
    origin,
    port,
    pathname,
    search,
    hash,
    title: document.title,
    language: language.substring(0, 2),
    userAgentData: resolveUserAgent(userAgent),
    winScreen: `${width}*${height}`,
    docScreen: `${
      document.documentElement.clientWidth ?? document.body.clientWidth
    }*${document.documentElement.clientHeight ?? document.body.clientHeight}`,
  };
}

function resolveUserAgent(userAgent: string) {
  const browserData = Bowser.parse(userAgent);
  const parserData = parser(userAgent);
  const bowserName = browserData.browser.name ?? parserData.browser.name;
  const bowserVersion =
    browserData.browser.version ?? parserData.browser.version;
  const osName = browserData.os.name ?? parserData.os.name;
  const osVersion = browserData.os.version ?? parserData.os.version;
  const engineName = browserData.engine.name ?? parserData.engine.name;
  const engineVersion = browserData.engine.version ?? parserData.engine.version;
  const deviceType = browserData.platform.type ?? parserData.device.type;
  const deviceModule = browserData.platform.model ?? parserData.device.model;
  const deviceVendor = browserData.platform.vendor ?? parserData.device.vendor;

  return {
    bowserName,
    bowserVersion,
    osName,
    osVersion,
    engineName,
    engineVersion,
    deviceModule,
    deviceType,
    deviceVendor,
  };
}
