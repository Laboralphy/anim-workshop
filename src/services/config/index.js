const fs = require('fs');
const projectTree = require('../project-tree');


const CONFIG_FOUND = 0;
const CONFIG_NOT_FOUND = 1;
const CONFIG_INACCESSIBLE = 2;
const CONFIG_ERROR = 3;


function testConfigAccess(s) {
    try {
        let b = fs.accessSync(s, fs.constants.R_OK | fs.constants.W_OK);
        return CONFIG_FOUND;
    } catch (e) {
        switch (e.code) {
            case 'ENOENT':
                return CONFIG_NOT_FOUND;

            case 'EACCES':
                return CONFIG_INACCESSIBLE;

            default:
                return CONFIG_ERROR;
        }
    }
}

function createConfig(s) {
    fs.writeFileSync(
        s,
        JSON.stringify({
            "video": {
                "width": 640,
                "height": 480
            },
            "upload": {
                "host": "127.0.0.1",
                "port": 22,
                "username": "****",
                "password": "****",
                "remotePath": "/remote/path"
            }
        }),
        {
            encoding: 'utf-8'
        }
    );
}

function readConfig(s) {
    return JSON.parse(fs.readFileSync(s, {encoding: 'utf-8'}));
}

function main() {
    let s = projectTree.getConfigFilename();
    switch (testConfigAccess(s)) {
        case CONFIG_INACCESSIBLE:
            throw new Error('config.json : write permission denied');

        case CONFIG_NOT_FOUND:
            createConfig(s);
    }
    return readConfig(s);
}

module.exports = main();