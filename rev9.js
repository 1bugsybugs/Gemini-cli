const { routeRequest } = require("./core/skill-router");
const { logRun } = require("./core/run-logger");
const { executeSkill } = require("./core/skill-executor");

const requestText = process.argv.slice(2).join(" ");

if (!requestText) {
  console.log("Usage:");
  console.log('  node rev9.js "build a calculator app"');
  console.log('  node rev9.js "push my changes to github"');
  console.log('  node rev9.js "check git status"');
  process.exit(1);
}

const result = routeRequest(requestText);
logRun(result);

console.log("\nREV-9");
console.log("-----");
console.log(`Request: ${result.request}`);

if (!result.matched) {
  console.log("Matched: no");
  console.log(`Message: ${result.message}`);
  process.exit(0);
}

console.log("Matched: yes");
console.log(`Chosen skill: ${result.chosen_skill}`);
console.log(`Risk: ${result.risk}`);
console.log(`Allowed now: ${result.approval.allowed}`);
console.log(`Approval required: ${result.approval.approval_required}`);
console.log(`Reason: ${result.approval.reason}`);

if (result.approval.approval_required) {
  console.log("\nDecision: WAITING FOR BUGSY APPROVAL");
} else {
  console.log("\nDecision: SAFE TO RUN");
}

const execution = executeSkill(result, requestText);

if (execution) {
  console.log("\nExecution");
  console.log("---------");

  if (!execution.executed) {
    console.log(execution.message);
  }

  if (execution.executed && execution.type === "project_plan") {

    console.log("Project Plan");
    console.log("------------");
    console.log(`Project name: ${plan.project_name}`);
    console.log(`Goal: ${plan.goal}`);

    console.log("\nSuggested files:");
    for (const file of plan.suggested_files) {
      console.log(`- ${file}`);
    }

    console.log("\nBuild steps:");
    plan.build_steps.forEach((step, index) => {
      console.log(`${index + 1}. ${step}`);
    });

    console.log("\nRecommended skill chain:");
    for (const skill of plan.recommended_skill_chain) {
      console.log(`- ${skill}`);
    }

    console.log(`\nSafety note: ${plan.safety_note}`);
  }

      if (execution.executed && execution.type === "git_status") {
    console.log("Git Status");
    console.log("----------");
    console.log(execution.data.branch_status);
    console.log(execution.data.short_status);
  }

  if (execution.executed && execution.type === "status_report") {
    console.log("Rev-9 Status Report");
    console.log("-------------------");

    console.log("\nGit:");
    console.log(execution.data.git.branch_status);
    console.log(execution.data.git.short_status);

    console.log("\nRecent runs:");
    if (execution.data.recent_runs.length === 0) {
      console.log("No runs logged yet.");
    } else {
      for (const run of execution.data.recent_runs) {
        console.log(
          `- ${run.timestamp} | ${run.chosen_skill} | risk=${run.risk} | allowed=${run.allowed} | ${run.request}`
        );
      }
    }
  }
}

