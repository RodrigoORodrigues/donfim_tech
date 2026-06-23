import express from "express";
import { createServer as createViteServer } from "vite";
import * as path from "path";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  const fallbackBot = (userMessage: string) => {
    const text = userMessage.toLowerCase();
    
    if (text.includes("financeiro") || text.includes("finança") || text.includes("finance") || text.includes("caixa") || text.includes("nota fiscal")) {
      return "Para a área financeira, temos módulos no Don Gestão e o Don Finance, que oferecem:\n\n=> Controle de Fluxo de Caixa e DRE\n=> Contas a Pagar e Receber\n=> Emissão de Notas Fiscais Integrada\n=> Conciliação Bancária e Relatórios Automáticos\n\nQuer entender como podemos organizar e automatizar seu setor financeiro?\n\n🔗 [WhatsApp](https://wa.me/5521991389523)\n✉️ [E-mail](mailto:donfim@gmail.com)";
    }

    if (text.includes("marketing") || text.includes("venda") || text.includes("analytics") || text.includes("tráfego") || text.includes("trafego") || text.includes("lead")) {
      return "Na área de Marketing e Vendas, as nossas soluções (como Don CRM e Don Analytics) trazem rastreabilidade e muita escala:\n\n=> Dashboards de Performance em Tempo Real\n=> Gestão de Leads e Funil de Vendas (CRM)\n=> Automação de E-mails e Campanhas\n=> Otimização de SEO e Presença Digital\n\nVamos multiplicar os seus resultados?\n\n🔗 [WhatsApp](https://wa.me/5521991389523)\n✉️ [E-mail](mailto:donfim@gmail.com)";
    }

    if (text.includes("sistema") || text.includes("gestão") || text.includes("erp") || text.includes("crm")) {
      return "Temos várias plataformas prontas e customizáveis, atendendo todas as áreas da sua empresa:\n\n=> Don Gestão (ERP Completo para negócios)\n=> Don CRM (Para equipes de Vendas)\n=> Don Finance (Controle Financeiro)\n=> Don Delivery & Clínicas (Sistemas de Nicho)\n=> Don Marketing & Analytics\n\nE criamos Sistemas Personalizados sob medida! Qual solução você gostaria de explorar?\n\nPara informações detalhadas ou orçamentos, fale direto conosco:\n🔗 [WhatsApp](https://wa.me/5521991389523)\n✉️ [E-mail](mailto:donfim@gmail.com)";
    }
    
    if (text.includes("serviço") || text.includes("funcionalidade") || text.includes("fazem") || text.includes("site") || text.includes("app") || text.includes("aplicativo")) {
      return "Nossos principais serviços incluem:\n- Desenvolvimento de Sistemas Web e Apps sob medida\n- Automações para processos empresariais (n8n, Make)\n- Criação de Websites rápidos de alta conversão\n- Soluções completas para Financeiro, Vendas e Gestão\n\nPrecisa de algo feito sob medida para sua empresa?\n\n🔗 [WhatsApp](https://wa.me/5521991389523)\n✉️ [E-mail](mailto:donfim@gmail.com)";
    }
    
    if (text.includes("contato") || text.includes("falar") || text.includes("orçamento") || text.includes("whatsapp") || text.includes("email") || text.includes("e-mail")) {
      return "Você pode entrar em contato conosco a qualquer momento! Estamos prontos para escalar os resultados da sua empresa.\n\n🔗 [Falar no WhatsApp](https://wa.me/5521991389523)\n✉️ [E-mail](mailto:donfim@gmail.com)";
    }
    
    return "Olá! Sou o Don, o assistente virtual exclusivo da Donfim Tech. 🚀\n\nEstou aqui para apresentar nossas soluções. Posso te ajudar a conhecer nossos serviços de automação, web e aplicativos, ou nossas plataformas focadas em Vendas, Financeiro e Gestão Geral (como Don Gestão, Don CRM e Don Delivery).\n\nPara informações completas, fale com nossos especialistas:\n🔗 [WhatsApp](https://wa.me/5521991389523)\n✉️ [E-mail](mailto:donfim@gmail.com)";
  };

  app.post("/api/chat", async (req, res) => {
    try {
      const { text, history } = req.body;
      const key = process.env.GEMINI_API_KEY;
      
      // If we don't have a valid API key, just use the local predefined fallback directly
      if (!key || key === "INVALID" || key === "") {
        return res.json({ text: fallbackBot(text) });
      }
      
      const ai = new GoogleGenAI({ apiKey: key });
      
      // format history for the model
      // Note: we can either use chat sessions or just send requests.
      // Easiest is to send the whole formatted conversation.
      
      const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: "Seu nome é Don. Você é a inteligência artificial assistente da Donfim Tech, uma empresa de tecnologia. Seja educado, prestativo, profissional e conciso. Responda em português do Brasil. IMPORTANTE: Você DEVE responder APENAS a perguntas relacionadas à Donfim Tech, sistemas de gestão, desenvolvimento web, aplicativos e demais serviços e produtos que a empresa oferece. Se o usuário fizer uma pergunta fora desse contexto (como receitas, política, programação não relacionada ao projeto, etc.), você DEVE educadamente dizer que só pode falar sobre os serviços da Donfim Tech e apresentar brevemente o que a empresa faz (Sistemas Web, Sites, Aplicativos). Quando fornecer o link do WhatsApp, SEMPRE use este formato exato: [Clique aqui para falar no WhatsApp](https://wa.me/5521991389523) - Nunca passe apenas o link cru. Quando oferecer opções de escolha, liste cada opção em uma nova linha começando com '=> ' (ex: '=> Mais detalhes sobre sistemas').",
        }
      });
      
      // We can restore history if we want, but since we are doing stateless calls:
      const fullHistory = history ? history.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      })) : [];
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [...fullHistory, { role: 'user', parts: [{ text }]}],
        config: {
          systemInstruction: "Seu nome é Don. Você é a inteligência artificial assistente da Donfim Tech, uma empresa de tecnologia. Seja educado, prestativo, profissional e conciso. Responda em português do Brasil. IMPORTANTE: Você DEVE responder APENAS a perguntas relacionadas à Donfim Tech, sistemas de gestão, desenvolvimento web, aplicativos e demais serviços e produtos que a empresa oferece. Se o usuário fizer uma pergunta fora desse contexto (como receitas, política, programação não relacionada ao projeto, etc.), você DEVE educadamente dizer que só pode falar sobre os serviços da Donfim Tech e apresentar brevemente o que a empresa faz (Sistemas Web, Sites, Aplicativos). Quando fornecer o link do WhatsApp, SEMPRE use este formato exato: [Clique aqui para falar no WhatsApp](https://wa.me/5521991389523) - Nunca passe apenas o link cru. Quando oferecer opções de escolha, liste cada opção em uma nova linha começando com '=> ' (ex: '=> Mais detalhes sobre sistemas').",
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Chat API Error:", error);
      const isApiKeyError = error?.message?.includes('API key not valid') || error?.status === 400;

      if (isApiKeyError) {
        // Fallback for invalid API key to ensure the chatbot still functions
        res.json({ text: fallbackBot(req.body.text || "") });
      } else {
        res.status(500).json({ error: error.message || "Failed to process chat" });
      }
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");

    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
