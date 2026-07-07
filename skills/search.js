module.exports = {
  name: "search",

  match(packet) {
  const text = (packet?.input || "").toString().toLowerCase();
  return text.includes("search") || text.includes("look up");
},

  async run(packet) {
    return {
      status: "success",
      type: "search",
      query: packet.input,
      result: `Pretend search results for: ${packet.input}`
    };
  }
};
