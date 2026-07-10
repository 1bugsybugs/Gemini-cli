const fs = require("fs");
const path = require("path");

const missingPath = path.join(__dirname, "..", "memory", "missing-skills.json");
const ideasPath = path.join(__dirname, "..", "memory", "skill-ideas.json");

function ensureFile(file, fallback) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(fallback, null, 2));
  }
}

function recordSkillGap(request, suggestedSkill) {
  ensureFile(missingPath, []);
  ensureFile(ideasPath, []);

  const missing = JSON.parse(fs.readFileSync(missingPath, "utf8"));
  const ideas = JSON.parse(fs.readFileSync(ideasPath, "utf8"));

  const entry = {
    skill: suggestedSkill,
    request,
    detectedAt: new Date().toISOString(),
    status: "waiting"
  };

  missing.push(entry);

  const existing = ideas.find(i => i.skill === suggestedSkill);

  if (existing) {
    existing.requests++;
  } else {
    ideas.push({
      skill: suggestedSkill,
      requests: 1,
      priority: "medium",
      status: "waiting"
    });
  }

  fs.writeFileSync(missingPath, JSON.stringify(missing, null, 2));
  fs.writeFileSync(ideasPath, JSON.stringify(ideas, null, 2));

  return entry;
}

module.exports = {
  recordSkillGap
};
