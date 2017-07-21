/**
 * Script-SDK - Logger
 *
 * @author Phoenix(github.com/azusa0127)
 * @version 1.0.0
 */
const path = require(`path`);
const { createWriteStream } = require(`fs`);

class Logger {
  /**
   * Logger Constructor
   *
   * @param {object} Options the only acceptable argument.
   *
   * @param {string|number} [Options.level=`info`] Log Level. Determines the verboseness of the logger.
   * @param {string} [Options.prefix=``] Prefix label. The Label showed infront of every message.
   * @param {number} [Options.indent=0] Initial indentation. The initial number of spaces to indent.
   * @param {stream.Writable|stream.Writable[]} [Options.outStream=console] The output stream(s) for the console, can be either a single stream for both stdout and stderr or [stdout, stderr].
   */
  constructor({ level, prefix, indent, outStream } = {}) {
    this.LEVELS = [`error`, `warn`, `info`, `log`, `debug`, `trace`];
    this.logLevel = level
      ? typeof level === `string` ? this.LEVELS.indexOf(level) : level
      : this.LEVELS.indexOf(`info`);
    this.logPrefix = prefix && typeof prefix === `string` ? `[${prefix}]` : ``;
    this.logIndent = indent && typeof indent === `number` ? indent : 0;
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
   * @param {string|number} [channel=`info`] Log Channel. Can be level string or its array index.
   * @param {string|Buffer} [prefix=null] Prefix label. uses logPrefix if null.
   */
  _write(data, channel = `info`, prefix = null) {
    if ((typeof channel === `string` ? this.LEVELS.indexOf(channel) : channel) <= this.logLevel) {
      // Debug output optimization
      if (
        typeof data !== `string` &&
        (channel === `debug` || channel === this.LEVELS.indexOf(`debug`))
      )
        data = JSON.stringify(data, null, 2);

      const timeStamp = new Date().toLocaleString();
      if (prefix && prefix.length) prefix = `<${prefix}>`;
      const template = `${timeStamp} |${channel.toUpperCase()}| ${prefix
        ? `${` `.repeat(this.logIndent + this.logPrefix.length)} ${prefix}`
        : `${this.logPrefix}${` `.repeat(this.logIndent)}`} ${data}`;
      switch (channel) {
        case `error`:
        case `warn`:
          this.Console.error(template);
          break;
        case `info`:
        case `log`:
        case `debug`:
          this.Console.log(template);
          break;
        case `trace`:
          this.Console.trace(template);
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
    this._write(data, `error`, prefix);
  }
  /**
   * Log data on `warn` channel with Console.error().
   *
   * @param {any} data Data to be written.
   * @param {string|Buffer} [prefix=``] Prefix label.
   */
  warn(data, prefix = ``) {
    this._write(data, `warn`, prefix);
  }
  /**
   * Log data on `info` channel with Console.log().
   *
   * @param {any} data Data to be written.
   * @param {string|Buffer} [prefix=``] Prefix label.
   */
  info(data, prefix = ``) {
    this._write(data, `info`, prefix);
  }
  /**
   * Log data on `log` channel with Console.log().
   *
   * @param {any} data Data to be written.
   * @param {string|Buffer} [prefix=``] Prefix label.
   */
  log(data, prefix = ``) {
    this._write(data, `log`, prefix);
  }
  /**
   * Log data on `debug` channel with Console.log().
   *
   * @param {any} data Data to be written.
   * @param {string|Buffer} [prefix=``] Prefix label.
   */
  debug(data, prefix = ``) {
    this._write(data, `debug`, prefix);
  }
  /**
   * Log data on `trace` channel with Console.trace().
   *
   * @param {any} data Data to be written.
   * @param {string|Buffer} [prefix=``] Prefix label.
   */
  trace(data, prefix = null) {
    this._write(data, `trace`, prefix);
  }

  /**
   * Group the following logger calls by block and increase indentation.
   *
   * @param {string|Buffer} [label=``] Group label.
   * @param {string|number} [channel=`info`] Log Channel. Can be level string or its array index.
   */
  enterBlock(label = ``, channel = `info`) {
    this._write(`${label} Begin...`, channel);
    this.logIndent += 2;
  }
  /**
   * Ending the logger call block and decrease indentation.
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
  constructor(filename, { level, prefix, indent } = {}) {
    const outStream = Array.isArray(filename) ? filename.map(x => path.resolve(x)).map(x => createWriteStream(x)) : createWriteStream(path.resolve(filename));
    super({ level, prefix, indent, outStream});
  }
}

module.exports = { Logger, FileLogger };
