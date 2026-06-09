const fs = require("fs");
const path = require("path");
const projectsDir = path.join(process.env.HOME, "jarvis", "projects");
const MC_PATH = path.join(process.env.HOME, "jarvis", "mission_control.json");

const data = JSON.parse(fs.readFileSync(MC_PATH, "utf8"));

if (!data.active_sprint) {
  console.log("No active mission.");
  process.exit(0);
}

const task = data.active_sprint.current_task;

if (task.assigned_agent !== "DEVELOPER") {
  console.log(`This mission is assigned to ${task.assigned_agent}, not DEVELOPER.`);
  process.exit(0);
}

const buildPlan = {
  task: task.description,
  created_at: new Date().toISOString(),
  steps: [
    "Analyze requirements",
    "Create project structure",
    "Create source files",
    "Implement features",
    "Run tests",
    "Prepare completion report"
  ]
};

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const projectName = slugify(task.description);
const projectPath = path.join(projectsDir, projectName);

if (!fs.existsSync(projectsDir)) {
  fs.mkdirSync(projectsDir);
}

if (!fs.existsSync(projectPath)) {
  fs.mkdirSync(projectPath);
}

const isWebApp =
  task.description.toLowerCase().includes("app") ||
  task.description.toLowerCase().includes("website") ||
  task.description.toLowerCase().includes("calculator");

let files = {
  "README.md": `# ${task.description}

Created by Jarvis Developer Worker.

## Task

${task.description}
`,
  "plan.md": `# Build Plan

1. Analyze requirements
2. Create project structure
3. Create source files
4. Implement features
5. Run tests
6. Prepare completion report
`,
  "notes.md": `# Notes

Project created at ${new Date().toISOString()}.
`
};

if (isWebApp) {
  files["index.html"] = `<!DOCTYPE html>
<html>
<head>
  <title>${task.description}</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main>
    <h1>${task.description}</h1>

    <input id="display" readonly>

    <div class="buttons">
      <button onclick="press('1')">1</button>
      <button onclick="press('2')">2</button>
      <button onclick="press('3')">3</button>
      <button onclick="press('+')">+</button>

      <button onclick="press('4')">4</button>
      <button onclick="press('5')">5</button>
      <button onclick="press('6')">6</button>
      <button onclick="press('-')">-</button>

      <button onclick="press('7')">7</button>
      <button onclick="press('8')">8</button>
      <button onclick="press('9')">9</button>
      <button onclick="press('*')">*</button>

      <button onclick="clearDisplay()">C</button>
      <button onclick="press('0')">0</button>
      <button onclick="calculate()">=</button>
      <button onclick="press('/')">/</button>
    </div>
  </main>

  <script src="script.js"></script>
</body>
</html>
`;

  files["style.css"] = `body {
  font-family: Arial, sans-serif;
  padding: 40px;
}

main {
  max-width: 300px;
  margin: auto;
}

input {
  width: 100%;
  font-size: 24px;
  margin-bottom: 10px;
  padding: 10px;
}

.buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

button {
  font-size: 20px;
  padding: 15px;
}
`;

  files["script.js"] = `function press(value) {
  document.getElementById("display").value += value;
}

function clearDisplay() {
  document.getElementById("display").value = "";
}

function calculate() {
  const display = document.getElementById("display");

  try {
    display.value = eval(display.value);
  } catch (error) {
    display.value = "Error";
  }
}
`;
}
for (const [filename, content] of Object.entries(files)) {
  const filePath = path.join(projectPath, filename);

  fs.writeFileSync(filePath, content);
}

console.log("DEVELOPER WORKER ONLINE");
console.log(`Task: ${task.description}`);
console.log(`Project created: ${projectPath}`);
console.log("Files created:");

for (const filename of Object.keys(files)) {
  console.log(`- ${filename}`);
}
