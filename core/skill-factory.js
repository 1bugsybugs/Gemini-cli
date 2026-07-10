const fs = require("fs");
const path = require("path");

const suggestionsPath = path.join(
  __dirname,
  "../memory/skill-suggestions.json"
);

const blueprintsPath = path.join(
  __dirname,
  "../memory/skill-blueprints.json"
);

function load(file) {
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function save(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function generateBlueprints() {
  const suggestions = load(suggestionsPath);
  const blueprints = load(blueprintsPath);

  const created = [];

  for (const item of suggestions) {
    const exists = blueprints.find(
      b => b.name === item.skill
    );

    if (!exists) {
      const cleanName = item.skill.replaceAll("_", " ");

const blueprint = {
  name: item.skill,
  description: `Ability to handle requests related to ${cleanName}`,
  triggers: [
    cleanName,
    (item.request || item.reason || "").toLowerCase(),
    ...cleanName.split(" ")
  ],
  executor: "needs_executor",
  risk: "medium",
  requiresApproval: true,
  status: "suggested",
  source: "skill-factory",
  createdAt: new Date().toISOString()
};

      blueprints.push(blueprint);
      created.push(blueprint);
    }
  }

    if (created.length > 0) {
    save(blueprintsPath, blueprints);
  }

  return created;
}

module.exports = {
  generateBlueprints
};
