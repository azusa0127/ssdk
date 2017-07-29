# ssdk-exec

Shell/Cmd command excution library for simplier scripting.

## Install

```bash
npm install ssdk-exec
```

```javascript
const { simpleExec } = require(`ssdk-exec`);
```

## API

## simpleExec(cmd [, args, Options])
 * `cmd` {string} shell command.
 * `args` {string[]} [Optional] arguments for the command (Default: `[]`).
 * `Options` {object} [Optional] Optional Options
 *
 * `Options.verbose` {bool} If also output the data to console or logger lively (Default: `false`).
 * `Options.logger` {Logger|console.Console} logger to be used with verbose output (Default: `console`).
 * `Options.cwd` {string} Working directory for the command execution (Default: `process.cwd()`).
 * `Options.env` {object} Environment vars for the command execution (Default: `process.env`).
 * `Options.shell` {bool|string} The shell command to run (Default: `true`).

Asynchronizely execute a shell command, returns full details of the execution after the execution.

Fails when the exit code is non-zero or error in the execution.

*Return*
`{code, stdout, stderr [, message]}`
* `code` {number} exit code.
* `stdout` {string} stdout stream context in the session.
* `stderr` {string} stderr stream context in the session.
* `message` {string} [Only in rejected promise] Brief error message.

*Examples*
```javascript
// Parallel excution and output the details on stdout in real-time;.
simpleExec(`ping`, [`Amazon.ca`], { verbose: true });
simpleExec(`ping`, [`Google.ca`], { verbose: true });
```

```javascript
// Parallel excution and save result in variables;
const main = async () =>{
  const [a, b] = await Promise.all([
    simpleExec(`ping`, [`Amazon.ca`]),
    simpleExec(`ping`, [`Google.ca`]),
  ]);
  console.log(`Amazon Result:`);
  console.log(a.stdout);
  console.log(`Google Result:`);
  console.log(b.stdout);
};

main();
```

```javascript
// Parallel excution and pass results into custom loggers in real-time;
const {Logger, FileLogger} = require(`ssdk-logger`);

const consoleLogger = new Logger({prefix:`Demo`}),
  fileLogger = new FileLogger(`a.log`, {prefix:`Demo`});

const main = async () =>{
  const [a, b] = await Promise.all([
    simpleExec(`ping`, [`Amazon.ca`], {verbose: true, logger:consoleLogger}),
    simpleExec(`ping`, [`Google.ca`], {verbose: true, logger:fileLogger}),
  ]);
  console.log(`a.code: ${a.code}`);
  console.log(`b.code: ${b.code}`);
};

main();
```

## Lisense
Licensed under MIT
Copyright (c) 2017 Phoenix Song
