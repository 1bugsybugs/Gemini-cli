module.exports = {
  search: require("./search"),
  memory: require("./memorySkill"),
  "system-info": require("./system/systemInfo"),
  "device-status": require("./system/deviceStatus"),
  ai: {
    default: (packet) => ({
      status: "ok",
      type: "ai",
      output: `AI fallback response for: ${packet.input}`
    })
  }
};
