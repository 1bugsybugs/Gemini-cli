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

const desc = task.description.toLowerCase();
const isLandingPage = desc.includes("landing page");
const isWebApp =
  desc.includes("app") ||
  desc.includes("website") ||
  desc.includes("calculator") ||
  desc.includes("landing page") ||
  desc.includes("web page") ||
  desc.includes("business site") ||
  desc.includes("portfolio");
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

if (isLandingPage) {
    files["index.html"] = `<!DOCTYPE html>
    <html>
    <head>
    <title>Lawn Care Services</title>
    <link rel="stylesheet" href="style.css">
    </head>
    <body>
    <header>
    <h1>Bugsy's Lawn Care</h1>
    <p>Professional Lawn Care & Landscaping</p>
    </header>

   <section>
   <h2>Our Services</h2>
   <ul>
   <li>Lawn Mowing</li>
   <li>Weed Control</li>
   <li>Mulching</li>
   <li>Seasonal Cleanup</li>
   </ul>
   </section>

  <section>
  <h2>Contact Us</h2>
  <p>Call today for a free estimate.</p>
  </section>
  </body>
  </html>`;
}
 files["style.css"] =
 "body {\n" +
 " font-family: Arial, sans-serif;\n" +
 " padding: 40px;\n" +
 "}\n";

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
