const { routeRequest } = require("./core/skill-router");
const { logRun } = require("./core/run-logger");

const requestText = process.argv.slice(2).join(" ");

if (!requestText) {
  console.log("Usage:");
  console.log('  node rev9.js "build a calculator app"');
  console.log('  node rev9.js "push my changes to github"');
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
