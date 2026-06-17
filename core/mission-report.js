const fs = require("fs");
const path = require("path");

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function saveMissionReport(mission, tasks, skills) {
  const reportsDir = path.join(process.cwd(), "memory", "reports");
  fs.mkdirSync(reportsDir, { recursive: true });

  const fileName = `${Date.now()}-${slugify(mission)}.md`;
  const filePath = path.join(reportsDir, fileName);

  const report = `# Rev-9 Mission Report

Mission:
${mission}

Status:
Completed

Tasks Completed:
${tasks.map(task => `- ${task.task}`).join("\n")}

Skills Used:
${skills.map(skill => `- ${skill.name}`).join("\n")}
`;

  fs.writeFileSync(filePath, report);
  console.log(`Mission report saved: ${filePath}`);
}

module.exports = { saveMissionReport };
