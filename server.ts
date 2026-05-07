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

  app.post("/api/chat", async (req, res) => {
    try {
      const { text, history } = req.body;
      const key = process.env.GEMINI_API_KEY;
      
      if (!key) {
        throw new Error("GEMINI_API_KEY environment variable is required");
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
        res.json({ text: "Olá! Notei que a chave da API configurada não é válida. Como assistente da Donfim Tech, posso te ajudar com dúvidas gerais sobre nossos sistemas web, aplicativos e sites. Se preferir, => Clique aqui para falar no WhatsApp" });
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
