const fs = require("fs");
const path = require("path");

function getExecutorSkills() {
  const executorPath = path.join(__dirname, "skill-executor.js");

  const source = fs.readFileSync(executorPath, "utf8");

  const hardcoded = [
    ...source.matchAll(/result\.chosen_skill === "([^"]+)"/g)
  ].map(match => match[1]);

  const skillsPath = path.join(__dirname, "../skills");

  let dynamic = [];

  if (fs.existsSync(skillsPath)) {
    dynamic = fs.readdirSync(skillsPath)
      .filter(name => {
        const skillFile = path.join(
          skillsPath,
          name,
          "index.js"
        );

        if (!fs.existsSync(skillFile)) {
          return false;
        }

        try {
          const skill = require(skillFile);
          return typeof skill.run === "function";
        } catch {
          return false;
        }
      });
  }

  return [
    ...new Set([
      ...hardcoded,
      ...dynamic
    ])
  ];
}

module.exports = {
  getExecutorSkills
};
