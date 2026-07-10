const fs = require("fs");
const path = require("path");

const approvalPath = path.join(
  __dirname,
  "../memory/approvals.json"
);

function loadApprovals() {
  if (!fs.existsSync(approvalPath)) {
    fs.writeFileSync(approvalPath, "[]");
  }

  return JSON.parse(
    fs.readFileSync(approvalPath, "utf8")
  );
}

function approveSkill(skillName) {
  const approvals = loadApprovals();

  const existing = approvals.find(
    a => a.skill === skillName
  );

  if (!existing) {
    approvals.push({
      skill: skillName,
      approved: true,
      approvedAt: new Date().toISOString()
    });
  }

  fs.writeFileSync(
    approvalPath,
    JSON.stringify(approvals, null, 2)
  );

  return true;
}

function isApproved(skillName) {
  const approvals = loadApprovals();

  return approvals.some(
    a => a.skill === skillName && a.approved
  );
}

module.exports = {
  approveSkill,
  isApproved
};
