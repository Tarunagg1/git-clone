const CatFileCOmmand = require('./cat-file');
const CommitCommand = require('./commit');
const HashObjectCOmmand = require('./hash-object');
const LSTreeCommand = require('./ls-tree');
const WriteTreeCommand = require('./write-tree');


module.exports = {
    CatFileCOmmand,
    HashObjectCOmmand,
    LSTreeCommand,
    WriteTreeCommand,
    CommitCommand
}

