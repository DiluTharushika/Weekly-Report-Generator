import { useState, useRef, useEffect } from "react";
import { chatApi } from "../../api/chatApi.js";
import { getDashboardSummaryApi } from "../../api/dashboardApi.js";
import {
  FiMessageSquare,
  FiSend,
  FiX,
  FiRefreshCw,
  FiCalendar,
  FiCpu,
  FiChevronDown,
  FiCheckCircle,
  FiAlertCircle,
  FiLayers,
} from "react-icons/fi";

/* ── Robot Face Icon Component ── */
export const RobotFace = ({ className = "w-5 h-5", eyesColor = "currentColor" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Antenna */}
    <path d="M12 2v3" />
    <circle cx="12" cy="2" r="1.2" fill="currentColor" stroke="none" />

    {/* Side bolts / ears */}
    <rect x="2" y="10" width="2" height="4.5" rx="1" fill="currentColor" stroke="none" />
    <rect x="20" y="10" width="2" height="4.5" rx="1" fill="currentColor" stroke="none" />

    {/* Robot Head Body */}
    <rect x="4" y="5" width="16" height="15" rx="3.5" />

    {/* Eyes */}
    <circle cx="9" cy="11" r="1.5" fill={eyesColor} stroke="none" />
    <circle cx="15" cy="11" r="1.5" fill={eyesColor} stroke="none" />

    {/* Robot Mouth Grid */}
    <path d="M8.5 15.5h7" />
    <path d="M10.5 15.5v2" />
    <path d="M13.5 15.5v2" />
  </svg>
);

/* ── Suggested Quick Prompts ── */
const QUICK_PROMPTS = [
  { label: "Top Blockers", prompt: "What are the main blockers and key issues reported by the team?" },
  { label: "Key Achievements", prompt: "Summarize the key achievements and completed tasks this week." },
  { label: "Needs Correction", prompt: "Which team members submitted reports that need correction or have low progress?" },
  { label: "Executive Summary", prompt: "Give me an executive summary of the overall team progress and status." },
];

/* Simple formatter for bold text and bullet points */
const FormattedMessage = ({ text }) => {
  if (!text) return null;

  const lines = text.split("\n");

  return (
    <div className="space-y-1.5 text-sm leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Bullet list item
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          const content = trimmed.substring(2);
          return (
            <div key={idx} className="flex items-start gap-2 ml-1">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
              <span>{renderBold(content)}</span>
            </div>
          );
        }

        // Empty line
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Regular paragraph
        return <p key={idx}>{renderBold(line)}</p>;
      })}
    </div>
  );
};

/* Helper to render **bold** segments */
const renderBold = (str) => {
  const parts = str.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
};

export default function ChatWidget({ selectedWeek = "all", availableWeeks = [] }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCycle, setActiveCycle] = useState(selectedWeek);
  const [weeks, setWeeks] = useState(availableWeeks);

  useEffect(() => {
    if (availableWeeks && availableWeeks.length > 0) {
      setWeeks(availableWeeks);
    } else {
      getDashboardSummaryApi()
        .then((data) => {
          if (data?.availableWeeks?.length) {
            setWeeks(data.availableWeeks);
          }
        })
        .catch(() => {});
    }
  }, [availableWeeks]);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "👋 Hi! I'm your Manager AI Assistant. Ask me anything about your team's weekly reports, blockers, achievements, or project status.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Sync active cycle when parent selectedWeek changes
  useEffect(() => {
    if (selectedWeek) {
      setActiveCycle(selectedWeek);
    }
  }, [selectedWeek]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  const handleSend = async (messageText) => {
    const text = (messageText || input).trim();
    if (!text || loading) return;

    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Add user message
    setMessages((prev) => [...prev, { role: "user", text, timestamp: time }]);
    setInput("");
    setLoading(true);

    try {
      const payload = {
        message: text,
        ...(activeCycle && activeCycle !== "all" ? { weekStart: activeCycle } : {}),
      };

      const res = await chatApi(payload);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: res.answer || "No response received.",
          usedReports: res.usedReports,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          isError: true,
          text:
            err?.response?.data?.message ||
            "Unable to generate response. Please verify network connectivity or AI service credentials.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        role: "assistant",
        text: "Conversation cleared. How can I help you analyze team reports today?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* ── Chat Window Panel ── */}
      {open && (
        <div
          className="mb-4 w-[420px] max-w-[calc(100vw-2rem)] h-[580px] max-h-[calc(100vh-7rem)]
          rounded-3xl border shadow-2xl overflow-hidden flex flex-col transition-all duration-300
          bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl
          border-slate-200 dark:border-slate-800
          shadow-blue-900/20 dark:shadow-slate-950/80 animate-in fade-in slide-in-from-bottom-6"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800/80
            bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
                  <RobotFace className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black tracking-tight leading-tight">Report AI Assistant</h3>
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <p className="text-[11px] text-blue-100 font-medium">Team Report Analytics & Insights</p>
                </div>
              </div>

              {/* Window Controls */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  title="Clear conversation"
                  onClick={handleClearHistory}
                  className="p-2 rounded-xl text-blue-100 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                >
                  <FiRefreshCw className="text-sm" />
                </button>
                <button
                  type="button"
                  title="Close chat"
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-xl text-blue-100 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
                >
                  <FiX className="text-base" />
                </button>
              </div>
            </div>

            {/* Cycle Scope Bar */}
            <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-blue-100 font-medium">
                <FiCalendar className="text-yellow-300 text-xs" />
                <span>Scope:</span>
              </div>
              <div className="flex items-center gap-1">
                <select
                  value={activeCycle}
                  onChange={(e) => setActiveCycle(e.target.value)}
                  className="bg-white/20 hover:bg-white/25 text-white font-semibold text-[11px] rounded-lg px-2.5 py-1 border border-white/20 outline-none cursor-pointer backdrop-blur-sm"
                >
                  <option value="all" className="bg-slate-900 text-white">All Reports</option>
                  {(weeks || []).map((w) => (
                    <option key={w} value={w} className="bg-slate-900 text-white">
                      Week of {w}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Message List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 dark:bg-slate-950/40">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role !== "user" ? (
                  <div className="flex items-start gap-2.5 max-w-[88%]">
                    <div className="h-7 w-7 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-0.5 border border-white/20">
                      <RobotFace className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 flex flex-col items-start min-w-0">
                      <div
                        className={`rounded-2xl px-4 py-2.5 shadow-sm text-sm ${
                          m.isError
                            ? "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 rounded-tl-sm"
                            : "bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 text-slate-800 dark:text-slate-100 rounded-tl-sm shadow-slate-100 dark:shadow-slate-950/40"
                        }`}
                      >
                        <FormattedMessage text={m.text} />

                        {/* Context reports info badge */}
                        {m.usedReports !== undefined && (
                          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-400 font-semibold">
                            <FiLayers className="text-blue-500" />
                            <span>{m.usedReports} {m.usedReports === 1 ? "report" : "reports"} analyzed</span>
                          </div>
                        )}
                      </div>

                      {/* Timestamp */}
                      {m.timestamp && (
                        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-1 px-1">
                          {m.timestamp}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="max-w-[85%] flex flex-col items-end">
                    <div className="rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-sm text-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/15">
                      <FormattedMessage text={m.text} />
                    </div>
                    {m.timestamp && (
                      <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-1 px-1">
                        {m.timestamp}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex items-start gap-2.5">
                <div className="h-7 w-7 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-0.5 border border-white/20">
                  <RobotFace className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="h-2 w-2 rounded-full bg-blue-400 dark:bg-blue-300 animate-bounce" style={{ animationDelay: "300ms" }} />
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-1">
                    Analyzing reports...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Container */}
          <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 overflow-x-auto flex gap-1.5 no-scrollbar shrink-0">
            {QUICK_PROMPTS.map((qp, i) => (
              <button
                key={i}
                type="button"
                disabled={loading}
                onClick={() => handleSend(qp.prompt)}
                className="whitespace-nowrap text-[11px] font-semibold rounded-xl px-2.5 py-1 border transition-all cursor-pointer shrink-0
                  border-slate-200 dark:border-slate-800
                  bg-slate-50 dark:bg-slate-800/60
                  text-slate-600 dark:text-slate-300
                  hover:bg-blue-50 dark:hover:bg-blue-900/30
                  hover:border-blue-300 dark:hover:border-blue-700/50
                  hover:text-blue-600 dark:hover:text-blue-300
                  disabled:opacity-50"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about blockers, achievements, progress..."
                disabled={loading}
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 text-xs outline-none transition-all
                  bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/20"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="h-9 w-9 rounded-xl flex items-center justify-center text-white transition-all cursor-pointer shrink-0
                  bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500
                  disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-blue-500/20"
                title="Send message"
              >
                <FiSend className="text-xs" />
              </button>
            </form>
            <div className="mt-1.5 text-center text-[10px] text-slate-400 dark:text-slate-500 font-medium">
              Responses grounded in submitted weekly reports
            </div>
          </div>
        </div>
      )}

      {/* ── Floating Launcher Button ── */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="group relative flex items-center gap-2.5 rounded-full px-4 py-3 text-white font-bold text-sm shadow-xl transition-all duration-300 cursor-pointer
          bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-600
          shadow-blue-500/35 hover:shadow-blue-500/50 hover:scale-105 active:scale-95"
        aria-label="Toggle AI Assistant Chat"
      >
        {/* Glow halo */}
        <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 opacity-30 blur-sm group-hover:opacity-60 transition duration-300" />

        <div className="relative flex items-center gap-2">
          {open ? (
            <>
              <FiX className="text-lg" />
              <span>Close Assistant</span>
            </>
          ) : (
            <>
              <div className="relative flex items-center justify-center">
                <RobotFace className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-400" />
              </div>
              <span>AI Assistant</span>
            </>
          )}
        </div>
      </button>
    </div>
  );
}