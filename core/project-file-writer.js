const fs = require("fs");
const path = require("path");

function createProjectFile(request) {
  const parts = request.trim().split(" ");
  const requestedPath = parts[parts.length - 1];

  const filePath = path.join(
    "projects",
    "test-project",
    requestedPath
  );

  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  fs.writeFileSync(filePath, "Hello from Rev-9");

  return {
    executed: true,
    message: `Created ${filePath}`
  };
}

module.exports = { createProjectFile };
