import express from "express";
import { createServer as createViteServer } from "vite";
import { Telegraf } from "telegraf";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// --- Telegram Bot Setup ---
const botToken = process.env.TELEGRAM_BOT_TOKEN;
const voiApiUrl = process.env.VOI_API_URL || "http://localhost:8088";

if (!botToken) {
  console.warn("TELEGRAM_BOT_TOKEN is not set. Bot will not start.");
}

const bot = botToken ? new Telegraf(botToken) : null;

if (bot) {
  bot.start((ctx) => {
    ctx.reply("Привет! Я помощник ВОИ. Задайте мне вопрос об оформлении инвалидности, ТСР или других мерах поддержки.");
  });

  bot.on("text", async (ctx) => {
    const query = ctx.message.text;
    const chatId = String(ctx.chat.id);
    const userId = String(ctx.from.id);
    const rquId = uuidv4();

    try {
      // Show typing status
      await ctx.sendChatAction("typing");

      const response = await axios.post(`${voiApiUrl}/api/v1/kksb-report`, {
        rquId,
        chatId,
        query,
        userId,
        toolName: "voi_docs",
        userRole: "USER",
        userSurface: "TELEGRAM",
        context: []
      }, {
        headers: {
          "Content-Type": "application/json",
          "x-trace-id": rquId
        }
      });

      const data = response.data;

      if (data.success && data.message && data.message.length > 0) {
        const answer = data.message[0].answer;
        await ctx.reply(answer);
      } else {
        await ctx.reply("К сожалению, я не смог получить ответ. Попробуйте позже.");
      }
    } catch (error: any) {
      console.error("Error calling VOI API:", error.message);
      await ctx.reply("Произошла ошибка при обращении к сервису. Пожалуйста, попробуйте позже.");
    }
  });

  bot.launch().then(() => {
    console.log("Telegram bot launched successfully");
  }).catch((err) => {
    console.error("Failed to launch Telegram bot:", err);
  });
}

// --- Express Server Setup ---
async function startServer() {
  app.use(express.json());

  // API Health check
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      botActive: !!bot,
      voiApiUrl 
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

// Enable graceful stop
process.once("SIGINT", () => bot?.stop("SIGINT"));
process.once("SIGTERM", () => bot?.stop("SIGTERM"));
