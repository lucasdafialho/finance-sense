
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { suggestedQuestions } from '@/data/mockData';

export const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{text: string; isUser: boolean}[]>([
    { text: "Olá! Como posso te ajudar com suas finanças hoje?", isUser: false }
  ]);
  const [input, setInput] = useState("");
  
  const toggleChat = () => setIsOpen(!isOpen);
  
  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    
    // Adiciona mensagem do usuário
    setMessages(prev => [...prev, { text, isUser: true }]);
    setInput("");
    
    // Simula resposta do assistente (em produção, seria integração com LLM)
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { 
          text: `Obrigado pela sua pergunta sobre "${text}". Estou analisando seus dados financeiros para te ajudar com isso.`, 
          isUser: false 
        }
      ]);
    }, 1000);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };
  
  const handleQuestionClick = (question: string) => {
    sendMessage(question);
  };
  
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-muted overflow-hidden z-50"
          >
            <div className="bg-gradient-to-r from-finance-primary to-finance-accent p-4 text-white flex justify-between items-center">
              <h3 className="font-semibold">Assistente FinanceSense</h3>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleChat}
                className="h-8 w-8 rounded-full hover:bg-white/20 text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="max-h-80 overflow-y-auto p-4 space-y-3">
              {messages.map((message, index) => (
                <div 
                  key={index}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      message.isUser 
                        ? 'bg-finance-primary text-white rounded-br-none' 
                        : 'bg-muted rounded-bl-none'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
            
            {messages.length === 1 && (
              <div className="px-4 pb-3">
                <p className="text-xs text-muted-foreground mb-2">Perguntas sugeridas:</p>
                <div className="space-y-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button 
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuestionClick(question)}
                      className="w-full justify-start text-left text-xs h-auto py-2 bg-muted/30 border-none"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="border-t p-3 flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua pergunta..."
                className="flex-1 bg-muted/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-finance-primary"
              />
              <Button 
                type="submit" 
                size="icon"
                disabled={!input.trim()}
                className="ml-2 h-8 w-8 rounded-full bg-finance-accent hover:bg-finance-primary text-white"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
        className="fixed bottom-6 left-6 rounded-full w-12 h-12 bg-finance-accent hover:bg-finance-primary text-white shadow-lg flex items-center justify-center"
      >
        <MessageCircle className="h-5 w-5" />
      </motion.button>
    </>
  );
};
