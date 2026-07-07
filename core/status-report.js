const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const manifest = require("../skills/manifest.json");
const { getExecutorSkills } = require("./executor-registry");

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

function getSkillStatus() {
  const skills = manifest.skills;
  const executors = getExecutorSkills();

  const missingExecutors = skills
    .map(skill => skill.name)
    .filter(name => !executors.includes(name));

  return {
    total: skills.length,
    active: skills.filter(skill => skill.status === "active").length,
    planned: skills.filter(skill => skill.status === "planned").length,
    high_risk: skills.filter(skill => skill.risk === "high").length,
    connected_executors: executors.length,
    missing_executors: missingExecutors
  };
}

function buildStatusReport() {
  return {
    health: "operational",
    project: manifest.project,
    version: manifest.version,
    skills: getSkillStatus(),
    git: getGitStatus(),
    recent_runs: readRecentRuns(5)
  };
}

module.exports = {
  buildStatusReport
};
