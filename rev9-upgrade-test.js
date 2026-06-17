const { saveMission } = require("./core/mission-memory");
const { searchMemory } = require("./core/memory-search");
const { decomposeMission } = require("./core/mission-decomposer");
const { chooseSkills } = require("./core/skill-registry");
const { getStats } =
  require("./core/mission-stats");
const { executeTask } =
  require("./core/executors");
const { saveMissionReport } = require("./core/mission-report");

const mission = process.argv.slice(2).join(" ") || "Build a weather app";
const stats = getStats();

console.log(`
[REV-9 ONLINE]

Total Missions: ${stats.total}
`);

console.log("Mission:");
console.log(mission);

console.log("\nSearching memory...");
const memories = searchMemory(mission);

if (memories.length === 0) {
  console.log("No related memories found.");
} else {
  console.log(`Found ${memories.length} related memories:`);

  memories.forEach(mem => {
    console.log(
      `- ${mem.mission} (${mem.status})`
    );
  });
}

console.log("\nDecomposing mission...");
const tasks = decomposeMission(mission);
tasks.forEach(task => {

  console.log(`\nExecuting: ${task.task}`);

  executeTask(task, mission);

  console.log("[✓] Complete");

});

console.log("\nChoosing skills...");
const skills = chooseSkills(mission);
skills.forEach(skill => {
  console.log(`- ${skill.name}: ${skill.description}`);
});

saveMission(mission);

console.log("\nMission saved to memory.");
console.log("\n[EXECUTION PHASE]\n");

tasks.forEach(task => {
  console.log(`[✓] ${task.task}`);
});

console.log("\nMission Execution Complete");

saveMissionReport(mission, tasks, skills);

console.log(`
====================================
             REV-9
====================================

Mission Plan Generated
Agents Standing By

Ready For Execution
`);

