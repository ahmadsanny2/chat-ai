
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faPencil,
  faSearch,
  faTrash,
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
  onDelete: (id: string) => void;
  onRename: (id: string, newTittle: string) => void;
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
  onDelete,
  onRename,
}: SideBarProps) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex max-md:fixed top-0">
      <div
        className={`bg-[#020817] text-white min-w-[280px] max-w-[280px] h-screen p-4 space-y-4 overflow-y-auto ${
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

        {/* Search */}
        <form className="flex gap-2">
          <input
            type="search"
            className="border-2 border-white rounded p-2 w-full"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
          />
          <button className="cursor-pointer bg-white/20 p-2 rounded hover:bg-white/10">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </form>

        <ul className="space-y-1">
          {chatSessions
            .filter((chat) =>
              chat.title.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((chat) => (
              <li className="" key={chat.id}>
                <div
                  className={`flex p-1 rounded items-center gap-2 ${
                    chat.id === activeChatId
                      ? "bg-white/20"
                      : "hover:bg-white/10"
                  }`}
                >
                  {/* Form edit title */}
                  {editingId === chat.id ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        onRename(chat.id, editTitle.trim() || "Untitled Chat");
                        setEditingId(null);
                      }}
                    >
                      <input
                        autoFocus
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => setEditingId(null)} // Jika klik di luar, keluar dari mode edit
                        className="bg-white/10 px-2 py-1 rounded text-white w-full"
                      />
                    </form>
                  ) : (
                    <button
                      className="w-full text-left px-2 py-1 cursor-pointer rounded"
                      onClick={() => onSelect(chat.id)}
                    >
                      {truncateText(chat.title || "Untitled Chat", 15)}
                    </button>
                  )}

                  <div className="flex gap-2">
                    <button
                      className="cursor-pointer p-2 text-green-500 bg-white/20 hover:bg-white/10 rounded-md"
                      onClick={() => {
                        setEditingId(chat.id);
                        setEditTitle(chat.title); // Set nilai awal untuk input edit
                      }}
                      title="Rename"
                    >
                      <FontAwesomeIcon icon={faPencil} />
                    </button>

                    {/* Button delete history */}
                    <button
                      className="cursor-pointer p-2 text-red-500 bg-white/20 hover:bg-white/10 rounded-md"
                      onClick={() => onDelete(chat.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </div>

      {/* Open or Close Sidebar */}
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
