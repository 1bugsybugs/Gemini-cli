const fs = require("fs");
const path = require("path");

const missingSkillsPath = path.join(
  __dirname,
  "../memory/missing-skills.json"
);

function ensureFile() {
  if (!fs.existsSync(missingSkillsPath)) {
    fs.writeFileSync(
      missingSkillsPath,
      "[]",
      "utf8"
    );
  }
}

function recordMissingSkill(requestText) {
  ensureFile();

  const data = JSON.parse(
    fs.readFileSync(missingSkillsPath, "utf8")
  );

const existing = data.find(
  item => item.request.toLowerCase() === requestText.toLowerCase()
);

if (existing) {
  return {
    ...existing,
    alreadyExists: true
  };
}
  const entry = {
    id: Date.now().toString(),
    request: requestText,
    suggestedSkill: requestText
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, ""),
    reason: "no matching skill",
    createdAt: new Date().toISOString()
  };

  data.push(entry);

  fs.writeFileSync(
    missingSkillsPath,
    JSON.stringify(data, null, 2),
    "utf8"
  );

  return entry;
}

module.exports = {
  recordMissingSkill
};
