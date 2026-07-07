const fs = require("fs");
const path = require("path");

const missionFile = path.join(
  __dirname,
  "..",
  "data",
  "mission.json"
);

function getMission() {
  if (!fs.existsSync(missionFile)) {
    return {
      current_goal: "No mission defined",
      completed: [],
      next: []
    };
  }

  return JSON.parse(
    fs.readFileSync(missionFile, "utf8")
  );
}

module.exports = {
  getMission
};
