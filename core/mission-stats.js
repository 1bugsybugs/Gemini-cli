const fs = require("fs");
const path = require("path");

const MEMORY_FILE = path.join(
  process.cwd(),
  "memory",
  "mission-history.json"
);

function getStats() {
  if (!fs.existsSync(MEMORY_FILE)) {
    return { total: 0 };
  }

  const history = JSON.parse(
    fs.readFileSync(MEMORY_FILE, "utf8")
  );

  return {
    total: history.length
  };
}

module.exports = { getStats };
