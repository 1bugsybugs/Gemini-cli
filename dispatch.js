const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const MC_PATH = path.join(process.env.HOME, "jarvis", "mission_control.json");

const data = JSON.parse(fs.readFileSync(MC_PATH, "utf8"));

if (!data.active_sprint) {
  console.log("No active mission to dispatch.");
  process.exit(0);
}

const task = data.active_sprint.current_task;
const worker = task.assigned_agent.toLowerCase();
const workerPath = path.join("workers", `${worker}.js`);

if (!fs.existsSync(workerPath)) {
  console.log(`No worker found for agent: ${task.assigned_agent}`);
  console.log(`Expected file: ${workerPath}`);
  process.exit(1);
}

console.log(`Dispatching mission to ${task.assigned_agent} worker...`);

execSync(`node ${workerPath}`, {
  stdio: "inherit"
});
