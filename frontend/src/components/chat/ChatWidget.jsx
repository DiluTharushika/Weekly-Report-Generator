import { useState } from "react";
import { chatApi } from "../../api/chatApi.js";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    { role: "assistant", text: "Ask me about weekly reports (e.g., blockers, achievements, summaries)." },
  ]);

  const send = async () => {
    const text = input.trim();
    if (!text) return;

    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await chatApi({ message: text });
      setMessages((m) => [...m, { role: "assistant", text: res.answer }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: err?.response?.data?.message || "Chat error" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 rounded-full bg-slate-900 text-white px-4 py-3 shadow-lg hover:bg-slate-800"
      >
        AI Chat
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-20 right-5 w-[360px] max-w-[90vw] rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="font-semibold text-slate-900 text-sm">Manager Assistant</div>
            <button onClick={() => setOpen(false)} className="text-slate-500 text-sm">Close</button>
          </div>

          <div className="p-3 h-[320px] overflow-y-auto space-y-2 bg-slate-50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap ${
                  m.role === "user"
                    ? "ml-auto bg-blue-600 text-white"
                    : "mr-auto bg-white border border-slate-200 text-slate-800"
                }`}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="mr-auto bg-white border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-sm">
                Thinking...
              </div>
            )}
          </div>

          <div className="p-3 border-t border-slate-200 flex gap-2">
            <input
              className="flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question..."
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button
              onClick={send}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}