/**
 * Script-SDK - Logger
 *
 * @author Phoenix(github.com/azusa0127)
 * @version 1.0.0
 */
/**
 * ============================================================================
 * Requires.
 * ============================================================================
 */
const path = require(`path`);
const { createWriteStream } = require(`fs`);
/**
 * ============================================================================
 * Library.
 * ============================================================================
 */
class Logger {
  /**
   * Logger Constructor
   *
   * @param {string|number} [Options.level=`info`] Log Level. Determines the verboseness of the logger.
   * @param {string} [Options.prefix=``] Prefix label. The Label showed infront of every message.
   * @param {number} [Options.indent=0] Initial indentation. The initial number of spaces to indent.
   * @param {stream.Writable|stream.Writable[]} [Options.outStream=console] The output stream(s) for the console, can be either a single stream for both stdout and stderr or [stdout, stderr].
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
   * @param {any} data Data to be written.
   * @param {string|number} [Options.channel=`info`] Log Channel. Can be level string or its array index.
   * @param {string|Buffer} [Options.prefix=``] Sub-Prefix label.
   * @param {bool} [rawFormat=false] If output in the raw format.
   */
  _write(data, { channel = `info`, prefix = ``, rawFormat = false }) {
    if (typeof channel === `number`) channel = this.LEVELS[channel];
    if (this.LEVELS.indexOf(channel) <= this.logLevel) {
      // Debug output optimization
      if (channel === `debug` && typeof data !== `string`) data = JSON.stringify(data, null, 2);
      const timeStamp = new Date().toLocaleString(),
        prefixes = `${timeStamp}|${channel.toUpperCase()}${` `.repeat(5 - channel.length)}${this
          .logPrefix.length
          ? `|${this.logPrefix}`
          : ``}|${` `.repeat(this.logIndent)}${prefix.length ? `<${prefix}> ` : ``}`,
        message = rawFormat
          ? data
          : `${prefixes}${data && typeof data === `string`
              ? data.replace(/\n/g, `\n${` `.repeat(prefixes.length)}`)
              : data}`;
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
    }
  }
  /**
   * Log data on `error` channel with Console.error().
   *
   * @param {any} data Data to be written.
   * @param {string|Buffer} [prefix=``] Prefix label.
   */
  error(data, prefix = ``) {
    this._write(data, { channel:`error`, prefix});
  }
  /**
   * Log data on `warn` channel with Console.error().
   *
   * @param {any} data Data to be written.
   * @param {string|Buffer} [prefix=``] Prefix label.
   */
  warn(data, prefix = ``) {
    this._write(data, { channel:`warn`, prefix});
  }
  /**
   * Log data on `info` channel with Console.log().
   *
   * @param {any} data Data to be written.
   * @param {string|Buffer} [prefix=``] Prefix label.
   */
  info(data, prefix = ``) {
    this._write(data, { channel:`info`, prefix});
  }
  /**
   * Log data on `log` channel with Console.log().
   *
   * @param {any} data Data to be written.
   * @param {string|Buffer} [prefix=``] Prefix label.
   */
  log(data, prefix = ``) {
    this._write(data, { channel:`log`, prefix});
  }
  /**
   * Log data on `debug` channel with Console.log().
   *
   * @param {any} data Data to be written.
   * @param {string|Buffer} [prefix=``] Prefix label.
   */
  debug(data, prefix = ``) {
    this._write(data, { channel:`debug`, prefix});
  }
  /**
   * Log data on `trace` channel with Console.trace().
   *
   * @param {any} data Data to be written.
   * @param {string|Buffer} [prefix=``] Prefix label.
   */
  trace(data, prefix = null) {
    this._write(data, { channel:`trace`, prefix});
  }
  /**
   * Output data in raw format.
   *
   * @param {any} data Data to be written.
   * @param {string|number} [channel=`info`] Output Channel.
   */
  raw(data, channel = `info`) {
    this._write(data, {channel, rawFormat:true});
  }
  /**
   * Group the logger calls by block and indent following logs.
   *
   * @param {string|Buffer} [label=``] Group label.
   * @param {string|number} [channel=`info`] Log Channel. Can be level string or its array index.
   */
  enterBlock(label = ``, channel = `info`) {
    this._write(`${label} Begin...`, channel);
    this.logIndent += 2;
  }
  /**
   * Ending the logger call block and unindent logs after.
   *
   * @param {string|Buffer} [label=``] Group label.
   * @param {string|number} [channel=`info`] Log Channel. Can be level string or its array index.
   */
  exitBlock(label = ``, channel = `info`) {
    this.logIndent -= 2;
    this._write(`${label} Completed!`, channel);
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
