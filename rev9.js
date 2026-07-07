const mission = require('./mission_control.json');
const dispatch = require('./dispatch');
const memory = require('./memory/engine');

function Rev9(packet) {

  const input = packet.input || "";

  // SAFE memory query (never assume shape)
  const memoryState = {
    recent: memory.queryMemory(
      memory.loadDB?.()?.timeline || [],
      input
    )
  };

  const finalPacket = {
    input,
    context: packet.context || {},
    memory: memoryState,
    mission
  };

  return dispatch(finalPacket);
}

module.exports = Rev9;
