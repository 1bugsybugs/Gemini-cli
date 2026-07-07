const fs = require("fs");
const path = require("path");

const skillsDir = path.join(__dirname, "skills");

// Load all skills dynamically
const priority = [
  "memorySkill.js",
  "search.js",
  "ai.js"
];

const skills = priority
  .filter(file => fs.existsSync(path.join(skillsDir, file)))
  .map(file => require(path.join(skillsDir, file)));

async function dispatch(packet) {
  console.log("DISPATCH INPUT:", packet);

  for (const skill of skills) {
    console.log("CHECKING SKILL:", skill.name || skill);

    if (typeof skill.match === "function" && skill.match(packet)) {
      console.log("MATCH FOUND:", skill.name || skill);

      return await skill.run(packet);
    }
  }

  return {
    status: "no_match",
    input: packet.input
  };
}

module.exports = dispatch;
