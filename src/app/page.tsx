"use client"

import { useChat } from '@ai-sdk/react';
import { Send, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import ReactMarkdown from "react-markdown"
import Image from "next/image"

type Message = {
  role: "user" | "assistant"
  content: string
}

export default function Chat() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status
  } = useChat({ api: '/api/chat' });

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-[#022018] gap-3">
      <div className="flex flex-col w-full max-w-md h-full bg-white border border-green-900 md:rounded-lg shadow-xl">

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

          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full overflow-hidden mr-2">
                  <Image src="/logo-ipb.png" alt="IPB" width={28} height={28} className="object-cover" />
                </div>
              )}

              <div
                className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
                  message.role === 'user'
                    ? 'bg-[#00573f] text-white rounded-br-none'
                    : 'bg-[#f2f2ee] text-[#1f2d1f] rounded-bl-none'
                }`}
              >
                {message.parts.map((part: any, i: number) => {
                    if (part.type === 'text') {
                      return <ReactMarkdown key={i}>{part.text}</ReactMarkdown>;
                    }

                    if (part.type === 'tool-invocation') {
                      const result = part.toolInvocation?.result;
                      const content =
                        typeof result === 'string'
                          ? result
                          : result?.resultado ?? '[Sem retorno da ferramenta]';

                      return <ReactMarkdown key={i}>{content}</ReactMarkdown>;
                    }

                    return null;
                  })}
              </div>

              {message.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-green-900 flex items-center justify-center text-white ml-2">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {(status === 'submitted' || status === 'streaming') && (
            <div className="flex items-center">
              <Image src="/logo-ipb.png" alt="IPB" width={28} height={28} className="rounded-full mr-2" />
              <div className="flex space-x-1 items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-green-900 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-green-900 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-green-900 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 bg-gray-50 p-3 shrink-0">
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <input
              type="text"
              className="flex-1 px-4 py-2 rounded-full text-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-600"
              placeholder="Digite sua pergunta..."
              value={input}
              onChange={handleInputChange}
              disabled={status !== 'ready'}
            />
            <Button
              type="submit"
              size="icon"
              className="rounded-full bg-[#00573f] hover:bg-green-900 text-white h-9 w-9"
              disabled={status !== 'ready' || !input.trim()}
            >
              <Send className="h-3 w-3" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
