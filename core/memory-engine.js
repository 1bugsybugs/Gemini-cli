const fs = require("fs");
const path = require("path");

const MEMORY_DIR = path.join(__dirname, "..", "memory");

const files = {
  goals: "goals.json",
  decisions: "decisions.json",
  lessons: "lessons.json",
  projects: "projects.json",
};

function ensureFile(type) {
  const filePath = path.join(MEMORY_DIR, files[type]);
  if (!fs.existsSync(MEMORY_DIR)) fs.mkdirSync(MEMORY_DIR);
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "[]");
  return filePath;
}

function readMemory(type) {
  const filePath = ensureFile(type);
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function saveMemory(type, data) {
  const filePath = ensureFile(type);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function remember(type, text, tags = []) {
  if (!files[type]) throw new Error(`Unknown memory type: ${type}`);

  const data = readMemory(type);

  const entry = {
    id: Date.now().toString(),
    text,
    tags,
    createdAt: new Date().toISOString(),
  };

  data.push(entry);
  saveMemory(type, data);

  return entry;
}

function recall(type, keyword = "") {
  if (!files[type]) throw new Error(`Unknown memory type: ${type}`);

  const data = readMemory(type);

  if (!keyword) return data;

  return data.filter(entry =>
    entry.text.toLowerCase().includes(keyword.toLowerCase()) ||
    entry.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))
  );
}

module.exports = {
  remember,
  recall,
  readMemory,
};
