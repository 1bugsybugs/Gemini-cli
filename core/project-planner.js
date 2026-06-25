function cleanProjectName(requestText) {
  return requestText
    .toLowerCase()
    .replace("build", "")
    .replace("make", "")
    .replace("create", "")
    .replace("an", "")
    .replace("a", "")
    .trim()
    .replace(/\s+/g, "-");
}

function planProject(requestText) {
  const projectName = cleanProjectName(requestText) || "new-project";

  const isCalculator = requestText.toLowerCase().includes("calculator");
  const isWebsite =
    requestText.toLowerCase().includes("website") ||
    requestText.toLowerCase().includes("landing page");

  let files = [
    "README.md",
    "notes.md"
  ];

  let steps = [
    "Clarify the project goal.",
    "Create the project folder.",
    "Create starter files.",
    "Test the project locally.",
    "Review changes before pushing to GitHub."
  ];

  if (isCalculator) {
    files = [
      "index.html",
      "style.css",
      "script.js",
      "README.md",
      "notes.md"
    ];

    steps = [
      "Create a simple calculator UI.",
      "Add buttons for numbers and math operators.",
      "Wire button clicks in JavaScript.",
      "Add basic styling.",
      "Test addition, subtraction, multiplication, and division.",
      "Review files before allowing Rev-9 to write anything."
    ];
  }

  if (isWebsite) {
    files = [
      "index.html",
      "style.css",
      "README.md",
      "notes.md"
    ];

    steps = [
      "Define the website purpose.",
      "Create the page structure.",
      "Add starter styling.",
      "Review layout in the browser.",
      "Review files before allowing Rev-9 to write anything."
    ];
  }

  return {
    project_name: projectName,
    goal: requestText,
    recommended_skill_chain: [
      "plan_project",
      "write_project_file",
      "git_status_check",
      "git_push_changes"
    ],
    suggested_files: files,
    build_steps: steps,
    safety_note:
      "This is planning only. Rev-9 should not write files until Bugsy approves the plan."
  };
}

module.exports = {
  planProject
};
