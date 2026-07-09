"use client";
import { useEffect, useRef, useState } from "react";
import type { Message } from "@/lib/messages";

export default function ChatClient({
  token,
  restaurant,
  jobTitle,
  applicant,
  initial,
}: {
  token: string;
  restaurant: string;
  jobTitle: string;
  applicant: string;
  initial: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initial);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    const res = await fetch(`/api/chat/${token}`);
    const json = await res.json();
    if (json.ok) setMessages(json.messages);
  };

  useEffect(() => {
    const t = setInterval(load, 4000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!text.trim()) return;
    setSending(true);
    const body = text.trim();
    setText("");
    await fetch(`/api/chat/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    await load();
    setSending(false);
  };

  return (
    <div className="max-w-[720px] mx-auto w-full flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="px-6 py-4 border-b border-outline-variant bg-white">
        <p className="font-bold text-lg">{restaurant}</p>
        <p className="text-sm text-on-surface-variant">
          Your application for <span className="font-semibold">{jobTitle}</span> · chatting as {applicant}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#fbfbff]">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-on-surface-variant mt-8">
            No messages yet. The restaurant will reach out here — you can reply anytime.
          </p>
        ) : (
          messages.map((m) => (
            <div key={m._id} className={`flex ${m.sender === "applicant" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] p-4 rounded-2xl ${
                  m.sender === "applicant"
                    ? "bg-primary text-on-primary rounded-br-none"
                    : "bg-white border border-outline-variant rounded-bl-none"
                }`}
              >
                <p className="text-sm whitespace-pre-line">{m.body}</p>
                <span className={`text-[10px] block text-right mt-1 ${m.sender === "applicant" ? "text-white/70" : "text-on-surface-variant"}`}>
                  {new Date(m.createdAt).toLocaleString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-white border-t border-outline-variant">
        <div className="flex items-end gap-2 bg-[#f0f3ff] border border-outline-variant rounded-2xl p-2">
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
            placeholder="Write a message…"
            className="flex-1 bg-transparent px-3 py-2 text-sm resize-none outline-none"
          />
          <button
            onClick={send}
            disabled={sending || !text.trim()}
            className="bg-primary text-on-primary w-10 h-10 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-50 hover:brightness-110 transition-all"
          >
            <span className="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
