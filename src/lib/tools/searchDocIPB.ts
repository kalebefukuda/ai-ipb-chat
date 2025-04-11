import { z } from "zod";
import { tool } from "ai";

const documentosIPB = [
  {
    nome: "Constituição da IPB",
    link: "https://www.executivaipb.com.br/site/constituicao/constituicao.pdf",
  },
  {
    nome: "Manual Presbiteriano",
    link: "https://www.ipb.org.br/content/Downloads/Manual-Presbiteriano-2019.pdf",
  },
  {
    nome: "Confissão de Fé de Westminster",
    link: "https://www.executivaipb.com.br/arquivos/confissao_de_westminster.pdf",
  },
];

export const searchDocIPB = tool({
  description: "Busca documentos oficiais da Igreja Presbiteriana do Brasil.",
  parameters: z.object({
    termo: z.string().describe("Nome ou parte do nome do documento desejado"),
  }),
  execute: async ({ termo }) => {
    const termoLower = termo.toLowerCase();

    const encontrados = documentosIPB.filter(doc =>
      doc.nome.toLowerCase().includes(termoLower)
    );

    if (encontrados.length === 0) {
      return {
        resultado: `Nenhum documento encontrado com o termo "${termo}".`,
      };
    }

    return {
      resultado: encontrados.map(doc =>
        `**${doc.nome}**\n\n 📄 [Abrir documento](${doc.link})`
      ).join("\n\n"),
    };
  },
});
