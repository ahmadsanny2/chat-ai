import { auto } from "openai/_shims/registry.mjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

interface SideBarProps {
  chatSessions: {
    id: string;
    title: string;
    createdAt: string;
  }[];
  activeChatId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
}

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export default function Sidebar({
  chatSessions,
  activeChatId,
  onSelect,
  onNewChat,
}: SideBarProps) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  return (
    <div className="flex max-md:fixed top-0">
      <div
        className={`bg-[#181818] text-white min-w-[250px] h-screen p-4 space-y-4 overflow-y-auto ${
          menuIsOpen ? "block" : "hidden"
        }`}
      >
        <h1 className="text-2xl">Chat AI</h1>
        <button
          className="w-full bg-white/20 hover:bg-white/10 px-4 py-2 cursor-pointer rounded"
          onClick={onNewChat}
        >
          + New Chat
        </button>

        <ul className="space-y-1">
          {chatSessions.map((chat) => (
            <li className="" key={chat.id}>
              <div
                className={`flex p-1 rounded ${
                  chat.id === activeChatId ? "bg-white/20" : "hover:bg-white/10"
                }`}
              >
                <button
                  className="w-full text-left px-2 py-1 cursor-pointer rounded"
                  onClick={() => onSelect(chat.id)}
                >
                  {truncateText(chat.title || "Untitled Chat", 25)}
                </button>
                <button className="cursor-pointer p-2">
                  <FontAwesomeIcon icon={faPencil} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="text-white">
        <FontAwesomeIcon
          icon={menuIsOpen ? faArrowLeft : faArrowRight}
          className="text-2xl p-2 cursor-pointer"
          onClick={() => setMenuIsOpen(!menuIsOpen)}
        />
      </div>
    </div>
  );
}
