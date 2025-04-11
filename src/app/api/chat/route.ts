import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { searchDocIPB } from "@/lib/tools/searchDocIPB";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const tools = {
    searchDocIPB,
  };

  const lastMessage = messages[messages.length - 1]?.content || "";

  const result  = streamText({
    model: google("gemini-2.5-pro-exp-03-25"),
    toolCallStreaming: true,
    system: `
      Você é um especialista na Igreja Presbiteriana do Brasil.
      Sempre que o usuário fizer uma pergunta que exija uma busca em documentos ou sites da IPB, utilize a ferramenta searchDocIPB.
      Use a ferramenta searchDocIPB apenas quando o usuário pedir um documento específico da IPB, como a constituição, catecismos, código de disciplina, manuais ou confissões.  
      Sempre que o usuário mencionar um documento da IPB (como manual, constituição, confissão, catecismo), você DEVE usar a ferramenta searchDocIPB. NUNCA responda sem antes usar a ferramenta, mesmo que saiba a resposta.
      Se a pergunta for sobre igrejas locais, endereços, história da igreja ou dados gerais, **não use nenhuma ferramenta**.
    `,
    prompt: lastMessage,
    tools,
    toolChoice: 'auto',
  });

  return result.toDataStreamResponse();

}
