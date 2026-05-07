import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, User, Bot, Loader2 } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const SUGGESTIONS = [
  "Quais serviços vocês oferecem?",
  "Preciso de um sistema para minha empresa",
  "Como funciona o desenvolvimento?",
  "Como faço para entrar em contato?"
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: 'Olá! Sou o Don, a inteligência artificial da Donfim Tech. Como posso ajudar você hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendText = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const newMessages = [...messages, { role: 'user' as const, text: textToSend }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Pass the conversation history (excluding the new user message)
      const historyForApi = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSend, history: historyForApi })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const currentResponse = data.text || 'Desculpe, não consegui processar sua mensagem.';
      
      setMessages(prev => [...prev, { role: 'model', text: currentResponse }]);
    } catch (error) {
      console.error('Error chatting with Don:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Houve um erro de comunicação. Por favor, tente novamente.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    const userText = input.trim();
    if (!userText) return;
    setInput('');
    handleSendText(userText);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 left-8 z-50 p-4 bg-cyan-500 hover:bg-cyan-400 text-slate-900 rounded-full shadow-[0_0_15px_rgba(0,212,255,0.5)] transition-all hover:scale-110 flex items-center justify-center cursor-pointer"
        aria-label="Abrir chat com Don"
      >
        <MessageSquare size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 left-4 md:left-8 z-50 w-[90vw] md:w-[400px] h-[500px] max-h-[80vh] bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl flex flex-col overflow-hidden shadow-cyan-500/20"
          >
            {/* Header */}
            <div className="bg-slate-800 p-4 flex justify-between items-center border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center text-slate-900 font-bold">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white">Don</h3>
                  <p className="text-xs text-cyan-400">Assistente Virtual</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-700 text-white' : 'bg-cyan-500/20 text-cyan-400'}`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div 
                    className={`p-3 rounded-2xl ${
                      msg.role === 'user' 
                        ? 'bg-slate-700 text-white rounded-tr-sm' 
                        : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm'
                    }`}
                  >
                    {msg.role === 'model' && msg.text.includes('=>') ? (
                      <div className="flex flex-col gap-2">
                        {msg.text.split('\n').filter(line => !line.trim().startsWith('=>')).join('\n').trim() && (
                          <div className="markdown-body text-sm">
                            <Markdown 
                              remarkPlugins={[remarkGfm]}
                              components={{
                                a: ({node, ...props}) => <a target="_blank" rel="noopener noreferrer" {...props} />
                              }}
                            >
                              {msg.text.split('\n').filter(line => !line.trim().startsWith('=>')).join('\n').trim()}
                            </Markdown>
                          </div>
                        )}
                        <div className="flex flex-col gap-2 mt-1">
                          {msg.text.split('\n').filter(line => line.trim().startsWith('=>')).map((line, i) => {
                            const optionText = line.trim().substring(2).trim().replace(/^[-*0-9.)]+\s*/, '');
                            return (
                              <button
                                key={i}
                                onClick={() => handleSendText(optionText)}
                                disabled={isLoading}
                                className="text-left text-sm bg-slate-700/50 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg px-3 py-2 transition-colors cursor-pointer"
                              >
                                {optionText}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="markdown-body text-sm">
                        <Markdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            a: ({node, ...props}) => <a target="_blank" rel="noopener noreferrer" {...props} />
                          }}
                        >
                          {msg.text}
                        </Markdown>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 max-w-[85%] self-start">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <Bot size={16} />
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 rounded-tl-sm flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-cyan-400" />
                    <span className="text-sm text-slate-400">Digitando...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-slate-800 border-t border-slate-700">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Pergunte algo ao Don..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-full py-3 pl-4 pr-12 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-cyan-400 hover:text-cyan-300 disabled:text-slate-600 transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
              
              {/* Quick Suggestions */}
              {messages.length === 1 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {SUGGESTIONS.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendText(suggestion)}
                      disabled={isLoading}
                      className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 border border-slate-600 rounded-full px-3 py-1.5 transition-colors disabled:opacity-50 whitespace-nowrap"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
