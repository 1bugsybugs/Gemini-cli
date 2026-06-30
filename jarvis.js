require('dotenv').config({ quiet: true });

const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const fs = require('fs');
const path = require('path');
const memory = require("./core/memory-engine");
const stats = require("./core/stats");
const { spawnSync } = require("child_process");
const MC_PATH = path.join(process.env.HOME, 'jarvis', 'mission_control.json');
let [,, taskDescription, agent] = process.argv;

// Load data
const data = JSON.parse(fs.readFileSync(MC_PATH, 'utf8'));
// Handle "doctor" command
if (taskDescription === "doctor") {
    console.log("\n🩺 REV-9 SYSTEM DOCTOR\n");

    const checks = [
        ["mission_control.json", MC_PATH],
        [".env", path.join(process.env.HOME, "jarvis", ".env")],
        ["core/memory-engine.js", "./core/memory-engine.js"],
        ["core/stats.js", "./core/stats.js"],
        ["workers/developer.js", "./workers/developer.js"],
        ["stats/agents.json", "./stats/agents.json"],
        ["projects folder", "./projects"],
        ["memory folder", "./memory"],
        ["logs folder", "./logs"]
    ];

    let problems = 0;

    checks.forEach(([name, filePath]) => {
        if (fs.existsSync(filePath)) {
            console.log(`✅ ${name}`);
        } else {
            console.log(`❌ ${name} missing`);
            problems++;
        }
    });

    console.log("\n🔑 ENV CHECK");

    if (process.env.OPENROUTER_API_KEY) {
        console.log("✅ OPENROUTER_API_KEY loaded");
    } else {
        console.log("❌ OPENROUTER_API_KEY missing");
        problems++;
    }

    if (process.env.OPENROUTER_MODEL) {
        console.log(`✅ OPENROUTER_MODEL loaded: ${process.env.OPENROUTER_MODEL}`);
    } else {
        console.log("❌ OPENROUTER_MODEL missing");
        problems++;
    }

    console.log("\n📋 MISSION CONTROL");

    if (data.active_sprint) {
        console.log(`Active task: ${data.active_sprint.current_task.description}`);
        console.log(`Agent: ${data.active_sprint.current_task.assigned_agent}`);
        console.log(`Status: ${data.active_sprint.status}`);
    } else {
        console.log("No active sprint.");
    }

    console.log("\n🧠 MEMORY / STATS");

    try {
        const statsData = JSON.parse(fs.readFileSync("./stats/agents.json", "utf8"));
        const agents = Object.keys(statsData);

        if (agents.length === 0) {
            console.log("No agent stats yet.");
        } else {
            agents.forEach(agentName => {
                console.log(`${agentName}: ${statsData[agentName].completed} completed tasks`);
            });
        }
    } catch (err) {
        console.log("❌ Could not read stats/agents.json");
        problems++;
    }

    console.log("\n🏁 RESULT");

    if (problems === 0) {
        console.log("REV-9 looks clean. System online.");
    } else {
        console.log(`REV-9 found ${problems} issue(s). Fix those before upgrading further.`);
    }

    process.exit(0);
}
// Handle "skills" command
if (taskDescription === "skills") {
    console.log("\n🧰 REV-9 SKILL LOADOUT\n");

    console.log("🤖 AGENTS");
    console.log("DEVELOPER - Builds project folders, source files, notes, and templates.");
    console.log("GEMINI - Planned/experimental agent slot.");
    console.log("NEMOTRON - Used for agent picking when no agent is provided.");

    console.log("\n📦 COMMANDS");
    console.log("status      - Show active sprint or idle state.");
    console.log("doctor      - Check required files, env, memory, stats, and system health.");
    console.log("leaderboard - Show completed task count by agent.");
    console.log("done        - Mark active sprint complete, save lesson, update stats.");
    console.log("skills      - Show this skill list.");

    console.log("\n🧠 MEMORY");
    console.log("memory-engine.js - Saves lessons and recalls goals, lessons, and decisions.");

    console.log("\n🏗️ PROJECT BUILDER");
    console.log("workers/developer.js - Handles build tasks when assigned to DEVELOPER.");

    console.log("\n🏁 RESULT");
    console.log("Rev-9 knows its current tools. Skill scan complete.");

    process.exit(0);
}
// Handle "help" command
if (taskDescription === "help") {
    console.log("\n📟 REV-9 COMMAND CENTER\n");

    console.log("Main commands:");
    console.log("node jarvis.js status");
    console.log("node jarvis.js doctor");
    console.log("node jarvis.js skills");
    console.log("node jarvis.js agents");
    console.log("node jarvis.js history");
    console.log("node jarvis.js summary");
    console.log("node jarvis.js leaderboard");
    console.log("node jarvis.js done");

    console.log("\nAssign a task:");
    console.log('node jarvis.js "build a calculator app" DEVELOPER');

    console.log("\nAuto-pick agent:");
    console.log('node jarvis.js "build a landing page"');

    console.log("\nNotes:");
    console.log("- Use quotes around tasks with spaces.");
    console.log("- Use DEVELOPER when you want project files made.");
    console.log("- Run doctor if something feels busted.");

    console.log("\nREV-9 ready.");

    process.exit(0);
}
// Handle "agents" command
if (taskDescription === "agents") {
    console.log("\n🤖 REV-9 AGENT ROSTER\n");

    console.log("ACTIVE AGENTS:");
    console.log("DEVELOPER");
    console.log("Role: Builds project folders, templates, files, and reports.");
    console.log("Worker: workers/developer.js");
    console.log("Status: ONLINE");

    console.log("\nPLANNED AGENTS:");
    console.log("GEMINI");
    console.log("Role: Experimental research / second-brain agent.");
    console.log("Status: PLANNED");

    console.log("\nROUTER:");
    console.log("NEMOTRON");
    console.log("Role: Picks the best agent when no agent is provided.");
    console.log("Status: API-BASED");

    console.log("\nHOW TO USE:");
    console.log('node jarvis.js "build a landing page" DEVELOPER');
    console.log('node jarvis.js "build a calculator app" DEVELOPER');

    console.log("\nAgent scan complete.");

    process.exit(0);
}
// Handle "history" command
if (taskDescription === "history") {
    console.log("\n📜 REV-9 TASK HISTORY\n");

    if (!data.history || data.history.length === 0) {
        console.log("No completed tasks found yet.");
        console.log("\nRun a task, then use:");
        console.log("node jarvis.js done");
        console.log("\nHistory scan complete.");
        process.exit(0);
    }

    const recent = data.history.slice(-10).reverse();

    recent.forEach((task, index) => {
        console.log(`${index + 1}. ${task.description}`);
        console.log(`   Agent: ${task.assigned_agent || "UNKNOWN"}`);
        console.log(`   Priority: ${task.priority || "normal"}`);

        if (task.completed_date) {
            console.log(`   Completed: ${task.completed_date}`);
        }

        console.log("");
    });

    console.log(`Showing ${recent.length} most recent completed task(s).`);
    console.log("History scan complete.");

    process.exit(0);
}
// Handle "summary" command
if (taskDescription === "summary") {
    console.log("\n📊 REV-9 TASK SUMMARY\n");

    if (!data.history || data.history.length === 0) {
        console.log("No completed tasks found yet.");
        console.log("Summary scan complete.");
        process.exit(0);
    }

    const taskCounts = {};

    data.history.forEach(task => {
        const name = task.description || "UNKNOWN TASK";
        taskCounts[name] = (taskCounts[name] || 0) + 1;
    });

    const sortedTasks = Object.entries(taskCounts)
        .sort((a, b) => b[1] - a[1]);

    sortedTasks.forEach(([taskName, count], index) => {
        console.log(`${index + 1}. ${taskName}`);
        console.log(`   Completed: ${count} time(s)`);
        console.log("");
    });

    console.log(`Total completed tasks: ${data.history.length}`);
    console.log(`Unique task types: ${sortedTasks.length}`);
    console.log("Summary scan complete.");

    process.exit(0);
}

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
        assigned_agent: 'DEVELOPER',
        priority: "normal"
    }
};

    fs.writeFileSync(MC_PATH, JSON.stringify(data, null, 2));

console.log(`Task '${taskDescription}' assigned to ${agent.toUpperCase()}. Jarvis mission control updated.`);
if (agent.toUpperCase() === "DEVELOPER") {
  spawnSync("node", ["workers/developer.js"], { stdio: "inherit" });
}

}

main().catch(console.error);
