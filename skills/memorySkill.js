const memory = require("../memory");

module.exports = {
  name: "memory",

  match(packet) {
    const text = (packet?.input || "").toString().toLowerCase();
    return text.includes("remember") || text.includes("what do you remember");
  },

  async run(packet) {
    const userId = packet?.context?.userId || "default";
    const input = packet?.input || "";

    const data = memory.read(userId);
    const timeline = data.timeline || [];

    const text = (input || "").toString().toLowerCase();

if (text.includes("remember")) {
      const updated = memory.write(userId, {
        type: "memory",
        text: input
      });

      return {
        status: "saved",
        type: "memory",
        data: updated
      };
    }

    const query = (input || "").toString().toLowerCase();

    const filtered = timeline.filter(item =>
      (item.text || "").toLowerCase().includes(query)
    );

    return {
      status: "ok",
      type: "memory",
      data: {
        timeline: filtered
      }
    };
  }
};
