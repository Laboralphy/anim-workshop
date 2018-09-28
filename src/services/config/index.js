const fs = require('fs');
const projectTree = require('../project-tree');
module.exports = JSON.parse(fs.readFileSync(projectTree.getConfigFilename(), {encoding: 'utf-8'}));