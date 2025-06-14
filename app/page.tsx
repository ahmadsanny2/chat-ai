"use client";

import { useState, useEffect } from "react";
import Chat from "./components/Chat";
import Sidebar from "./components/Sidebar";
import { v4 as uuidv4 } from "uuid";

// Tipe pesan
interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Ambil dari localStorage saat pertama load atau buat default chat
  useEffect(() => {
    const saved = localStorage.getItem("chat-sessions");
    if (saved) {
      const parsed = JSON.parse(saved);
      setChatSessions(parsed);
      setActiveChatId(parsed[0]?.id || null);
    } else {
      const newChat: ChatSession = {
        id: uuidv4(),
        title: "New Chat",
        messages: [],
        createdAt: new Date().toISOString(),
      };
      setChatSessions([newChat]);
      setActiveChatId(newChat.id);
    }
  }, []);

  // Simpan ke localStorage saat chatSessions berubah
  useEffect(() => {
    if (chatSessions.length > 0) {
      localStorage.setItem("chat-sessions", JSON.stringify(chatSessions));
    }
  }, [chatSessions]);

  const createNewChat = () => {
    const newChat: ChatSession = {
      id: uuidv4(),
      title: "New Chat",
      messages: [],
      createdAt: new Date().toISOString(),
    };
    setChatSessions([newChat, ...chatSessions]);
    setActiveChatId(newChat.id);
  };

  const activeChat = chatSessions.find((c) => c.id === activeChatId);

  const handleSubmit = async (text: string) => {
    if (!activeChat || !text.trim()) return;

    const userMsg: Message = { role: "user", content: text };

    const updated = chatSessions.map((c) => {
      if (c.id === activeChat.id) {
        const updatedMessages = [...c.messages, userMsg];
        const newTitle = c.messages.length === 0 ? text.slice(0, 30) : c.title;
        return { ...c, messages: updatedMessages, title: newTitle };
      }
      return c;
    });

    setChatSessions(updated);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const container = document.getElementById("scrollbar");
      if (container) container.scrollTop = container.scrollHeight;
    }, 100);

    try {
      const newMessages = updated.find((c) => c.id === activeChat.id)?.messages || [];

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      const aiMsg: Message = { role: "assistant", content: data.response };

      const final = updated.map((c) =>
        c.id === activeChat.id ? { ...c, messages: [...c.messages, aiMsg] } : c
      );

      setChatSessions(final);

      setTimeout(() => {
        const container = document.getElementById("scrollbar");
        if (container) container.scrollTop = container.scrollHeight;
      }, 100);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex h-screen gap-2">
        <Sidebar
          chatSessions={chatSessions}
          activeChatId={activeChatId}
          onSelect={setActiveChatId}
          onNewChat={createNewChat}
        />
        <div className="flex-1">
          {activeChat && (
            <Chat
              messages={activeChat.messages}
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              isLoading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
