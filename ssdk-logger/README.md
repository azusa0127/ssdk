# ssdk-logger
A Simple Multi-channel Logger.
------

## What it does
* Drop-in replacement for `console` - yes, you can use it exactly as using `console`.
* Multi-Channel control - allow verbose logs to be dynamically muted.
* Output to any stream - logs can be displayed in console, file, network or any stream.Writebale targets.
* Log formatiing - elegant and effective format for log messages.
* Debug channel optimization - automatically stringfy non-string data with JSON.stringfy in debug channel.
* Block control with indentation - Indent every message in the same block with nested blocks supported.


## Install
```bash
npm install ssdk-logger
```
```javascript
// Require the desired logger in the project.
const Logger = require(`ssdk-logger`).Logger;
const FileLogger = require(`ssdk-logger`).FileLogger;
// Or using ES6 object destructuring assignment.
const {Logger, FileLogger} = require(`ssdk-logger`);
```

## API
Logger
-----
### example:
```javascript
const log = new Logger({ prefix:`HelloWorld` });
log.info(`I'm telling you Something,`);
log.info(`A story.`);
log.debug(`This Message will not be seen.`);
log.trace(Error(`This Will neither be traced.`));
log.log(`Nor this one -- as the default log level is 'info'!`);

log.enterBlock(`Story`);
log.info(`Long long ago.`, `BackGround`);
log.enterBlock(`Warnings`, `warn`);
log.warn(`1.This story will be boring.`);
log.warn(`2.It's only single sentence.`);
log.exitBlock(`Warnings`, `warn`);
log.info(`The quick brown fox jumps over the lazy dog.`);
log.error(`That's it.`, `END OF STORY`);
log.exitBlock(`Story`);

// Change log level to show every channel.
log.setLogLevel(`trace`);
log.log(`Now You should see me`);
const s = {a:1, b:[2, 3, 4]};
log.debug(s, `s`);
log.trace(new Error(`A Big Error!`));
```
Output:
```
2017-7-23 22:59:25| INFO|HelloWorld| I'm telling you Something,
2017-7-23 22:59:25| INFO|HelloWorld| A story.
2017-7-23 22:59:25| INFO|HelloWorld| [Story] Begin...
2017-7-23 22:59:25| INFO|HelloWorld|  <BackGround>  Long long ago.
2017-7-23 22:59:25| INFO|HelloWorld|   [Warnings] Begin...
2017-7-23 22:59:25| WARN|HelloWorld|     1.This story will be boring.
2017-7-23 22:59:25| WARN|HelloWorld|     2.It's only single sentence.
2017-7-23 22:59:25| INFO|HelloWorld|   [Warnings] Completed!
2017-7-23 22:59:25| INFO|HelloWorld|   The quick brown fox jumps over the lazy dog.
2017-7-23 22:59:25|ERROR|HelloWorld|  <END OF STORY>  That's it.
2017-7-23 22:59:25| INFO|HelloWorld| [Story] Completed!
2017-7-23 22:59:25|  LOG|HelloWorld| Now You should see me
2017-7-23 22:59:25|DEBUG|HelloWorld|<s>  {
                                           "a": 1,
                                           "b": [
                                             2,
                                             3,
                                             4
                                           ]
                                         }
Trace: 2017-7-23 22:59:25|TRACE|HelloWorld| Error: A Big Error!
    at Logger._write (~/ssdk/ssdk-logger/index.js:76:24)
    at Logger.trace (~/ssdk/ssdk-logger/index.js:141:10)
    at Object.<anonymous> (~/ssdk/ssdk-logger/x.js:24:5)
    at Module._compile (module.js:569:30)
    at Object.Module._extensions..js (module.js:580:10)
    at Module.load (module.js:503:32)
    at tryModuleLoad (module.js:466:12)
    at Function.Module._load (module.js:458:3)
    at Function.Module.runMain (module.js:605:10)
    at startup (bootstrap_node.js:158:16)
```

FileLogger
-----
example:
```
const { FileLogger } = require(`./index.js`);
const log = new FileLogger(`hello.log`, { prefix:`HelloWorld` });
```

## Lisense
Licensed under MIT
Copyright (c) 2017 Phoenix Song
