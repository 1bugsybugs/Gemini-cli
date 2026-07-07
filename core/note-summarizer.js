function summarizeNotes(text) {
  const cleaned = text
    .replace(/^summarize\s*/i, "")
    .trim();

  return {
    summary: `Rev-9 received notes to summarize: ${cleaned}`,
    action_items: [
      "Review the notes",
      "Extract important decisions",
      "Create next steps"
    ]
  };
}

module.exports = {
  summarizeNotes
};
