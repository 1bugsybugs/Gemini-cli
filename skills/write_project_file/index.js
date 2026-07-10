const fs = require("fs");
const path = require("path");

module.exports = {
  name: "write_project_file",

  run(packet) {
    const filePath = packet.file;
    const content = packet.content;

    if (!filePath || !content) {
      return {
        status: "error",
        message: "File path and content required."
      };
    }

    const projectRoot = path.resolve(__dirname, "../../");

    const target = path.resolve(projectRoot, filePath);

    if (!target.startsWith(projectRoot)) {
      return {
        status: "blocked",
        message: "Cannot write outside Rev-9 directory."
      };
    }

    fs.writeFileSync(target, content);

    return {
      status: "ok",
      message: `File written: ${filePath}`
    };
  }
};
