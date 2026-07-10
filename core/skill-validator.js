const fs = require("fs");
const path = require("path");

const skillsPath = path.join(__dirname, "../skills");

function validateSkill(skillName) {
  const skillPath = path.join(skillsPath, skillName);
  const indexPath = path.join(skillPath, "index.js");

  const result = {
    skill: skillName,
    valid: true,
    checks: []
  };

  if (!fs.existsSync(skillPath)) {
    return {
      skill: skillName,
      valid: false,
      checks: ["Skill folder missing"]
    };
  }

  if (!fs.existsSync(indexPath)) {
    return {
      skill: skillName,
      valid: false,
      checks: ["index.js missing"]
    };
  }

  try {
    delete require.cache[require.resolve(indexPath)];

    const skill = require(indexPath);

    if (!skill.name) {
      result.valid = false;
      result.checks.push("Missing skill name");
    } else {
      result.checks.push("Name found");
    }

    if (typeof skill.run !== "function") {
      result.valid = false;
      result.checks.push("Missing run function");
    } else {
      result.checks.push("Run function found");
    }

  } catch (err) {
    result.valid = false;
    result.checks.push(`Load error: ${err.message}`);
  }

  return result;
}

module.exports = {
  validateSkill
};
