const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const logFile = path.join(__dirname, "..", "logs", "runs.jsonl");

function readRecentRuns(limit = 5) {
  if (!fs.existsSync(logFile)) {
    return [];
  }

  const lines = fs
    .readFileSync(logFile, "utf8")
    .split("\n")
    .filter(Boolean);

  return lines
    .slice(-limit)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function getGitStatus() {
  const branchStatus = execSync("git status -sb", {
    encoding: "utf8"
  }).trim();

  const shortStatus = execSync("git status --short", {
    encoding: "utf8"
  }).trim();

  return {
    branch_status: branchStatus,
    short_status: shortStatus || "Working tree clean."
  };
}

function buildStatusReport() {
  return {
    git: getGitStatus(),
    recent_runs: readRecentRuns(5)
  };
}

module.exports = {
  buildStatusReport
};
