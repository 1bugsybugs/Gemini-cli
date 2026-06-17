const fs = require("fs");
const path = require("path");

const MEMORY_FILE = path.join(
  process.cwd(),
  "memory",
  "mission-history.json"
);

function saveMission(mission) {
  let history = [];

  if (fs.existsSync(MEMORY_FILE)) {
    try {
      history = JSON.parse(
        fs.readFileSync(MEMORY_FILE, "utf8")
      );
    } catch {
      history = [];
    }
  }

  history.push({
    mission,
    timestamp: new Date().toISOString(),
    status: "completed"
  });

  fs.writeFileSync(
    MEMORY_FILE,
    JSON.stringify(history, null, 2)
  );
}

module.exports = { saveMission };
