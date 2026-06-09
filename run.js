const { execSync } = require("child_process");

const task = process.argv.slice(2).join(" ");

if (!task) {
  console.log('Usage: node run.js "task description"');
  process.exit(1);
}

console.log("🚀 Starting mission...");
execSync(`node jarvis.js "${task}"`, {
  stdio: "inherit"
});

execSync("node dispatch.js", {
  stdio: "inherit"
});

console.log("✅ Mission complete.");
