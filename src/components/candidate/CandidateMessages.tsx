"use client";
import { useEffect, useRef, useState } from "react";
import type { Message } from "@/lib/messages";

type Convo = { token: string; restaurant: string; jobTitle: string; status: string };

export default function CandidateMessages({ conversations }: { conversations: Convo[] }) {
  const [selected, setSelected] = useState<Convo | null>(conversations[0] ?? null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

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
      <div className="bg-white rounded-xl p-12 text-center border border-[#e4bebc]">
        <p className="text-[#586158]">No conversations yet. Restaurants will message you here after you apply.</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-13rem)] rounded-xl overflow-hidden border border-[#e4bebc] bg-white">
      <section className="w-[320px] border-r border-[#e4bebc] flex flex-col">
        <div className="p-4 border-b border-[#e4bebc]">
          <h3 className="text-lg font-bold">Inbox</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((c) => (
            <button
              key={c.token}
              onClick={() => setSelected(c)}
              className={`w-full text-left p-4 border-b border-[#e4bebc]/50 transition-colors ${
                selected?.token === c.token ? "bg-[#dce5d9]/40 border-l-4 border-l-primary" : "hover:bg-[#f0f3ff]"
              }`}
            >
              <p className="text-sm font-semibold truncate">{c.restaurant || "Restaurant"}</p>
              <p className="text-xs text-primary font-semibold truncate">{c.jobTitle}</p>
              <span className="inline-block mt-1 text-[10px] font-bold uppercase text-[#586158]">{c.status}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="flex-1 flex flex-col bg-[#fbfbff]">
        {!selected ? (
          <div className="flex-1 flex items-center justify-center text-[#586158]">Select a conversation.</div>
        ) : (
          <>
            <div className="px-6 py-3 border-b border-[#e4bebc] bg-white">
              <p className="font-bold">{selected.restaurant}</p>
              <p className="text-xs text-[#586158]">{selected.jobTitle}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <p className="text-center text-sm text-[#586158] mt-8">No messages yet.</p>
              ) : (
                messages.map((m) => (
                  <div key={m._id} className={`flex ${m.sender === "applicant" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[75%] p-4 rounded-2xl ${
                        m.sender === "applicant" ? "bg-primary text-white rounded-br-none" : "bg-white border border-[#e4bebc] rounded-bl-none"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{m.body}</p>
                      <span className={`text-[10px] block text-right mt-1 ${m.sender === "applicant" ? "text-white/70" : "text-[#586158]"}`}>
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
                  placeholder="Type your message…"
                  className="flex-1 bg-transparent px-3 py-2 text-sm resize-none outline-none"
                />
                <button
                  onClick={send}
                  disabled={sending || !text.trim()}
                  className="bg-primary text-white w-10 h-10 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-50"
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
