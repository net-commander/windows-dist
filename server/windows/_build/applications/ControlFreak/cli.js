"use strict";
const cli = require("yargs");
const pathUtil = require("path");
function create() {
    const argv = cli.argv;
    const cwd = process.cwd();
    cli.options('v', {
        alias: 'version',
        description: 'Display version number'
    });
    cli.options('user', {
        alias: 'u',
        description: 'Specify user directory'
    });
    cli.options('system', {
        alias: 's',
        description: 'Specify system directory'
    });
    cli.options('root', {
        alias: 'r',
        description: 'Specify control-freak root directory'
    });
    cli.options('port', {
        alias: 'p',
        description: 'Specify http server port',
        default: "5555"
    });
    cli.options('host', {
        alias: 'h',
        description: 'Specify http host',
        default: "0.0.0.0"
    });
    cli.options('info', {
        alias: 'i',
        description: 'show information'
    });
    if (argv.h || argv.help) {
        cli.showHelp();
        process.exit();
    }
    else if (argv.v || argv.version) {
        const pkginfo = require(pathUtil.join(cwd, './package.json'));
        console.log(pkginfo.version);
        process.exit();
    }
}
exports.create = create;
/*
const defaultArgs = (yargs) => {
    return yargs.option('target', {
        alias: 'target',
        "default": process.cwd()
    });
}
*/
//# sourceMappingURL=cli.js.map