const memory = require("./memory-engine");

function searchMemory(query = "") {
  return {
    goals: memory.recall("goals", query),
    decisions: memory.recall("decisions", query),
    lessons: memory.recall("lessons", query),
    projects: memory.recall("projects", query)
  };
}

module.exports = {
  searchMemory
};
