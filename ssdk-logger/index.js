/**
 * @file Script-SDK - Logger
 * @version 1.1.0
 * @author Phoenix Song <github.com/azusa0127>
 * @copyright Phoenix Song (c) 2017
 */
/**
 * ============================================================================
 * Requires.
 * ============================================================================
 */
const path = require(`path`);
const { createWriteStream } = require(`fs`);
const { format, inspect } = require(`util`);
/**
 * ============================================================================
 * Library.
 * ============================================================================
 */
class Logger {
  /**
   * Creates an instance of Logger.
   * @param {object} [Options = { level = `info`, prefix = ``, indent = 0, outStream }]
   * @param {string|number} [Options.level=`info`] Log Level. Determines the verboseness of the logger.
   * @param {string} [Options.prefix=``] Prefix label. The Label showed infront of every message.
   * @param {number} [Options.indent=0] Initial indentation. The initial number of spaces to indent.
   * @param {stream.Writable|stream.Writable[]} [Options.outStream=[stdout, stderr]]
   * @memberof Logger
   */
  constructor({ level = `info`, prefix = ``, indent = 0, outStream } = {}) {
    this.LEVELS = [`error`, `warn`, `info`, `log`, `debug`, `trace`];
    this.logLevel = typeof level === `string` ? this.LEVELS.indexOf(level) : level;
    this.logPrefix = typeof prefix === `string` ? prefix : ``;
    this.logIndent = typeof indent === `number` ? indent : 0;
    this.Console = outStream
      ? Array.isArray(outStream)
        ? new console.Console(...outStream)
        : new console.Console(outStream, outStream)
      : console;
  }
  /**
   * Internal write function, controls output template and output level control.
   *
   * @param {any[]} data Data to be written.
   * @param {string|number} [channel=`info`] Log Channel. Can be level string or its array index.
   * @param {string|Buffer} [prefix=``] Sub-Prefix label.
   * @param {bool} [rawFormat=false] If output in the raw format.
   * @memberof Logger
   */
  _write(data, { channel = `info`, prefix = ``, rawFormat = false, indentAfter = 0 }) {
    if (typeof channel === `number`) channel = this.LEVELS[channel];
    if (this.LEVELS.indexOf(channel) <= this.logLevel) {
      const timeStamp = `${new Date().toLocaleString()}|`;
      // Format prefixes.
      const prefixes = rawFormat
        ? ``
        : format(
            `%s%s%s%s%s`,
            timeStamp,
            ` `.repeat(5 - channel.length),
            channel.toUpperCase(),
            this.logPrefix.length ? `|${this.logPrefix}|` : `|`,
            prefix.length ? ` <${prefix}> ` : ``,
          );
      // Re-format object string.
      if (typeof data !== `string`) data = inspect(data, false, 10, true);
      const message =
        data.indexOf(`\n`) !== data.lastIndexOf(`\n`) && !rawFormat
          ? `${prefixes}\n${data}`
          : format(prefixes, data);
      switch (channel) {
        case `error`:
        case `warn`:
          this.Console.error(message);
          break;
        case `info`:
        case `log`:
        case `debug`:
          this.Console.log(message);
          break;
        case `trace`:
          this.Console.trace(message);
          break;
        default:
          throw new Error(`Invalid Channel ${channel}!`);
      }
      // Change Indentation
      this.indent += indentAfter;
    }
  }
  /**
   * Log data on `error` channel with Console.error().
   *
   * @param {any} data Data to be written.
   * @param {string|Buffer} [prefix=``] Prefix label.
   * @memberof Logger
   */
  error(data, prefix = ``) {
    this._write(data, { channel: `error`, prefix });
  }
  /**
   * Log data on `warn` channel with Console.error().
   *
   * @param {any} data Data to be written.
   * @param {string|Buffer} [prefix=``] Prefix label.
   * @memberof Logger
   */
  warn(data, prefix = ``) {
    this._write(data, { channel: `warn`, prefix });
  }
  /**
   * Log data on `info` channel with Console.log().
   *
   * @param {any} data Data to be written.
   * @param {string|Buffer} [prefix=``] Prefix label.
   * @memberof Logger
   */
  info(data, prefix = ``) {
    this._write(data, { channel: `info`, prefix });
  }
  /**
   * Log data on `log` channel with Console.log().
   *
   * @param {any} data Data to be written.
   * @param {string|Buffer} [prefix=``] Prefix label.
   * @memberof Logger
   */
  log(data, prefix = ``) {
    this._write(data, { channel: `log`, prefix });
  }
  /**
   * Log data on `debug` channel with Console.log().
   *
   * @param {any} data Data to be written.
   * @param {string|Buffer} [prefix=``] Prefix label.
   * @memberof Logger
   */
  debug(data, prefix = ``) {
    this._write(data, { channel: `debug`, prefix });
  }
  /**
   * Log data on `trace` channel with Console.trace().
   *
   * @param {any} data Data to be written.
   * @param {string|Buffer} [prefix=``] Prefix label.
   * @memberof Logger
   */
  trace(data, prefix = ``) {
    this._write(data, { channel: `trace`, prefix });
  }
  /**
   * Output data without formating.
   *
   * @param {any} data Data to be written.
   * @param {string|number} [channel=`info`] Output Channel.
   * @memberof Logger
   */
  raw(data, channel = `info`) {
    this._write(data, { channel, rawFormat: true });
  }
  /**
   * Group the logger calls by block and indent following logs.
   *
   * @param {string|Buffer} label Group label.
   * @param {string|number} [channel=`info`] Log Channel. Can be level string or its array index.
   * @memberof Logger
   */
  enterBlock(label, channel = `info`) {
    this._write(`[${label}] Begin...`, { channel, indentAfter: 2 });
  }
  /**
   * Ending the logger call block and unindent logs after.
   *
   * @param {string|Buffer} label Group label.
   * @param {string|number} [channel=`info`] Log Channel. Can be level string or its array index.
   * @memberof Logger
   */
  exitBlock(label, channel = `info`) {
    this._write(`[${label}] Completed!`, { channel, indentAfter: -2 });
  }
  /**
   * Change the Instance Log Level.
   *
   * @param {string} [level=`info`]
   * @return {number} Previous Log Level pre-operation.
   * @memberof Logger
   */
  setLogLevel(level = `info`) {
    const prevLevel = this.logLevel;
    this.logLevel = typeof level === `string` ? this.LEVELS.indexOf(level) : level;
    return prevLevel;
  }
}

class FileLogger extends Logger {
  /**
   * FileLogger Constructor
   *
   * @param {string|string[]} filename The name of the log files, can be either a single file for both stdout and stderr or a pair of files as [stdout, stderr].
   *
   * @param {string|number} [Options.level=`info`] Log Level. Determines the verboseness of the logger.
   * @param {string} [Options.prefix=``] Prefix label. The Label showed infront of every message.
   * @param {number} [Options.indent=0] Initial indentation. The initial number of spaces to indent.
   */
  constructor(filename, { level, prefix, indent } = {}) {
    const outStream = Array.isArray(filename)
      ? filename.map(x => path.resolve(x)).map(x => createWriteStream(x))
      : createWriteStream(path.resolve(filename));
    super({ level, prefix, indent, outStream });
  }
}
/**
 * ============================================================================
 * Exports.
 * ============================================================================
 */
module.exports = { Logger, FileLogger };
