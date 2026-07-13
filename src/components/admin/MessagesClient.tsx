"use client";
import { useEffect, useRef, useState } from "react";
import type { Candidate, Message } from "@/lib/messages";

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

export default function MessagesClient({ candidates }: { candidates: Candidate[] }) {
  const [selected, setSelected] = useState<Candidate | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);
  const [query, setQuery] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-open the first thread on desktop; on mobile keep the list visible.
  useEffect(() => {
    if (candidates.length > 0 && window.matchMedia("(min-width: 768px)").matches) {
      setSelected(candidates[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadThread = async (id: string) => {
    const res = await fetch(`/api/admin/messages?applicationId=${id}`);
    const json = await res.json();
    if (json.ok) setMessages(json.messages);
  };

  // Poll the open thread every 4s for near-live updates.
  useEffect(() => {
    if (!selected) return;
    loadThread(selected.id);
    const t = setInterval(() => loadThread(selected.id), 4000);
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
    await fetch("/api/admin/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId: selected.id, body }),
    });
    await loadThread(selected.id);
    setSending(false);
  };

  const copyLink = () => {
    if (!selected) return;
    const url = `${window.location.origin}/chat/${selected.chatToken}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filtered = candidates.filter((c) =>
    `${c.name} ${c.position}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100dvh-11rem)] md:h-[calc(100vh-13rem)] rounded-xl overflow-hidden border border-[#e4bebc] bg-white">
      {/* Candidate list — full width on mobile, hidden when a chat is open */}
      <section
        className={`w-full md:w-[320px] md:border-r border-[#e4bebc] flex-col ${selected ? "hidden md:flex" : "flex"}`}
      >
        <div className="p-4 border-b border-[#e4bebc]">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search candidates…"
            className="w-full px-3 py-2 bg-[#f0f3ff] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#b7102a]"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="p-6 text-center text-sm text-[#586158]">No candidates yet.</p>
          ) : (
            filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelected(c)}
                className={`w-full text-left p-4 flex gap-3 border-b border-[#e4bebc]/50 transition-colors ${
                  selected?.id === c.id ? "bg-[#dce5d9]/40 border-l-4 border-l-[#b7102a]" : "hover:bg-[#f0f3ff]"
                }`}
              >
                <div className="w-11 h-11 rounded-full bg-[#b7102a]/10 text-[#b7102a] font-bold flex items-center justify-center shrink-0">
                  {initials(c.name)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{c.name}</p>
                  <p className="text-xs text-[#b7102a] font-semibold truncate">{c.position} applicant</p>
                  <p className="text-xs text-[#586158] truncate">{c.email}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </section>

      {/* Conversation — full width on mobile once opened */}
      <section className={`flex-1 flex-col bg-[#fbfbff] ${selected ? "flex" : "hidden md:flex"}`}>
        {!selected ? (
          <div className="flex-1 flex items-center justify-center text-[#586158]">Select a candidate to start chatting.</div>
        ) : (
          <>
            <div className="px-4 md:px-6 py-3 border-b border-[#e4bebc] flex justify-between items-center gap-2 bg-white">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => setSelected(null)}
                  className="md:hidden text-[#183153] -ml-1"
                  aria-label="Back to candidate list"
                >
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <div className="w-10 h-10 rounded-full bg-[#b7102a]/10 text-[#b7102a] font-bold flex items-center justify-center shrink-0">
                  {initials(selected.name)}
                </div>
                <div className="min-w-0">
                  <p className="font-bold truncate">{selected.name}</p>
                  <p className="text-xs text-[#586158] truncate">{selected.position} applicant</p>
                </div>
              </div>
              <button
                onClick={copyLink}
                className="px-3 md:px-4 py-2 border border-[#e4bebc] rounded-lg text-sm font-semibold hover:bg-[#f0f3ff] transition-colors flex items-center gap-1 shrink-0"
                title="Copy the private chat link to send to this applicant"
              >
                <span className="material-symbols-outlined text-[18px]">link</span>
                <span className="hidden sm:inline">{copied ? "Copied!" : "Copy chat link"}</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <p className="text-center text-sm text-[#586158] mt-8">
                  No messages yet. Send the first one — then share the chat link so they can reply.
                </p>
              ) : (
                messages.map((m) => (
                  <div key={m._id} className={`flex ${m.sender === "restaurant" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] md:max-w-[75%] p-3 md:p-4 rounded-2xl animate-scale-in ${
                        m.sender === "restaurant"
                          ? "bg-[#b7102a] text-white rounded-br-none"
                          : "bg-white border border-[#e4bebc] rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{m.body}</p>
                      <span className={`text-[10px] block text-right mt-1 ${m.sender === "restaurant" ? "text-white/70" : "text-[#586158]"}`}>
                        {new Date(m.createdAt).toLocaleString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>

            <div className="p-4 bg-white border-t border-[#e4bebc]">
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
                  placeholder={`Write a message to ${selected.name.split(" ")[0]}…`}
                  className="flex-1 bg-transparent px-3 py-2 text-sm resize-none outline-none"
                />
                <button
                  onClick={send}
                  disabled={sending || !text.trim()}
                  className="bg-[#b7102a] text-white w-10 h-10 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-50 hover:brightness-110 transition-all"
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
