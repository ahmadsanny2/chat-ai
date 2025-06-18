// Komponen Chat menerima props dari parent dan hanya bertugas menampilkan pesan serta input
import { useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleRight } from "@fortawesome/free-solid-svg-icons";
import ReactMarkdown from "react-markdown";

// Tipe pesan
interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatProps {
  messages: Message[]; // Daftar semua pesan
  value: string; // Nilai input saat ini
  onChange: (val: string) => void; // Handler saat input diubah
  onSubmit: (val: string) => void; // Handler saat form dikirim
  isLoading: boolean; // Menunjukkan status loading
}

export default function Chat({
  messages,
  value,
  onChange,
  onSubmit,
  isLoading,
}: ChatProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [value]); // Auto-resize textarea saat value berubah

  return (
    <div className="h-screen grid grid-rows-[6.9fr_1fr] text-white">
      <div className="overflow-auto px-5" id="scrollbar">
        {/* <div className="bg-[#1a1919] w-full p-2">
          <h1 className="text-xl">Create website Chat AI with Next JS</h1>
        </div> */}
        <div className="pt-5">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex my-2 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start gap-2 ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <img
                  src={
                    message.role === "user"
                      ? "https://placehold.co/50x50?text=U"
                      : "https://placehold.co/50x50?text=AI"
                  }
                  alt=""
                  className="bg-blue-200 rounded-full"
                  width="50px"
                />

                <div
                  className={`${message.role === "user" ? "" : "bg-white/10"}
                   text-base leading-relaxed p-2 rounded-xl`}
                >
                  <ReactMarkdown
                    components={{
                      // Paragraf biasa
                      p: ({ children }) => (
                        <p className="mb-3 break-words text-white">
                          {children}
                        </p>
                      ),

                      // Heading level 1
                      h1: ({ children }) => (
                        <h1 className="text-xl font-bold mt-4 mb-2 text-white">
                          {children}
                        </h1>
                      ),

                      // Heading level 2
                      h2: ({ children }) => (
                        <h2 className="text-lg font-semibold mt-3 mb-1 text-white">
                          {children}
                        </h2>
                      ),

                      // List unordered
                      ul: ({ children }) => (
                        <ul className="list-disc ml-6 mb-3 text-white">
                          {children}
                        </ul>
                      ),

                      // List ordered
                      ol: ({ children }) => (
                        <ol className="list-decimal ml-6 mb-3 text-white">
                          {children}
                        </ol>
                      ),

                      // Inline code
                      code: ({ children }) => (
                        <code className="bg-white/20 text-sm px-1 py-0.5 break-words whitespace-pre-wrap max-w-full rounded text-white overflow-auto">
                          {children}
                        </code>
                      ),

                      // Block code (pre)
                      pre: ({ children }) => (
                        <pre className="text-sm p-3 rounded overflow-x-auto text-white max-w-full whitespace-pre-wrap break-words">
                          {children}
                        </pre>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="text-gray-500 italic">AI is typing...</div>
          )}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault(); // Cegah reload halaman
          onSubmit(value); // Kirim ke handler parent
        }}
        className="flex bg-transparent w-full items-center py-1 px-5 gap-2"
      >
        <div className="w-full">
          <div className="flex w-full gap-2 items-center">
            <textarea
              value={value}
              disabled={isLoading}
              ref={textareaRef}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSubmit(value);
                }
              }}
              className="w-full min-h-[20px] max-h-[50px] resize-none overflow-auto p-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-200 transition text-base leading-relaxed placeholder:text-gray-500 text-gray-100 rounded-xl"
              placeholder="Type your message..."
            />
            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer h-10 text-3xl text-white"
            >
              <FontAwesomeIcon icon={faArrowAltCircleRight} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
