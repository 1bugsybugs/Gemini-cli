const fs = require("fs");
const path = require("path");

module.exports = function(packet) {
  const manifestPath = path.join(__dirname, "..", "manifest.json");

  const manifest = JSON.parse(
    fs.readFileSync(manifestPath, "utf8")
  );

  const skills = manifest.skills.map(skill => ({
    name: skill.name,
    status: skill.status,
    risk: skill.risk,
    triggers: skill.triggers
  }));

  const active = skills.filter(
    skill => skill.status === "active"
  );

  const planned = skills.filter(
    skill => skill.status === "planned"
  );

  const highRisk = skills.filter(
    skill => skill.risk === "high"
  );
  const implementedExecutors = [
    "plan_project",
    "git_status_check",
    "rev9_status_report",
    "summarize_notes",
    "memory-search",
    "system-info"
  ];

  const missingExecutors = skills
    .map(skill => skill.name)
    .filter(name => !implementedExecutors.includes(name));

  if (packet.input.includes("validate")) {
    return {
      status: "ok",
      type: "validation",
      data: {
        valid: true,
        skills_checked: skills.length,
        active_skills: active.length,
        planned_skills: planned.length,
        high_risk_skills: highRisk.length
      }
    };
  }

  return {
    status: "ok",
    type: "system",
    data: {
      project: manifest.project,
      version: manifest.version,
      health: "operational",
      skill_count: skills.length,
      active_skills: active.length,
      planned_skills: planned.length,
      high_risk_skills: highRisk.length,
      skills,
      missing_executors: missingExecutors,
    }
  };
};
