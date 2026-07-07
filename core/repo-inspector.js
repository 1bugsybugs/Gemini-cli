const fs = require("fs");
const path = require("path");

function inspectRepo() {
  const root = path.join(__dirname, "..");

  const entries = fs.readdirSync(root, {
    withFileTypes: true
  });

  const folders = entries
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);

  const files = entries
    .filter(entry => entry.isFile())
    .map(entry => entry.name);

  return {
    root: root,
    folders,
    files
  };
}

module.exports = {
  inspectRepo
};
