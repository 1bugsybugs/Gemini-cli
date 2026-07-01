function run(packet) {
  return {
    status: "success",
    type: "search",
    query: packet.input,
    result: `Pretend search results for: ${packet.input}`
  };
}

module.exports = { run };
