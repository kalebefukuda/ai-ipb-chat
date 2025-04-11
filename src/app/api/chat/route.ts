import { google } from "@ai-sdk/google"
import { generateText} from "ai"
import { searchDocIPB } from "@/lib/tools/searchDocIPB";

export async function POST(req: Request) {
  const { messages } = await req.json()
  const tools = {
    searchDocIPB,
  };

  const lastMessage = messages[messages.length - 1]?.content || ""

  const result = await generateText({
    model: google("gemini-2.5-pro-exp-03-25"),
    system: `
            Você é um especialista na Igreja Presbiteriana do Brasil.
            Sempre que o usuário fizer uma pergunta que exija uma busca em documentos ou sites da IPB, utilize a ferramenta searchDocIPB.
            Use a ferramenta searchDocIPB apenas quando o usuário pedir um documento específico da IPB, como a constituição, catecismos, código de disciplina, manuais ou confissões.  
            Se a pergunta for sobre igrejas locais, endereços, história da igreja ou dados gerais, **não use nenhuma ferramenta**.
            `,
    prompt: lastMessage,
    tools,
    toolChoice: 'auto',
  })

  return Response.json({
    role: "assistant",
    content: result.toolResults?.[0]?.result?.resultado || result.text,
  });
}
