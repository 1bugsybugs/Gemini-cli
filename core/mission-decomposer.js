function decomposeMission(mission) {
  const lower = mission.toLowerCase();

  const tasks = [
    "Understand the mission goal",
    "Search memory for similar past missions",
    "Create project plan",
    "Generate files or code",
    "Audit output for problems",
    "Save mission notes",
    "Sync changes to GitHub"
  ];

  if (lower.includes("app") || lower.includes("website")) {
    tasks.splice(3, 0, "Create project structure");
    tasks.splice(4, 0, "Build user interface");
  }

  if (lower.includes("api")) {
    tasks.splice(4, 0, "Build API connection");
  }

  if (lower.includes("test")) {
    tasks.splice(5, 0, "Write tests");
  }

  return tasks.map((task, index) => ({
    id: index + 1,
    task,
    status: "pending"
  }));
}

module.exports = { decomposeMission };
