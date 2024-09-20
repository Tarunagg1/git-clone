const fs = require("fs");
const path = require("path");
const { CatFileCOmmand, HashObjectCOmmand, LSTreeCommand, WriteTreeCommand } = require('./git/commands');
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
  case "ls-tree":
    handelLsTreeCommand();
    break
  case "write-tree":
    handelWriteTreeCommand();
    break
  // case "commit":
  //   handelCommitCommand();
  //   break
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


function handelLsTreeCommand() {
  let flag = process.argv[3];
  let sha = process.argv[4];


  if (!sha && flag === '--name-only') return;

  if (!sha) {
    sha = flag;
    flag = null;
  }

  const command = new LSTreeCommand(flag, sha);

  gitClient.run(command);
}



function handelWriteTreeCommand() {
  let flag = process.argv[3];

  const command = new WriteTreeCommand(flag);

  gitClient.run(command);
}
