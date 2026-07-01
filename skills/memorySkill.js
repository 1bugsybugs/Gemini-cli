const memory = require("../memory");

function save(packet) {
  const userId = packet.context?.userId || "default";

  const updated = memory.write(userId, {
    type: "memory",
    text: packet.input
  });

  return {
    status: "saved",
    type: "memory",
    data: updated
  };
}

function get(packet) {
  const userId = packet.context?.userId || "default";
  const query = (packet.input || "").toLowerCase();

  const data = memory.read(userId);

  const timeline = data.timeline || [];

  // If no search term, return full memory
  if (!query || query.includes("what do you remember")) {
    return {
      status: "ok",
      type: "memory",
      data
    };
  }

  // Filter timeline by keyword match
  const filtered = timeline.filter(item =>
    (item.text || "").toLowerCase().includes(query)
  );

  return {
    status: "ok",
    type: "memory",
    query,
    data: {
      timeline: filtered
    }
  };
}

module.exports = {
  save,
  get
};
