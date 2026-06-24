const manifest = require("../skills/manifest.json");

function findSkill(skillName) {
  return manifest.skills.find((skill) => skill.name === skillName);
}

function requiresApproval(skillName) {
  const skill = findSkill(skillName);

  if (!skill) {
    return {
      allowed: false,
      reason: `Unknown skill: ${skillName}`,
      approval_required: true,
      risk: "unknown"
    };
  }

  return {
    allowed: !skill.approval_required,
    reason: skill.approval_required
      ? `${skill.name} is marked ${skill.risk} risk and needs approval.`
      : `${skill.name} is allowed without approval.`,
    approval_required: skill.approval_required,
    risk: skill.risk
  };
}

module.exports = {
  findSkill,
  requiresApproval
};
