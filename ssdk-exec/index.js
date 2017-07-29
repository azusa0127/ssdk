/**
 * Script-SDK - Exec Lib.
 *
 * @author Phoenix(github.com/azusa0127)
 * @version 1.0.0
 */
/**
 * ============================================================================
 * Requires.
 * ============================================================================
 */
const { EOL } = require(`os`);
const { spawn } = require(`child_process`);
/**
 * ============================================================================
 * Library.
 * ============================================================================
 */
/**
 * Asynchronizely execute a shell command. fails when the exit code is non-zero.
 *
 * @param {string} command : shell command.
 * @param {string[]} [args=[]] : arguments for the command.
 * @param {Object} [Options] Optional Options
 *
 * @param {bool} [Options.verbose] If also output the data to console or logger lively.
 * @param {Logger|console.Console} [Options.logger] logger to be used with verbose output.
 * @param {string} [Options.cwd] Working directory for the command execution.
 * @param {Object} [Options.env] Environment vars for the command execution.
 * @param {bool|string} [Options.shell] The shell command to run.
 *
 * @return {{code, stdout, stderr [, message]}}
 */
const simpleExec = async (
  command,
  args = [],
  { cwd = process.cwd(), env = process.env, shell = true, verbose = false, logger = console } = {},
) =>
  new Promise((resolve, reject) => {
    let stdout = ``,
      stderr = ``;
    const cmd = spawn(command, args, { cwd, env, shell });
    if (verbose) {
      logger.info(`Executing "${command} ${args.join(` `)}"`);
      cmd.stdout.pipe(logger._stdout);
      cmd.stderr.pipe(logger._stderr);
    }
    cmd.stdout.on(`data`, chunk => {
      stdout += `${chunk}`;
    });
    cmd.stderr.on(`data`, chunk => {
      stderr += `${chunk}`;
    });
    cmd.on(`error`, err => reject(Object.assign({ code: -1, stdout, stderr }, err)));
    cmd.on(
      `close`,
      code =>
        code
          ? reject(
              Object.assign(
                new Error(
                  `Command "${command} ${args.join(` `)}" failed with code ${code}.${EOL}${stdout.length
                    ? `[stdout]: ${stdout}${EOL} `
                    : ``}${stderr.length ? `[stderr]: ${stderr}${EOL} ` : ``}`,
                ),
                {
                  code,
                  stdout,
                  stderr,
                },
              ),
            )
          : resolve({ code, stdout, stderr }),
    );
  });
/**
 * ============================================================================
 * Exports.
 * ============================================================================
 */
module.exports = { simpleExec };
