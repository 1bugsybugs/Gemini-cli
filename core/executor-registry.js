const fs = require("fs");
const path = require("path");

function getExecutorSkills() {
  const executorPath = path.join(__dirname, "skill-executor.js");

  const source = fs.readFileSync(executorPath, "utf8");

  const matches = [
    ...source.matchAll(/result\.chosen_skill === "([^"]+)"/g)
  ];

  return matches.map(match => match[1]);
}

module.exports = {
  getExecutorSkills
};
