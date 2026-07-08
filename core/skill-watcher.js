const fs = require("fs");
const path = require("path");

const missingSkillsPath = path.join(
  __dirname,
  "../memory/missing-skills.json"
);

const suggestionsPath = path.join(
  __dirname,
  "../memory/skill-suggestions.json"
);

function loadJson(file, fallback = []) {
  if (!fs.existsSync(file)) return fallback;

  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function saveJson(file, data) {
  fs.writeFileSync(
    file,
    JSON.stringify(data, null, 2)
  );
}

function analyzeMissingSkills() {
  const missing = loadJson(missingSkillsPath);

  if (missing.length === 0) {
    return {
      status: "ok",
      message: "No missing skills detected."
    };
  }

  const suggestions = loadJson(suggestionsPath);

  const existing = new Set(
    suggestions.map(s => s.skill)
  );

  const newSuggestions = [];

  for (const item of missing) {
    const skill = item.suggestedSkill;

    if (!existing.has(skill)) {
      newSuggestions.push({
        skill,
        reason: `Requested but no matching skill exists: ${item.request}`,
        priority: "medium",
        createdAt: new Date().toISOString()
      });
    }
  }

  if (newSuggestions.length > 0) {
    saveJson(
      suggestionsPath,
      [...suggestions, ...newSuggestions]
    );
  }

  return {
    status: "ok",
    suggestionsCreated: newSuggestions.length,
    suggestions: newSuggestions
  };
}

module.exports = {
  analyzeMissingSkills
};
