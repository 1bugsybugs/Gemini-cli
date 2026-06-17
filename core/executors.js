function executeTask(task) {

  switch (task.task) {

    case "Create project structure":
      console.log("Creating project structure...");
      break;

    case "Build user interface":
      console.log("Building UI...");
      break;

    case "Generate files or code":
      console.log("Generating files...");
      break;

    case "Audit output for problems":
      console.log("Running audit...");
      break;

    case "Save mission notes":
      console.log("Writing mission memory...");
      break;

    case "Sync changes to GitHub":
      console.log("Preparing GitHub sync...");
      break;

    default:
      console.log(`Working on: ${task.task}`);
  }

}

module.exports = { executeTask };
