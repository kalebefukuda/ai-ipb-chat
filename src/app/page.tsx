"use client"

import { useState } from "react"
import { Send, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import ReactMarkdown from "react-markdown"
import Image from "next/image"

type Message = {
  role: "user" | "assistant"
  content: string
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return

    const newMessages: Message[] = [...messages, { role: "user", content: input }]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    })

    const data = await res.json()
    setMessages([...newMessages, { role: "assistant", content: data.content }])
    setIsLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#022018]">
      <div className="w-full max-w-md flex flex-col h-[700px] rounded-lg overflow-hidden shadow-xl border border-green-900 bg-white">
        <div className="bg-[#00573f] text-white py-3 px-4 flex items-center gap-3">
          <Image src="/logo-ipb.png" alt="Logo" width={40} height={40} className="rounded-full" />
          <h1 className="font-semibold text-base">Igreja Presbiteriana do Brasil</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-20">
              <p className="text-sm">Bem-vindo ao atendimento da IPB.</p>
              <p className="text-xs mt-1">Pergunte sobre doutrina, estrutura, história ou prática reformada.</p>
            </div>
          )}

          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && (
              <div className="w-7 h-7 rounded-full overflow-hidden mr-2">
                <Image src="/logo-ipb.png" alt="IPB" width={28} height={28} className="object-cover" />
              </div>
            )}

              <div
                className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
                  message.role === "user"
                    ? "bg-[#00573f] text-white rounded-br-none"
                    : "bg-[#f2f2ee] text-[#1f2d1f] rounded-bl-none"
                }`}>

                <ReactMarkdown
                  components={{
                    p: ({ node, ...props }) => (
                      <p
                        {...props}
                        className="prose prose-sm max-w-full dark:prose-invert [&>p]:m-0"
                      />
                    ),
                    a: ({ node, ...props }) => (
                      <a
                        {...props}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-700 hover:underline break-all"
                      />
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>

              </div>

              {message.role === "user" && (
                <div className="w-7 h-7 rounded-full bg-green-900 flex items-center justify-center text-white ml-2">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

            {isLoading && (
              <div className="flex items-center">
                <div className="w-7 h-7 rounded-full overflow-hidden mr-2">
                  <Image
                    src="/logo-ipb.png"
                    alt="IPB"
                    width={28}
                    height={28}
                    className="object-cover"
                  />
                </div>
                <div className="flex space-x-1 items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-900 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-900 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-900 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            )}

        </div>


        <div className="border-t border-gray-200 bg-gray-50 p-3">
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <input
              type="text"
              className="flex-1 px-4 py-2 rounded-full text-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-600 transtion duration-150"
              placeholder="Digite sua pergunta..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <Button type="submit"
              size="icon"
              className="rounded-full bg-[#00573f] hover:bg-green-900 text-white h-9 w-9"
              disabled={isLoading || !input.trim()}>
              <Send className="h-3 w-3" />
            </Button>

          </form>
        </div>
      </div>
    </div>
  )
}
