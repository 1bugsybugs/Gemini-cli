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

function addTask(title, steps = []) {
  const tasks = loadTasks();

  const task = {
    id: `task_${Date.now()}`,
    title,
    status: "pending",
    createdAt: new Date().toISOString(),
    steps
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

module.exports = {
  addTask,
  getTasks,
  getNextTask,
  completeTask
};
