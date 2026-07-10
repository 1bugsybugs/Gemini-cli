const { getMissingSkillReport } = require("../../core/missing-skill-report");

module.exports = {
  name: "missing_skill_report",

  run(packet) {
    return {
      status: "ok",
      skill: "missing_skill_report",
      data: getMissingSkillReport()
    };
  }
};
