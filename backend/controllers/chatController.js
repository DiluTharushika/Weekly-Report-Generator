const OpenAI = require("openai");
const Report = require("../models/Report");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const toYMD = (d) => new Date(d).toISOString().slice(0, 10);

// Build a compact text context from reports
const buildReportsContext = (reports) => {
  return reports
    .map((r) => {
      const member = r.user?.name || "Unknown";
      const project = r.project?.name || "Unknown Project";
      const week = `${toYMD(r.weekStart)} -> ${toYMD(r.weekEnd)}`;

      const completed = (r.tasksCompleted || [])
        .slice(0, 8)
        .map((t) => `- ${t.taskName} [${t.status}] (${t.actualPercent ?? 0}%)`)
        .join("\n");

      const blockers = (r.blockers || [])
        .slice(0, 5)
        .map((b) => `- ${b.description}${b.isKeyIssue ? " (KEY)" : ""}`)
        .join("\n");

      const achievements = (r.achievements || [])
        .slice(0, 5)
        .map((a) => `- ${a.description}${a.isKeyAchievement ? " (KEY)" : ""}`)
        .join("\n");

      return `
MEMBER: ${member}
WEEK: ${week}
PROJECT: ${project}
STATUS: ${r.status}

TASKS COMPLETED:
${completed || "- (none)"}

BLOCKERS:
${blockers || "- (none)"}

ACHIEVEMENTS:
${achievements || "- (none)"}
`.trim();
    })
    .join("\n\n---\n\n");
};

// POST /api/chat
// body: { message, weekStart? (YYYY-MM-DD) }
const chatWithReports = async (req, res, next) => {
  try {
    const { message, weekStart } = req.body;

    if (!message) {
      res.status(400);
      return res.json({ message: "message is required" });
    }

    // Default: last 7 days
    let from = new Date();
    from.setDate(from.getDate() - 7);
    let to = new Date();

    // If weekStart provided, use that week
    if (weekStart) {
      from = new Date(weekStart);
      to = new Date(from);
      to.setDate(to.getDate() + 6);
      to.setHours(23, 59, 59, 999);
    }

    const reports = await Report.find({
      weekStart: { $gte: from, $lte: to },
    })
      .populate("user", "name email")
      .populate("project", "name")
      .lean();

    const context = buildReportsContext(reports);

    const systemPrompt = `
You are an assistant for managers reviewing weekly team reports.
Rules:
- Use ONLY the provided report context.
- If the answer is not in the context, say you don't have enough data.
- Be concise, structured, and use bullet points where helpful.
- Do not reveal private data beyond member name + work content.
`;

    const userPrompt = `
MANAGER QUESTION:
${message}

REPORT CONTEXT:
${context || "(No reports found for the selected date range.)"}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt.trim() },
        { role: "user", content: userPrompt.trim() },
      ],
      temperature: 0.2,
    });

    const answer = completion.choices?.[0]?.message?.content || "No response";

    res.json({
      answer,
      usedReports: reports.length,
      dateRange: { from, to },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { chatWithReports };