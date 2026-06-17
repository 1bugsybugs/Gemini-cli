const skills = [
  {
    name: "memory-search",
    description: "Search past memories before starting a mission"
  },
  {
    name: "mission-decomposer",
    description: "Break a mission into smaller tasks"
  },
  {
    name: "project-generator",
    description: "Create files and folders for a project"
  },
  {
    name: "auditor",
    description: "Review output for mistakes or missing pieces"
  },
  {
    name: "github-sync",
    description: "Commit and push changes to GitHub"
  }
];

function listSkills() {
  return skills;
}

function chooseSkills(mission) {
  const selected = ["memory-search", "mission-decomposer"];

  const lower = mission.toLowerCase();

  if (lower.includes("app") || lower.includes("website") || lower.includes("project")) {
    selected.push("project-generator");
  }

  selected.push("auditor", "github-sync");

  return skills.filter(skill => selected.includes(skill.name));
}

module.exports = { listSkills, chooseSkills };
