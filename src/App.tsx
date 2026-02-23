import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Bot, MessageSquare, Info, ExternalLink, ShieldCheck } from "lucide-react";

interface HealthStatus {
  status: string;
  botActive: boolean;
  voiApiUrl: string;
}

export default function App() {
  const [status, setStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        setStatus(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f2ed] text-[#1a1a1a] font-sans selection:bg-emerald-100">
      <header className="border-b border-black/10 bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
              <Bot size={20} />
            </div>
            <span className="font-semibold tracking-tight">VOI Helper</span>
          </div>
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="w-3 h-3 bg-gray-300 rounded-full animate-pulse" />
            ) : (
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
                <div className={`w-2 h-2 rounded-full ${status?.botActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`} />
                {status?.botActive ? 'Bot Online' : 'Bot Offline'}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Hero Section */}
          <div className="md:col-span-2 space-y-8">
            <section>
              <h1 className="text-5xl font-serif font-light leading-tight mb-6">
                Интеллектуальный помощник <br />
                <span className="italic text-emerald-700">для сообщества ВОИ</span>
              </h1>
              <p className="text-lg text-black/60 max-w-xl leading-relaxed">
                Этот бот помогает пользователям получать актуальную информацию об оформлении инвалидности, 
                технических средствах реабилитации (ТСР) и других мерах социальной поддержки.
              </p>
            </section>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 bg-white rounded-2xl border border-black/5 shadow-sm hover:shadow-md transition-shadow">
                <MessageSquare className="text-emerald-600 mb-4" size={24} />
                <h3 className="font-semibold mb-2">Telegram Интерфейс</h3>
                <p className="text-sm text-black/50">Прямое общение с AI-агентом через привычный мессенджер.</p>
              </div>
              <div className="p-6 bg-white rounded-2xl border border-black/5 shadow-sm hover:shadow-md transition-shadow">
                <ShieldCheck className="text-emerald-600 mb-4" size={24} />
                <h3 className="font-semibold mb-2">Надежные данные</h3>
                <p className="text-sm text-black/50">Использует официальную базу знаний и документацию ВОИ.</p>
              </div>
            </div>
          </div>

          {/* Sidebar / Configuration */}
          <div className="space-y-6">
            <div className="p-6 bg-white rounded-2xl border border-black/5 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-emerald-700">
                <Info size={18} />
                <h3 className="text-sm font-semibold uppercase tracking-wider">Статус системы</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-black/40 font-bold block mb-1">API Endpoint</label>
                  <div className="font-mono text-xs bg-black/5 p-2 rounded border border-black/5 break-all">
                    {status?.voiApiUrl || 'Not Configured'}
                  </div>
                </div>
                
                {!status?.botActive && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs leading-relaxed">
                    <strong>Внимание:</strong> Бот не запущен. Пожалуйста, убедитесь, что <code>TELEGRAM_BOT_TOKEN</code> установлен в настройках Secrets.
                  </div>
                )}

                <a 
                  href="https://t.me/BotFather" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full p-3 bg-black text-white rounded-xl text-sm font-medium hover:bg-black/80 transition-colors"
                >
                  Настроить BotFather
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>

            <div className="p-6 bg-emerald-900 text-white rounded-2xl shadow-xl overflow-hidden relative">
              <div className="relative z-10">
                <h3 className="font-serif italic text-xl mb-2">Как начать?</h3>
                <ol className="text-sm text-white/70 space-y-3 list-decimal list-inside">
                  <li>Создайте бота в @BotFather</li>
                  <li>Добавьте токен в Secrets</li>
                  <li>Укажите URL вашего API</li>
                  <li>Напишите боту /start</li>
                </ol>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <Bot size={120} />
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="max-w-5xl mx-auto px-6 py-12 border-top border-black/5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-black/40 text-sm">
          <p>© 2026 VOI Helper Project. Все права защищены.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-black transition-colors">Документация</a>
            <a href="#" className="hover:text-black transition-colors">Поддержка</a>
            <a href="#" className="hover:text-black transition-colors">API</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
