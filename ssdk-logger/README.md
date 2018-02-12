# ssdk-logger
A Simple Multi-channel Logger.
------

## _[Deprecation] This package is now deprecated in favor of it's successor [simple.logger](https://www.npmjs.com/package/simple.logger) or the popular lib [log4js](https://www.npmjs.com/package/log4js)._

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
const log = new Logger({ prefix: `HelloWorld` });
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
const s = {
  glossary: {
    title: `example glossary`,
    GlossDiv: {
      title: `S`,
      GlossList: {
        GlossEntry: {
          ID: `SGML`,
          SortAs: `SGML`,
          GlossTerm: `Standard Generalized Markup Language`,
          Acronym: `SGML`,
          Abbrev: `ISO 8879:1986`,
          GlossDef: {
            para: `A meta-markup language, used to create markup languages such as DocBook.`,
            GlossSeeAlso: [`GML`, `XML`],
          },
          GlossSee: `markup`,
        },
      },
    },
  },
};
log.debug(s, `s`);
log.trace(new Error(`A Big Error!`));
```
Output:
```
2017-9-19 15:34:40| INFO|HelloWorld| I'm telling you Something,
2017-9-19 15:34:40| INFO|HelloWorld| A story.
2017-9-19 15:34:40| INFO|HelloWorld| [Story] Begin...
2017-9-19 15:34:40| INFO|HelloWorld|   <BackGround>  Long long ago.
2017-9-19 15:34:40| WARN|HelloWorld|   [Warnings] Begin...
2017-9-19 15:34:40| WARN|HelloWorld|     1.This story will be boring.
2017-9-19 15:34:40| WARN|HelloWorld|     2.It's only single sentence.
2017-9-19 15:34:40| WARN|HelloWorld|     [Warnings] Completed!
2017-9-19 15:34:40| INFO|HelloWorld|   The quick brown fox jumps over the lazy dog.
2017-9-19 15:34:40|ERROR|HelloWorld|   <END OF STORY>  That's it.
2017-9-19 15:34:40| INFO|HelloWorld|   [Story] Completed!
2017-9-19 15:34:40|  LOG|HelloWorld| Now You should see me
2017-9-19 15:34:40|DEBUG|HelloWorld| <s>
{ glossary:
   { title: 'example glossary',
     GlossDiv:
      { title: 'S',
        GlossList:
         { GlossEntry:
            { ID: 'SGML',
              SortAs: 'SGML',
              GlossTerm: 'Standard Generalized Markup Language',
              Acronym: 'SGML',
              Abbrev: 'ISO 8879:1986',
              GlossDef:
               { para: 'A meta-markup language, used to create markup languages such as DocBook.',
                 GlossSeeAlso: [ 'GML', 'XML' ] },
              GlossSee: 'markup' } } } } }
2017-9-19 15:34:40|TRACE|HelloWorld|
Trace: Error: A Big Error!
    at Object.<anonymous> (C:\Users\psong\Desktop\git\maintain\ssdk\ssdk-logger\example.js:47:11)
    at Module._compile (module.js:624:30)
    at Object.Module._extensions..js (module.js:635:10)
    at Module.load (module.js:545:32)
    at tryModuleLoad (module.js:508:12)
    at Function.Module._load (module.js:500:3)
    at Function.Module.runMain (module.js:665:10)
    at startup (bootstrap_node.js:201:16)
    at bootstrap_node.js:626:3
    at Logger._write (C:\Users\psong\Desktop\git\maintain\ssdk\ssdk-logger\index.js:90:23)
    at Logger.trace (C:\Users\psong\Desktop\git\maintain\ssdk\ssdk-logger\index.js:172:17)
    at Object.<anonymous> (C:\Users\psong\Desktop\git\maintain\ssdk\ssdk-logger\example.js:47:5)
    at Module._compile (module.js:624:30)
    at Object.Module._extensions..js (module.js:635:10)
    at Module.load (module.js:545:32)
    at tryModuleLoad (module.js:508:12)
    at Function.Module._load (module.js:500:3)
    at Function.Module.runMain (module.js:665:10)
    at startup (bootstrap_node.js:201:16)
```

FileLogger
-----
example:
```
const { FileLogger } = require(`ssdk-logger`);
const log = new FileLogger(`hello.log`, { prefix:`HelloWorld` });
```

## Lisense
Licensed under MIT
Copyright (c) 2017 Phoenix Song
