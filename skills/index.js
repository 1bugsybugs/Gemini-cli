module.exports = {
  search: require("./search"),
  memory: require("./memorySkill"),
  ai: {
    default: (packet) => ({
      status: "ok",
      type: "ai",
      output: `AI fallback response for: ${packet.input}`
    })
  }
};
