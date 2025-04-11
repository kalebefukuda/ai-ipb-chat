"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
  const [isMobile, setIsMobile] = useState(false)

  // Detectar se é dispositivo móvel
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Verificar no carregamento inicial
    checkIfMobile()

    // Adicionar listener para redimensionamento
    window.addEventListener("resize", checkIfMobile)

    // Limpar listener
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

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
    <div
      className={`flex flex-col items-center justify-center min-h-screen ${isMobile ? "bg-white" : "bg-[#022018] gap-3 p-4"}`}
    >
      {!isMobile && <h1 className="text-white">Em teste...</h1>}

      <div
        className={`flex flex-col ${isMobile ? "w-full h-screen" : "w-full max-w-md h-[700px] rounded-lg overflow-hidden shadow-xl border border-green-900"} bg-white`}
      >
        <div className="bg-[#00573f] text-white py-2 px-3 flex items-center gap-2 md:py-3 md:px-4 md:gap-3">
          <Image
            src="/logo-ipb.png"
            alt="Logo"
            width={isMobile ? 32 : 40}
            height={isMobile ? 32 : 40}
            className="rounded-full"
          />
          <h1 className="font-semibold text-sm md:text-base">Igreja Presbiteriana do Brasil</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3 md:p-4 md:space-y-4 bg-white">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-16 md:mt-20">
              <p className="text-sm">Bem-vindo ao atendimento da IPB.</p>
              <p className="text-xs mt-1">Pergunte sobre doutrina, estrutura, história ou prática reformada.</p>
            </div>
          )}

          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && (
                <div className="w-6 h-6 md:w-7 md:h-7 rounded-full overflow-hidden mr-2 flex-shrink-0">
                  <Image src="/logo-ipb.png" alt="IPB" width={28} height={28} className="object-cover" />
                </div>
              )}

              <div
                className={`max-w-[80%] px-3 py-2 rounded-lg text-xs md:text-sm ${
                  message.role === "user"
                    ? "bg-[#00573f] text-white rounded-br-none"
                    : "bg-[#f2f2ee] text-[#1f2d1f] rounded-bl-none"
                }`}
              >
                <div className={message.role === "user" ? "text-white" : "text-[#1f2d1f]"}>
                  <ReactMarkdown
                    components={{
                      p: (props) => <p {...props} className="[&>p]:m-0" />,
                      a: (props) => (
                        <a
                          {...props}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`break-all underline-offset-2 ${
                            message.role === "user" ? "text-white underline" : "text-green-700 hover:underline"
                          }`}
                        />
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>

              {message.role === "user" && (
                <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-green-900 flex items-center justify-center text-white ml-2 flex-shrink-0">
                  <User className="h-3 w-3 md:h-4 md:w-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center">
              <div className="w-6 h-6 md:w-7 md:h-7 rounded-full overflow-hidden mr-2 flex-shrink-0">
                <Image src="/logo-ipb.png" alt="IPB" width={28} height={28} className="object-cover" />
              </div>
              <div className="flex space-x-1 items-center">
                <div
                  className="w-1.5 h-1.5 rounded-full bg-green-900 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="w-1.5 h-1.5 rounded-full bg-green-900 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="w-1.5 h-1.5 rounded-full bg-green-900 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 bg-gray-50 p-2 md:p-3">
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <input
              type="text"
              className="flex-1 px-3 py-2 md:px-4 rounded-full text-xs md:text-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-600 transition duration-150"
              placeholder="Digite sua pergunta..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <Button
              type="submit"
              size="icon"
              className="rounded-full bg-[#00573f] hover:bg-green-900 text-white h-8 w-8 md:h-9 md:w-9 flex items-center justify-center"
              disabled={isLoading || !input.trim()}
            >
              <Send className="h-3 w-3" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
