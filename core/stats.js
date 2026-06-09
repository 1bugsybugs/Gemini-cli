const fs = require("fs");

const PATH = "./stats/agents.json";

function load() {
  return JSON.parse(fs.readFileSync(PATH, "utf8"));
}

function save(data) {
  fs.writeFileSync(PATH, JSON.stringify(data, null, 2));
}

function recordSuccess(agent) {
  const data = load();

  if (!data[agent]) {
    data[agent] = {
      completed: 0
    };
  }

  data[agent].completed++;

  save(data);
}

module.exports = {
  recordSuccess
};
