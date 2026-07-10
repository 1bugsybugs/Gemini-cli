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

  const routed = routeRequest(input);

  console.log("Request:", routed.request);

  if (!routed.matched) {
    console.log("No skill matched.");
    console.log(routed.message);
    process.exit(0);
  }

  console.log("Chosen skill:", routed.chosen_skill);
  console.log("Risk:", routed.risk);

  if (dryRun) {
   console.log(`
   REV-9 DRY RUN
  ----------------
   Request:
   ${input}

   Chosen skill:
   ${routed.chosen_skill}

   Risk:
   ${routed.risk}

Approval required:
${routed.approval.approval_required ? "YES" : "NO"}

No changes were made.
`);

  process.exit(0);
}

const result = executeSkill(routed, input);

  console.log("\nRESULT");
  console.log("----------------");
  console.log(JSON.stringify(result, null, 2));
})();
