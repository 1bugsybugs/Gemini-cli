const { execSync } = require("child_process");

const task = process.argv.slice(2).join(" ");

if (!task) {
  console.log('Usage: node run.js "task"');
  process.exit(1);
}

execSync(`node jarvis.js "${task}"`, {
  stdio: "inherit"
});

execSync("node dispatch.js", {
  stdio: "inherit"
});
