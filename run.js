const { routeRequest } = require("./core/skill-router");
const { executeSkill } = require("./core/skill-executor");

(async () => {
  const input = process.argv.slice(2).join(" ");

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

  console.log("\nRESULT");
  console.log("----------------");
  console.log(JSON.stringify(result, null, 2));
})();
