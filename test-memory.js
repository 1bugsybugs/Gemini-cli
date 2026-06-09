const memory = require("./core/memory-engine");

memory.remember(
  "goals",
  "Build Jarvis into a trusted AI operating system",
  ["jarvis"]
);

memory.remember(
  "lessons",
  "PAT tokens do not display while typing in Termux",
  ["git", "github"]
);

memory.remember(
  "decisions",
  "Use GitHub as primary cloud backup",
  ["architecture"]
);

console.log("Goals:");
console.log(memory.recall("goals"));

console.log("Lessons:");
console.log(memory.recall("lessons"));

console.log("Decisions:");
console.log(memory.recall("decisions"));
