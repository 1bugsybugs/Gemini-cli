const fs = require("fs");
const path = require("path");

const missingSkillsPath = path.join(
  __dirname,
  "../memory/missing-skills.json"
);

function getMissingSkillReport() {
  if (!fs.existsSync(missingSkillsPath)) {
    return {
      total: 0,
      skills: []
    };
  }

  const skills = JSON.parse(
    fs.readFileSync(missingSkillsPath, "utf8")
  );

  return {
    total: skills.length,
    skills
  };
}

module.exports = {
  getMissingSkillReport
};
