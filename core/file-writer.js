const fs = require("fs");
const path = require("path");

function writeProjectFile(filePath, content) {
  const fullPath = path.resolve(filePath);

  const dir = path.dirname(fullPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(fullPath, content, "utf8");

  return {
    created: true,
    file: fullPath
  };
}

module.exports = {
  writeProjectFile
};
