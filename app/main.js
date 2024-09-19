const fs = require("fs");
const path = require("path");
const { CatFileCOmmand, HashObjectCOmmand } = require('./git/commands');
const GitClient = require('./git/client');

// You can use print statements as follows for debugging, they'll be visible when running tests.
// console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const command = process.argv[2];

const gitClient = new GitClient();


switch (command) {
  case "init":
    createGitDirectory();
    break;
  case "cat-file":
    handelCatFileCommand();
    break
  case "hash-object":
    handelHashObjectCommand();
    break;
  default:
    throw new Error(`Unknown command ${command}`);
}

function createGitDirectory() {
  fs.mkdirSync(path.join(process.cwd(), ".git"), { recursive: true });
  fs.mkdirSync(path.join(process.cwd(), ".git", "objects"), { recursive: true });
  fs.mkdirSync(path.join(process.cwd(), ".git", "refs"), { recursive: true });

  fs.writeFileSync(path.join(process.cwd(), ".git", "HEAD"), "ref: refs/heads/main\n");
  console.log("Initialized git directory");
}


function handelCatFileCommand() {
  const flag = process.argv[3];
  const commitSHA = process.argv[4];

  const command = new CatFileCOmmand(flag, commitSHA);

  gitClient.run(command);
}

function handelHashObjectCommand() {
  let flag = process.argv[3];
  let filePath = process.argv[4];

  if (!filePath) {
    filePath = flag;
    flag = null;
  }


  const command = new HashObjectCOmmand(flag, filePath);

  gitClient.run(command);
}
