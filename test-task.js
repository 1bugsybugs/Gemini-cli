const taskManager = require("./core/task-manager");

const task = taskManager.addTask(
  "Build calculator app",
  ["plan", "code", "test", "document"]
);

console.log(task);

console.log("NEXT TASK:");
console.log(taskManager.getNextTask());
