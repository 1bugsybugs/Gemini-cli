const { execSync } = require("child_process");

module.exports = {
  name: "git_push_changes",

  run(packet) {
    try {
      const status = execSync("git status -sb", {
        encoding: "utf8"
      }).trim();

      return {
        status: "ready",
        skill: "git_push_changes",
        message: "Git push prepared. Approval required.",
        branch: status
      };
    } catch (err) {
      return {
        status: "error",
        message: err.message
      };
    }
  }
};
