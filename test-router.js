const { routeRequest } = require("./core/skill-router");

const requestText = process.argv.slice(2).join(" ");

if (!requestText) {
  console.log("Usage:");
  console.log('  node test-router.js "summarize my project notes"');
  console.log('  node test-router.js "push my changes to github"');
  process.exit(1);
}

const result = routeRequest(requestText);

console.log("\nRev-9 Router Test");
console.log("-----------------");
console.log(`Request: ${result.request}`);

if (!result.matched) {
  console.log("Matched: no");
  console.log(`Message: ${result.message}`);
  process.exit(0);
}

console.log("Matched: yes");
console.log(`Chosen skill: ${result.chosen_skill}`);
console.log(`Description: ${result.description}`);
console.log(`Risk: ${result.risk}`);
console.log(`Allowed now: ${result.approval.allowed}`);
console.log(`Approval required: ${result.approval.approval_required}`);
console.log(`Reason: ${result.approval.reason}`);

if (result.approval.approval_required) {
  console.log("\nStatus: WAITING FOR BUGSY APPROVAL");
} else {
  console.log("\nStatus: SAFE TO RUN");
}
