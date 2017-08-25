declare namespace logger {
  export type Channel = "error" | "warn" | "info" | "log" | "debug" | "trace";
  export interface Logger {
    LEVELS: Channel[];
    logLevel: Channel;
    logPrefix: string;
    logIndent: number;
    _console: Console;
    /**
   * Creates an instance of Logger.
   * @param {object} [Options = { level = `info`, prefix = ``, indent = 0, outStream }]
   * @param {string} [Options.level=`info`] Log Level. Determines the verboseness of the logger.
   * @param {string} [Options.prefix=``] Prefix label. The Label showed infront of every message.
   * @param {number} [Options.indent=0] Initial indentation. The initial number of spaces to indent.
   * @param {stream.Writable|stream.Writable[]} [Options.outStream=[stdout, stderr]]
   * @memberof Logger
   */
    constructor(options?: {
      level?: string = `info`;
      prefix?: string | Buffer = ``;
      indent?: number = 0;
      outStream?: WritableStream | WritableStream[];
    });
    /**
   * Internal channel input validator.
   *
   * @param {any} channel a channel/level input.
   * @returns {string} a valid channel string.
   * @memberof Logger
   */
    _validateChannelInput(channel: Channel): string;
    /**
   * Internal write function, controls output template and output level control.
   *
   * @param {any[]} data Data to be written.
   * @param {string} [channel=`info`] Log Channel.
   * @param {string|Buffer} [prefix=``] Sub-Prefix label.
   * @param {bool} [rawFormat=false] If output in the raw format.
   * @return {boolean} If message emitted or not.
   * @memberof Logger
   */
    _write(
      data: any,
      option: {
        channel?: Channel = `info`;
        prefix?: string | Buffer = ``;
        rawFormat?: boolean = false;
        indentAfter?: number = 0;
      },
    ): boolean;
    /**
   * Log data on `error` channel with Console.error().
   *
   * @param {any} data Data to be written.
   * @param {string|Buffer} [prefix=``] Prefix label.
   * @return {boolean} If message emitted or not.
   * @memberof Logger
   */
    error(data: any, prefix?: string | Buffer = ``): boolean;
    /**
   * Log data on `warn` channel with Console.error().
   *
   * @param {any} data Data to be written.
   * @param {string|Buffer} [prefix=``] Prefix label.
   * @return {boolean} If message emitted or not.
   * @memberof Logger
   */
    warn(data: any, prefix?: string | Buffer = ``): boolean;
    /**
   * Log data on `info` channel with Console.log().
   *
   * @param {any} data Data to be written.
   * @param {string|Buffer} [prefix=``] Prefix label.
   * @return {boolean} If message emitted or not.
   * @memberof Logger
   */
    info(data: any, prefix?: string | Buffer = ``): boolean;
    /**
   * Log data on `log` channel with Console.log().
   *
   * @param {any} data Data to be written.
   * @param {string|Buffer} [prefix=``] Prefix label.
   * @return {boolean} If message emitted or not.
   * @memberof Logger
   */
    log(data: any, prefix?: string | Buffer = ``): boolean;
    /**
   * Log data on `debug` channel with Console.log().
   *
   * @param {any} data Data to be written.
   * @param {string|Buffer} [prefix=``] Prefix label.
   * @return {boolean} If message emitted or not.
   * @memberof Logger
   */
    debug(data: any, prefix?: string | Buffer = ``): boolean;
    /**
   * Log data on `trace` channel with Console.trace().
   *
   * @param {any} data Data to be written.
   * @param {string|Buffer} [prefix=``] Prefix label.
   * @return {boolean} If message emitted or not.
   * @memberof Logger
   */
    trace(data: any, prefix?: string | Buffer = ``): boolean;
    /**
   * Output data without formating.
   *
   * @param {any} data Data to be written.
   * @param {string} [channel=`info`] Output Channel.
   * @return {boolean} If message emitted or not.
   * @memberof Logger
   */
    raw(data: any, prefix?: string | Buffer = ``): boolean;
    /**
   * Group the logger calls by block and indent following logs.
   *
   * @param {string|Buffer} label Group label.
   * @param {string} [channel=`info`] Log Channel.
   * @return {boolean} If message emitted or not.
   * @memberof Logger
   */
    enterBlock(label: string | Buffer, channel?: string = `info`): boolean;
    /**
   * Ending the logger call block and unindent logs after.
   *
   * @param {string|Buffer} label Group label.
   * @param {string} [channel=`info`] Log Channel.
   * @return {boolean} If message emitted or not.
   * @memberof Logger
   */
    exitBlock(label: string | Buffer, channel?: string = `info`): boolean;
    /**
   * Change the Instance Log Level.
   *
   * @param {string} [level=`info`]
   * @return {string} Previous Log Level pre-reassignment.
   * @memberof Logger
   */
    setLogLevel(level?: string = `info`): string;
  }

  export interface FileLogger extends Logger {
    /**
   * FileLogger Constructor
   *
   * @param {string|string[]} filename The name of the log files, can be either a single file for both stdout and stderr or a pair of files as [stdout, stderr].
   *
   * @param {string} [Options.level=`info`] Log Level. Determines the verboseness of the logger.
   * @param {string} [Options.prefix=``] Prefix label. The Label showed infront of every message.
   * @param {number} [Options.indent=0] Initial indentation. The initial number of spaces to indent.
   */
    constructor(
      filename: string | string[],
      options?: {
        level?: string = `info`;
        prefix?: string | Buffer = ``;
        indent?: number = 0;
      } = {},
    );
  }
}
export = logger;
