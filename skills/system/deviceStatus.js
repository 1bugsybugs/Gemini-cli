const { execSync } = require("child_process");

module.exports = function deviceStatus(packet) {
  try {
    const battery = JSON.parse(
      execSync("termux-battery-status").toString()
    );

    return {
      status: "ok",
      skill: "device-status",
      battery: battery.percentage,
      charging: battery.plugged,
      health: battery.health,
      temperature: battery.temperature
    };
  } catch (err) {
    return {
      status: "error",
      skill: "device-status",
      message: err.message
    };
  }
};
