const manifest = require("../skills/manifest.json");
const { requiresApproval } = require("./approval-gate");
const { recordMissingSkill } = require("./skill-gap-detector");

function scoreSkill(requestText, skill) {
  const text = requestText.toLowerCase();
  let score = 0;

  for (const trigger of skill.triggers || []) {
    if (text.includes(trigger.toLowerCase())) {
      score += 2;
    }
  }

  if (text.includes(skill.name.toLowerCase())) {
    score += 3;
  }

  return score;
}

function routeRequest(requestText) {
    const text = requestText.toLowerCase();

  if (
    text.includes("push") ||
    text.includes("commit") ||
    text.includes("sync to github")
  ) {
    const chosenSkill = manifest.skills.find(
      (skill) => skill.name === "git_push_changes"
    );
    const approval = requiresApproval(chosenSkill.name);

    return {
      matched: true,
      request: requestText,
      chosen_skill: chosenSkill.name,
      description: chosenSkill.description,
      risk: chosenSkill.risk,
      approval
    };
  }
      const ranked = manifest.skills
    .map((skill) => ({
      skill,
      score: scoreSkill(requestText, skill)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  if (ranked.length === 0) {
    const missingSkill = recordMissingSkill(requestText);

    return {
      matched: false,
      message: "No matching skill found. Skill request saved.",
      request: requestText,
      missing_skill: missingSkill
    };
}

  const chosenSkill = ranked[0].skill;
  const approval = requiresApproval(chosenSkill.name);

  return {
    matched: true,
    request: requestText,
    chosen_skill: chosenSkill.name,
    description: chosenSkill.description,
    risk: chosenSkill.risk,
    approval
  };
}

module.exports = {
  routeRequest,
  scoreSkill
};
