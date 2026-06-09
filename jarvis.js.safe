require('dotenv').config();

const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const fs = require('fs');
const path = require('path');
const memory = require("./core/memory-engine");
const stats = require("./core/stats");
const MC_PATH = path.join(process.env.HOME, 'jarvis', 'mission_control.json');
let [,, taskDescription, agent] = process.argv;

// Load data
const data = JSON.parse(fs.readFileSync(MC_PATH, 'utf8'));
// Handle "leaderboard" command
if (taskDescription === "leaderboard") {
    const statsData = JSON.parse(
        fs.readFileSync("./stats/agents.json", "utf8")
    );

    console.log("\n🏆 AGENT LEADERBOARD 🏆\n");

    const sorted = Object.entries(statsData)
        .sort((a, b) => b[1].completed - a[1].completed);

    sorted.forEach(([agent, info], index) => {
        console.log(
            `${index + 1}. ${agent} - ${info.completed} completed tasks`
        );
    });

    process.exit(0);
}

// Handle "status" command
if (taskDescription === 'status') {
    const sprint = data.active_sprint;
    if (!sprint) {
        console.log("System Status: Idle. No active tasks.");
    } else {
        console.log(`--- ACTIVE SPRINT ---`);
        console.log(`Task: ${sprint.current_task.description}`);
        console.log(`Agent: ${sprint.current_task.assigned_agent}`);
        console.log(`Status: ${sprint.status}`);
    }
    process.exit(0);
}

// Handle "done" command
if (taskDescription === 'done') {
  if (!data.active_sprint) {
    console.log("No active task to complete.");
  } else {
    memory.remember(
      "lessons",
      `Completed task: ${data.active_sprint.current_task.description} using agent ${data.active_sprint.current_task.assigned_agent}`,
      [
        "completed-task",
        data.active_sprint.current_task.assigned_agent.toLowerCase()
      ]
    );

    stats.recordSuccess(
      data.active_sprint.current_task.assigned_agent
    );

    data.history.push({
      ...data.active_sprint.current_task,
      completed_at: new Date().toISOString()
    });

    data.active_sprint = null;
    fs.writeFileSync(MC_PATH, JSON.stringify(data, null, 2));
    console.log("Task marked as complete, lesson saved, and stats updated.");
  }

  process.exit(0);
}
async function main() {
    // Existing task assignment logic
    if (!taskDescription) {
        console.log("Usage: node jarvis.js 'Your task' OR 'status' OR 'done'");
        process.exit(1);
    }

    if (!agent) {
    console.log("No agent provided. Asking Nemotron...");

    const response = await client.chat.completions.create({
        model: process.env.OPENROUTER_MODEL,
        messages: [
            {
                role: "system",
                content: `
Choose the best agent for the task.

Use Jarvis memory as context.

Goals:
${JSON.stringify(memory.recall("goals"), null, 2)}

Lessons:
${JSON.stringify(memory.recall("lessons"), null, 2)}

Decisions:
${JSON.stringify(memory.recall("decisions"), null, 2)}

Return only the agent name.
`
            },
            {
                role: "user",
                content: taskDescription
            }
        ]
    });

    agent = response.choices[0].message.content.trim().toUpperCase();
    console.log(`Nemotron chose: ${agent}`);
}

    data.active_sprint = {
    project_id: "manual_trigger",
    status: "in_progress",
    current_task: {
        description: taskDescription,
        assigned_agent: agent.toUpperCase(),
        priority: "normal"
    }
};

    fs.writeFileSync(MC_PATH, JSON.stringify(data, null, 2));

console.log(`Task '${taskDescription}' assigned to ${agent.toUpperCase()}. Jarvis mission control updated.`);
}

main().catch(console.error);
