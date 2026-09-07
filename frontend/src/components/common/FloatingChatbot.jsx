import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaRobot } from "react-icons/fa";
import { FiX, FiSend, FiMinimize2, FiMaximize2 } from "react-icons/fi";
import { chatApi } from "../../api/chatApi.js";

export default function FloatingChatbot() {
  const { user } = useSelector((state) => state.auth);
  // Only show for manager or admin
  const isManager = user?.role === "manager" || user?.role === "admin";

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "ai",
      content: "Hello! I am your AI Assistant. I can summarize team reports, highlight blockers, or track progress. How can I help you today?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  if (!isManager) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", content: userMessage },
    ]);
    setIsLoading(true);

    try {
      const response = await chatApi({ message: userMessage });
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString() + "-ai", role: "ai", content: response.answer },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "-error",
          role: "ai",
          content: "Sorry, I encountered an error communicating with the server. Please try again later.",
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-600/30 dark:shadow-blue-900/40 transition-all hover:scale-105 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 hover:from-blue-500 hover:to-indigo-500"
          aria-label="Open AI Assistant"
        >
          <FaRobot className="text-2xl" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-white dark:border-slate-900"></span>
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl border shadow-2xl transition-all duration-300 ${
            isExpanded ? "w-[90vw] h-[85vh] sm:w-[600px] sm:h-[80vh]" : "w-[350px] h-[500px]"
          } bg-white dark:bg-slate-900/95 dark:backdrop-blur-xl border-slate-200 dark:border-slate-700/80`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-blue-600/10 dark:border-slate-700/80 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-slate-800 dark:to-slate-900 rounded-t-2xl">
            <div className="flex items-center gap-3 text-white">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center border border-white/20">
                <FaRobot className="text-white text-lg" />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-tight">AI Assistant</h3>
                <p className="text-[10px] text-blue-100 font-medium">Enterprise Reporting Analyst</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                {isExpanded ? <FiMinimize2 /> : <FiMaximize2 />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:bg-white/20 hover:text-white transition-colors"
              >
                <FiX />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/50 custom-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-600/20"
                      : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none shadow-sm"
                  } ${msg.isError ? "border-red-300 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400" : ""}`}
                >
                  {msg.role === "ai" && (
                    <div className="flex items-center gap-1.5 mb-1 opacity-60">
                      <FaRobot className="text-[10px]" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">AI</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex w-full justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-bl-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 shadow-sm flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 rounded-b-2xl">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about team reports or blockers..."
                className="w-full bg-slate-100 dark:bg-slate-800 border-0 rounded-xl py-3 pl-4 pr-12 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="absolute right-2 p-2 rounded-lg bg-blue-600 text-white disabled:opacity-50 hover:bg-blue-700 transition-colors"
              >
                <FiSend className="text-sm" />
              </button>
            </form>
            <div className="text-center mt-2">
              <span className="text-[10px] text-slate-400 dark:text-slate-500">
                AI can make mistakes. Verify important information.
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
