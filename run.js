const { routeRequest } = require("./core/skill-router");
const { executeSkill } = require("./core/skill-executor");

(async () => {
  const args = process.argv.slice(2);

const dryRun = args.includes("--dry-run");

const input = args
  .filter(arg => arg !== "--dry-run")
  .join(" ");

  if (!input) {
    console.log("Usage: node run.js \"your request\"");
    process.exit(1);
  }

  console.log("\nREV-9 ONLINE");
  console.log("----------------");

  const routed = routeRequest(input);

  console.log("Request:", routed.request);

  if (!routed.matched) {
    console.log("No skill matched.");
    console.log(routed.message);
    process.exit(0);
  }

  console.log("Chosen skill:", routed.chosen_skill);
  console.log("Risk:", routed.risk);

  const result = executeSkill(routed, input);

  if (dryRun) {
    console.log(`
    REV-9 DRY RUN
   ----------------
    Request:
    ${input}

    Chosen skill:
    ${result.skill || result.chosen_skill}

    Risk:
    ${result.risk || "unknown"}

Approval required:
${result.requiresApproval ? "YES" : "NO"}

No changes were made.
`);
  process.exit(0);
}

  console.log("\nRESULT");
  console.log("----------------");
  console.log(JSON.stringify(result, null, 2));
})();
