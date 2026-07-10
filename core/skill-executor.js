const { execSync } = require("child_process");
const { planProject } = require("./project-planner");
const { buildStatusReport } = require("./status-report");
const { summarizeNotes } = require("./note-summarizer");
const { searchMemory } = require("./memory-worker");
const { inspectRepo } = require("./repo-inspector");
const { getMissingSkillReport } = require("./missing-skill-report");
const { createSkill } = require("./skill-generator");
const { isApproved, approveSkill } = require("./approval-memory");

function executeSkill(result, requestText) {
  if (!result.matched) {
  return null;
} 

 if (requestText.startsWith("approve ")) {
  const skillName = requestText.replace("approve ", "").trim();

  approveSkill(skillName);

  return {
    executed: true,
    message: `Approval recorded for ${skillName}`
  };
}

if (
  result.risk === "high" &&
  !isApproved(result.chosen_skill)
) {
  return {
    executed: false,
    message: "Execution blocked. Bugsy approval is required first."
  };
}
  
   if (result.chosen_skill === "plan_project") {
    return {
      executed: true,
      type: "project_plan",
      data: planProject(requestText)
    };
  }

  if (result.chosen_skill === "git_status_check") {
    const shortStatus = execSync("git status --short", {
      encoding: "utf8"
    }).trim();

    const branchStatus = execSync("git status -sb", {
      encoding: "utf8"
    }).trim();

    return {
      executed: true,
      type: "git_status",
      data: {
        branch_status: branchStatus,
        short_status: shortStatus || "Working tree clean."
      }
    };
  }

  if (result.chosen_skill === "rev9_status_report") {
    return {
      executed: true,
      type: "status_report",
      data: buildStatusReport()
    };
  }

if (result.chosen_skill === "summarize_notes") {
  return {
    executed: true,
    type: "summary",
    data: summarizeNotes(requestText)
  };
} 
if (result.chosen_skill === "memory-search") {
  return {
    executed: true,
    type: "memory",
    data: searchMemory(requestText)
  };
}
  if (result.chosen_skill === "system-info") {
  const systemInfo = require("../skills/system/systemInfo");

  return systemInfo({
    input: requestText
  });
}

if (result.chosen_skill === "device-status") {
  const deviceStatus = require("../skills/system/deviceStatus");

  return deviceStatus({
    input: requestText
  });
}

if (result.chosen_skill === "inspect_repo") {
  return {
    executed: true,
    type: "repo_inspection",
    data: inspectRepo()
  };
}
if (result.chosen_skill === "skill_generator") {
  return {
    executed: true,
    type: "skill_generation",
    data: createSkill(
      requestText,
      `Generated skill for: ${requestText}`,
      [requestText]
    )
  };
}
return {
    executed: false,
    message: `No executor exists yet for ${result.chosen_skill}.`
  };
}

module.exports = {
  executeSkill
};
