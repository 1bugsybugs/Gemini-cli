const fs = require("fs");
const path = require("path");

const TASK_FILE = path.join(__dirname, "..", "memory", "tasks.json");

function loadTasks() {
  try {
    return JSON.parse(fs.readFileSync(TASK_FILE, "utf8"));
  } catch {
    return [];
  }
}

function saveTasks(tasks) {
  fs.writeFileSync(TASK_FILE, JSON.stringify(tasks, null, 2));
}

function getTasks() {
  const lower = title.toLowerCase();

  let steps;

  if (lower.includes("discord bot")) {
    steps = [
      "research Discord API requirements",
      "create project structure",
      "write bot code",
      "test bot functionality",
      "document project"
    ];
  } else if (lower.includes("app") || lower.includes("website")) {
    steps = [
      "plan features",
      "create project structure",
      "write code",
      "test application",
      "review changes"
    ];
  } else {
    steps = [
      "understand requirements",
      "create plan",
      "complete work",
      "test result",
      "review"
    ];
  }

  return steps.map(step => ({
    name: step,
    status: "pending"
  }));
}
function generateSteps(title) {
  const lower = title.toLowerCase();

  let steps;

  if (lower.includes("discord bot")) {
    steps = [
      "research Discord API requirements",
      "create project structure",
      "write bot code",
      "test bot functionality",
      "document project"
    ];
  } else if (lower.includes("app") || lower.includes("website")) {
    steps = [
      "plan features",
      "create project structure",
      "write code",
      "test application",
      "review changes"
    ];
  } else {
    steps = [
      "understand requirements",
      "create plan",
      "complete work",
      "test result",
      "review"
    ];
  }

  return steps.map(step => ({
    name: step,
    status: "pending"
  }));
}
function addTask(title, steps = null) {
  const tasks = loadTasks();
const existing = tasks.find(
  task =>
    task.title.toLowerCase() === title.toLowerCase() &&
    task.status === "pending"
);

if (existing) {
  return existing;
}
  const task = {
    id: `task_${Date.now()}`,
    title,
    status: "pending",
    createdAt: new Date().toISOString(),
    steps: steps || generateSteps(title)
  };

  tasks.push(task);
  saveTasks(tasks);

  return task;
}
function getTasks() {
  return loadTasks();
}

function getNextTask() {
  return loadTasks().find(task => task.status === "pending");
}

function completeTask(id) {
  const tasks = loadTasks();

  const task = tasks.find(t => t.id === id);

  if (!task) {
    return null;
  }

  task.status = "completed";
  task.completedAt = new Date().toISOString();

  saveTasks(tasks);

  return task;
}
function completeStep(taskId, stepName) {
  const tasks = loadTasks();

  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return null;
  }

  task.steps = normalizeSteps(task.steps);

  const step = task.steps.find(
    s => s.name.toLowerCase() === stepName.toLowerCase()
  );

  if (!step) {
    return null;
  }

  step.status = "completed";

  const completed = task.steps.filter(
    s => s.status === "completed"
  ).length;

  task.progress = Math.round(
    (completed / task.steps.length) * 100
  );

  saveTasks(tasks);

  return task;
}
function normalizeSteps(steps) {
  if (!Array.isArray(steps)) {
    return [];
  }

  return steps.map(step => {
    if (typeof step === "string") {
      return {
        name: step,
        status: "pending"
      };
    }

    return step;
  });
}
function getTaskProgress() {
  const tasks = loadTasks();

  return tasks.map(task => {
    if (!Array.isArray(task.steps) || task.steps.length === 0) {
      return {
        title: task.title,
        status: task.status,
        progress: 0,
        steps: task.steps
      };
    }

    const stepObjects = normalizeSteps(task.steps);

    if (stepObjects.length === 0) {
      return {
        title: task.title,
        status: task.status,
        progress: 0,
        steps: task.steps
      };
    }

    const completed = stepObjects.filter(
      step => step.status === "completed"
    ).length;

    return {
      title: task.title,
      status: task.status,
      progress: Math.round(
        (completed / stepObjects.length) * 100
      ),
      steps: normalizeSteps(task.steps)
    };
  });
}
function taskQuality(task) {
  let score = 0;

  if (Array.isArray(task.steps)) {
    score += task.steps.length;
  }

  const text = JSON.stringify(task.steps).toLowerCase();

  if (text.includes("write")) score += 2;
  if (text.includes("code")) score += 2;
  if (text.includes("test")) score += 2;
  if (text.includes("document")) score += 1;
  if (text.includes("api")) score += 2;
  if (text.includes("project structure")) score += 1;
  if (text.includes("review")) score += 1;

  return score;
}

function cleanupDuplicateTasks() {
  const tasks = loadTasks();
  const groups = {};

  for (const task of tasks) {
    const key = task.title.toLowerCase();

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(task);
  }

  const cleaned = [];

  for (const key in groups) {
    const group = groups[key];

    if (group.length === 1) {
      cleaned.push(group[0]);
      continue;
    }

    let best = group[0];

for (const task of group) {
  if (taskQuality(task) > taskQuality(best)) {
    best = task;
  }
}

best.status = "pending";

    for (const task of group) {
      if (task.id !== best.id) {
        task.status = "archived";
      }
    }

    cleaned.push(...group);
  }

  saveTasks(cleaned);

  return cleaned;
}
module.exports = {
  addTask,
  getTasks,
  getNextTask,
  completeTask,
  completeStep,
  getTaskProgress,
  cleanupDuplicateTasks
};
