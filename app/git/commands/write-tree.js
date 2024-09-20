const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const zlib = require('zlib');

function writeFIleBlob(filePath) {
    const contents = fs.readFileSync(filePath);
    const len = contents.length;

    const header = `blob ${len}\0`;
    const blob = Buffer.concat([Buffer.from(header), contents]);

    const hash = crypto.createHash('sha1').update(blob).digest("hex");

    const folder = hash.slice(0, 2);
    const file = hash.slice(2);

    const completeFolderPath = path.join(process.cwd(), ".git", "objects", folder);

    if (!fs.existsSync(completeFolderPath)) {
        fs.mkdirSync(completeFolderPath);
    }

    const compressedData = zlib.deflateSync(blob);

    fs.writeFileSync(path.join(completeFolderPath, file), compressedData);

    return hash;
}

class WriteTreeCommand {
    constructor() { }

    execute() {

        function recursiveCreateTree(basePath) {
            const results = [];
            const dirCntents = fs.readdirSync(basePath);

            for (const dirContent of dirCntents) {
                if (dirCntents.includes('.git')) return;

                const currentPath = path.join(basePath, dirContent);
                const stat = fs.statSync(currentPath);
                if (stat.isDirectory()) {
                    const sha = recursiveCreateTree(currentPath);
                    if (sha) {
                        results.push({ mode: '4000', basename: path.basename(currentPath), sha });
                    }
                } else if (stat.isFile()) {
                    const sha = writeFIleBlob(currentPath);
                    results.push({ mode: '100644', basename: path.basename(currentPath), sha });
                }
            }

            if (dirCntents.length === 0 || results.length === 0) return null;

            const treeData = results.reduce((acc, curr) => {
                const { mode, sha, basename } = curr;
                return Buffer.concat([acc, Buffer.from(`${mode} ${basename}\0`), Buffer.from(sha, "hex")]);
            }, Buffer.alloc(0));

            const tree = Buffer.concat([Buffer.from(`tree ${treeData.length}\0`), treeData]);
            const hash = crypto.createHash("sha1").update(tree).digest("hex");

            const folder = hash.slice(0, 2);
            const file = hash.slice(2);

            const treeFolderPath = path.join(process.cwd(), '.git', '.objects', folder);

            if (!fs.existsSync(treeFolderPath)) {
                fs.mkdirSync(treeFolderPath);
            }

            const compressData = zlib.deflateSync(tree);

            fs.writeFileSync(path.join(treeFolderPath, file), compressData);

            return hash;
        }

        const sha = recursiveCreateTree(process.cwd());
        process.stdout.write(sha);
    }
}

module.exports = WriteTreeCommand;