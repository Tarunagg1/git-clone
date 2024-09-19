const path = require('path');
const fs = require('fs');
const zlib = require('zlib');

class CatFileCOmmand {
    constructor(flag, commitSHA) {
        this.flag = flag;
        this.commitSHA = commitSHA;
    }
    execute() {
        const flag = this.flag;
        const commitSHA = this.commitSHA;

        switch (flag) {
            case '-p': {
                const folder = commitSHA.slice(0, 2);
                const file = commitSHA.slice(2);

                const completePath = path.join(process.cwd(), '.git', "objects", folder, file);
                console.log(completePath);

                if (!fs.existsSync(completePath)) {
                    throw new Error(`Not a valid name ${commitSHA}`)
                }

                const fileContents = fs.readFileSync(completePath);
                const outBuffer = zlib.inflateSync(fileContents);
                const output = outBuffer.toString().split("\x00")[1]

                process.stdout.write(output);
            }
            default:
                break;
        }
    }
}

module.exports = CatFileCOmmand;