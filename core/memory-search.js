const fs = require("fs");
const path = require("path");

const MEMORY_FILE = path.join(
  process.cwd(),
  "memory",
  "mission-history.json"
);

function searchMemory(query) {
  if (!fs.existsSync(MEMORY_FILE)) {
    return [];
  }

  const history = JSON.parse(
    fs.readFileSync(MEMORY_FILE, "utf8")
  );

  return history.filter(item =>
    item.mission
      .toLowerCase()
      .includes(query.toLowerCase())
  );
}

module.exports = { searchMemory };
