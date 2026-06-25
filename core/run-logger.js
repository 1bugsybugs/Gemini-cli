const fs = require("fs");
const path = require("path");

const logDir = path.join(__dirname, "..", "logs");
const logFile = path.join(logDir, "runs.jsonl");

function logRun(result) {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  const entry = {
    timestamp: new Date().toISOString(),
    request: result.request || null,
    matched: result.matched,
    chosen_skill: result.chosen_skill || null,
    risk: result.risk || null,
    allowed: result.approval ? result.approval.allowed : null,
    approval_required: result.approval
      ? result.approval.approval_required
      : null,
    reason: result.approval ? result.approval.reason : result.message || null
  };

  fs.appendFileSync(logFile, JSON.stringify(entry) + "\n");
}

module.exports = {
  logRun
};
