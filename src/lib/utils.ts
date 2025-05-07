import debug from "debug";

export const logger: debug.Debugger = debug(process.env.MODULE_NAME || "");
