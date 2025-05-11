
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X, ArrowUp, Sparkles, Loader2, ChevronDown, SendHorizontal, Paperclip, Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { suggestedQuestions } from '@/data/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{text: string; isUser: boolean; timestamp: Date}[]>([
    { text: "Olá! Como posso te ajudar com suas finanças hoje?", isUser: false, timestamp: new Date() }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  
  const toggleChat = () => setIsOpen(!isOpen);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    
    // Adiciona mensagem do usuário
    const userMessage = { text, isUser: true, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    // Simula resposta do assistente (em produção, seria integração com LLM)
    setTimeout(() => {
      let response = "";
      
      if (text.toLowerCase().includes("gast")) {
        response = "Analisando seus gastos recentes, percebo que você tem mantido um controle adequado. No entanto, seus gastos com alimentação aumentaram 15% em relação ao mês anterior. Gostaria de ver um detalhamento desta categoria?";
      } else if (text.toLowerCase().includes("economi") || text.toLowerCase().includes("poupar")) {
        response = "Baseado nos seus hábitos financeiros, você poderia economizar cerca de R$350 mensais reduzindo gastos com serviços de streaming não utilizados e otimizando suas compras de mercado. Quer que eu sugira um plano detalhado?";
      } else if (text.toLowerCase().includes("invest")) {
        response = "Para seu perfil, recomendo uma carteira diversificada com 60% em renda fixa e 40% em fundos de baixo risco. Considerando suas metas, isso poderia gerar aproximadamente 12% ao ano. Gostaria de simular algumas opções?";
      } else {
        response = `Obrigado pela sua pergunta sobre "${text}". Estou analisando seus dados financeiros para te ajudar com isso. Posso sugerir algumas estratégias baseadas no seu histórico recente.`;
      }
      
      setMessages(prev => [
        ...prev, 
        { text: response, isUser: false, timestamp: new Date() }
      ]);
      setIsTyping(false);
    }, 1500);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };
  
  const handleQuestionClick = (question: string) => {
    sendMessage(question);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-24 right-6 w-80 ${expanded ? 'sm:w-[30rem] h-[70vh]' : 'sm:w-96'} bg-white rounded-2xl shadow-xl border border-muted overflow-hidden z-50 dark:bg-finance-text/80 dark:backdrop-blur-md dark:border-white/10`}
          >
            <div className="bg-gradient-to-r from-finance-primary to-finance-accent p-4 text-white flex justify-between items-center">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2 border border-white/30">
                  <AvatarImage src="/placeholder.svg" alt="FinanceSense" />
                  <AvatarFallback className="bg-finance-accent text-white text-xs">FS</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <h3 className="font-semibold leading-none">Assistente FinanceSense</h3>
                  <p className="text-xs text-white/70">Seu conselheiro financeiro pessoal</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setExpanded(!expanded)}
                  className="h-7 w-7 rounded-full hover:bg-white/20 text-white"
                >
                  <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleChat}
                  className="h-7 w-7 rounded-full hover:bg-white/20 text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className={`overflow-y-auto p-4 space-y-4 ${expanded ? 'h-[calc(70vh-7.5rem)]' : 'max-h-80'}`}>
              {messages.map((message, index) => (
                <div 
                  key={index}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} group`}
                >
                  {!message.isUser && (
                    <Avatar className="h-8 w-8 mr-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <AvatarFallback className="bg-finance-primary/20 text-finance-primary text-xs">FS</AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div 
                    className={`max-w-[80%] p-3 ${message.isUser 
                      ? 'bg-finance-primary text-white rounded-t-2xl rounded-bl-2xl rounded-br-sm' 
                      : 'bg-muted/50 dark:bg-white/10 rounded-t-2xl rounded-br-2xl rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <div className={`text-[10px] mt-1 ${message.isUser ? 'text-white/70 text-right' : 'text-muted-foreground'}`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                  
                  {message.isUser && (
                    <Avatar className="h-8 w-8 ml-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <AvatarImage src="/placeholder.svg" alt="Você" />
                      <AvatarFallback className="bg-finance-accent/20 text-finance-accent text-xs">EU</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted/50 dark:bg-white/10 p-3 rounded-xl rounded-bl-sm max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-finance-primary animate-pulse" />
                      <div className="w-2 h-2 rounded-full bg-finance-primary animate-pulse delay-100" />
                      <div className="w-2 h-2 rounded-full bg-finance-primary animate-pulse delay-200" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {messages.length === 1 && !isTyping && (
              <div className="px-4 pb-3">
                <p className="text-xs text-muted-foreground mb-2">Perguntas sugeridas:</p>
                <div className="space-y-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button 
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuestionClick(question)}
                      className="w-full justify-start text-left text-xs h-auto py-2 bg-muted/30 border-none hover:bg-finance-light dark:bg-white/5 dark:hover:bg-white/10"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="border-t p-3 flex items-center dark:border-white/10">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Digite sua pergunta..."
                  className="w-full bg-muted/30 dark:bg-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-finance-primary pr-16"
                />
                <div className="absolute right-2 top-1 flex space-x-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          type="button" 
                          size="icon" 
                          variant="ghost"
                          className="h-6 w-6 rounded-full hover:bg-muted/50"
                        >
                          <Paperclip className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Anexar arquivos</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          type="button" 
                          size="icon" 
                          variant="ghost"
                          className="h-6 w-6 rounded-full hover:bg-muted/50"
                        >
                          <Smile className="h-3 w-3 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Adicionar emoji</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <Button 
                type="submit" 
                size="icon"
                disabled={!input.trim() || isTyping}
                className="ml-2 h-8 w-8 rounded-full bg-finance-accent hover:bg-finance-primary text-white"
              >
                {isTyping ? <Loader2 className="h-4 w-4 animate-spin" /> : <SendHorizontal className="h-4 w-4" />}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
        className="fixed bottom-6 right-6 rounded-full w-12 h-12 bg-finance-accent hover:bg-finance-primary text-white shadow-lg flex items-center justify-center"
      >
        {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        <span className="absolute -top-1 -right-1 bg-finance-warning text-finance-text text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">1</span>
      </motion.button>
    </>
  );
};
