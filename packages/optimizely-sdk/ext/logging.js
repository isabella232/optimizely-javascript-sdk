export default {
  LogLevel: {},
  ConsoleLogHandler: class {},
  getErrorHandler: () => ({
    handleError: () => {}
  }),
  getLogger: () => ({
    debug: () => {},
    info: () => {},
    log: () => {},
    warn: () => {},
    error: () => {}
  }),
  setLogHandler: () => {},
  setLogLevel: () => {}
}
