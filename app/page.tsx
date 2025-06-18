"use client";

import { useState, useEffect } from "react";
import Chat from "./components/Chat";
import Sidebar from "./components/Sidebar";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabase";

// Tipe pesan
interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  created_at: string;
}

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const activeChat = chatSessions.find((c) => c.id === activeChatId);

  useEffect(() => {
    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from("chat_sessions")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setChatSessions(data);
        setActiveChatId(data[0].id);
      } else {
        const newChat = {
          id: uuidv4(),
          title: "New Chat",
          messages: [],
          created_at: new Date().toISOString(),
        };
        const { error: insertError } = await supabase
          .from("chat_sessions")
          .insert([newChat]);

        if (insertError) {
          console.error(
            "❌ Gagal insert:",
            insertError.message,
            insertError.details,
            insertError.hint
          );
        } else {
          setChatSessions([newChat]);
          setActiveChatId(newChat.id);
        }
      }
    };
    fetchSessions();
  }, []);

  const createNewChat = async () => {
    const newChat = {
      id: uuidv4(),
      title: "New Chat",
      messages: [],
      created_at: new Date().toISOString(),
    };

    const { error: insertError } = await supabase
      .from("chat_sessions")
      .insert([newChat]);
    if (insertError) {
      console.error(
        "❌ Gagal insert:",
        insertError.message,
        insertError.details
      );
      return;
    }

    setChatSessions([newChat, ...chatSessions]);
    setActiveChatId(newChat.id);
  };

  const handleSubmit = async (text: string) => {
    if (!activeChat || !text.trim()) return;

    const userMsg: Message = { role: "user", content: text };
    const updatedMessages = [...(activeChat.messages || []), userMsg];

    const updatedSessions = chatSessions.map((c) =>
      c.id === activeChat.id
        ? {
            ...c,
            messages: updatedMessages,
            title: c.title === "New Chat" ? text.slice(0, 30) : c.title,
          }
        : c
    );

    setChatSessions(updatedSessions);
    setInput("");
    setLoading(true);

    const updatedTitle =
      activeChat.title === "New Chat" && activeChat.messages.length === 0
        ? text.slice(0, 30)
        : activeChat.title;

    const { error: updateError } = await supabase
      .from("chat_sessions")
      .update({ messages: updatedMessages, title: updatedTitle })
      .eq("id", activeChat.id);

    if (updateError) {
      console.error("❌ Gagal update pesan:", updateError.message);
      return;
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();
      const aiMsg: Message = { role: "assistant", content: data.response };
      const finalMessages = [...updatedMessages, aiMsg];

      await supabase
        .from("chat_sessions")
        .update({ messages: finalMessages, title: updatedTitle })
        .eq("id", activeChat.id);

      const final = updatedSessions.map((c) =>
        c.id === activeChat.id ? { ...c, messages: finalMessages } : c
      );

      setChatSessions(final);

      setTimeout(() => {
        const container = document.getElementById("scrollbar");
        if (container) container.scrollTop = container.scrollHeight;
      }, 100);
    } catch (err) {
      console.error("❌ Error saat fetch AI:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (id: string) => {
    await supabase.from("chat_sessions").delete().eq("id", id);
    const filtered = chatSessions.filter((c) => c.id !== id);
    setChatSessions(filtered);

    if (id === activeChatId) {
      setActiveChatId(filtered[0]?.id || null);
    }
  };

  const handleRenameSession = async (id: string, newTitle: string) => {
    await supabase
      .from("chat_sessions")
      .update({ title: newTitle })
      .eq("id", id);
    const updated = chatSessions.map((c) =>
      c.id === id ? { ...c, title: newTitle } : c
    );
    setChatSessions(updated);
  };

  return (
    <div className="container mx-auto">
      <div className="flex h-screen gap-2">
        <Sidebar
          chatSessions={chatSessions}
          activeChatId={activeChatId}
          onSelect={setActiveChatId}
          onNewChat={createNewChat}
          onDelete={handleDeleteSession}
          onRename={handleRenameSession}
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
