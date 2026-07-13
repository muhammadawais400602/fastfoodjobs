"use client";
import { useEffect, useRef, useState } from "react";
import type { Message } from "@/lib/messages";

type Convo = { token: string; restaurant: string; jobTitle: string; status: string; unread?: number };

export default function CandidateMessages({ conversations }: { conversations: Convo[] }) {
  const [selected, setSelected] = useState<Convo | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-open the first conversation on desktop; on mobile keep the inbox visible.
  useEffect(() => {
    if (conversations.length > 0 && window.matchMedia("(min-width: 768px)").matches) {
      setSelected(conversations[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = async (token: string) => {
    const res = await fetch(`/api/chat/${token}`);
    const json = await res.json();
    if (json.ok) setMessages(json.messages);
  };

  useEffect(() => {
    if (!selected) return;
    load(selected.token);
    const t = setInterval(() => load(selected.token), 4000);
    return () => clearInterval(t);
  }, [selected]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!selected || !text.trim()) return;
    setSending(true);
    const body = text.trim();
    setText("");
    await fetch(`/api/chat/${selected.token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    await load(selected.token);
    setSending(false);
  };

  if (conversations.length === 0) {
    return (
      <div className="bg-white rounded-xl p-12 text-center border border-[#e4bebc] animate-fade-in-up">
        <p className="text-[#586158]">No conversations yet. Restaurants will message you here after you apply.</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100dvh-11rem)] md:h-[calc(100vh-13rem)] rounded-xl overflow-hidden border border-[#e4bebc] bg-white">
      {/* Inbox list — full width on mobile, hidden when a chat is open */}
      <section
        className={`w-full md:w-[320px] md:border-r border-[#e4bebc] flex-col ${
          selected ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="p-4 border-b border-[#e4bebc]">
          <h3 className="text-lg font-bold">Inbox</h3>
        </div>
        <div className="flex-1 overflow-y-auto stagger-children">
          {conversations.map((c) => (
            <button
              key={c.token}
              onClick={() => setSelected(c)}
              className={`w-full text-left p-4 border-b border-[#e4bebc]/50 transition-colors ${
                selected?.token === c.token ? "bg-[#dce5d9]/40 border-l-4 border-l-primary" : "hover:bg-[#f0f3ff]"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{c.restaurant || "Restaurant"}</p>
                  <p className="text-xs text-primary font-semibold truncate">{c.jobTitle}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold uppercase text-[#586158]">{c.status}</span>
                </div>
                {(c.unread ?? 0) > 0 && selected?.token !== c.token && (
                  <span className="shrink-0 min-w-[22px] h-[22px] px-1.5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {(c.unread ?? 0) > 9 ? "9+" : c.unread}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Chat pane — full width on mobile once opened */}
      <section className={`flex-1 flex-col bg-[#fbfbff] ${selected ? "flex" : "hidden md:flex"}`}>
        {!selected ? (
          <div className="flex-1 flex items-center justify-center text-[#586158]">Select a conversation.</div>
        ) : (
          <>
            <div className="px-4 md:px-6 py-3 border-b border-[#e4bebc] bg-white flex items-center gap-3">
              <button
                onClick={() => setSelected(null)}
                className="md:hidden text-[#183153] -ml-1"
                aria-label="Back to inbox"
              >
                <span className="material-symbols-outlined">arrow_back</span>
              </button>
              <div className="min-w-0">
                <p className="font-bold truncate">{selected.restaurant}</p>
                <p className="text-xs text-[#586158] truncate">{selected.jobTitle}</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {messages.length === 0 ? (
                <p className="text-center text-sm text-[#586158] mt-8">No messages yet.</p>
              ) : (
                messages.map((m) => (
                  <div key={m._id} className={`flex ${m.sender === "applicant" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] md:max-w-[75%] p-3 md:p-4 rounded-2xl animate-scale-in ${
                        m.sender === "applicant" ? "bg-primary text-white rounded-br-none" : "bg-white border border-[#e4bebc] rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line break-words">{m.body}</p>
                      <span className={`text-[10px] block text-right mt-1 ${m.sender === "applicant" ? "text-white/70" : "text-[#586158]"}`}>
                        {new Date(m.createdAt).toLocaleString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>
            <div className="p-3 md:p-4 bg-white border-t border-[#e4bebc]">
              <div className="flex items-end gap-2 bg-[#f0f3ff] border border-[#e4bebc] rounded-2xl p-2">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  rows={2}
                  maxLength={2000}
                  placeholder="Type your message…"
                  className="flex-1 bg-transparent px-3 py-2 text-sm resize-none outline-none min-w-0"
                />
                <button
                  onClick={send}
                  disabled={sending || !text.trim()}
                  className="bg-primary text-white w-10 h-10 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-50 active:scale-90 transition-transform"
                >
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
