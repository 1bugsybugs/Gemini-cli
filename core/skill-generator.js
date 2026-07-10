const fs = require("fs");
const path = require("path");

const { validateSkill } = require("./skill-validator");
const skillsPath = path.join(__dirname, "../skills");
const manifestPath = path.join(__dirname, "../skills/manifest.json");

function createSkill(skillName, description, triggers = []) {
  const folderName = skillName.replace(/\s+/g, "_");
  const skillFolder = path.join(skillsPath, folderName);

  if (fs.existsSync(skillFolder)) {
    return {
      created: false,
      message: `Skill ${folderName} already exists.`
    };
  }

  fs.mkdirSync(skillFolder);

  const skillFile = path.join(skillFolder, "index.js");

  fs.writeFileSync(
    skillFile,
    `module.exports = {
  name: "${folderName}",

  run(packet) {
    return {
      status: "ok",
      skill: "${folderName}",
      message: "Generated skill is ready for development.",
      input: packet.input
    };
  }
};
`
  );
const validation = validateSkill(folderName);

if (!validation.valid) {
  return {
    created: false,
    message: "Skill failed validation.",
    validation
  };
}
 
 const manifest = JSON.parse(
    fs.readFileSync(manifestPath, "utf8")
  );

  manifest.skills.push({
    name: folderName,
    description:
      description || `Generated skill: ${folderName}`,
    triggers:
      triggers.length ? triggers : [folderName],
    inputs: ["query"],
    outputs: ["response"],
    risk: "medium",
    approval_required: true,
    provider_or_mcp: "local",
    status: "active"
  });

  fs.writeFileSync(
    manifestPath,
    JSON.stringify(manifest, null, 2)
  );

  return {
    created: true,
    skill: folderName,
    path: skillFolder
  };
}

module.exports = {
  createSkill
};
