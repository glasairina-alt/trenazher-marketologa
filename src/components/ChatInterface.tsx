import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Paperclip, MessageCircle, Bot, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  type: "user" | "bot" | "system";
  text: string;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: 1,
    type: "bot",
    text: "Привет! Как я могу помочь вам сегодня?",
    timestamp: new Date(),
  },
];

export const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      type: "user",
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Симуляция ответа бота
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      const botMessage: Message = {
        id: Date.now() + 1,
        type: "bot",
        text: botResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes("тренд") || lowerInput.includes("маркетинг")) {
      return "В этом месяце популярны следующие направления: персонализация контента, видеомаркетинг и активное взаимодействие через социальные сети. Какая тема вас интересует больше всего?";
    }
    
    if (lowerInput.includes("реклам") || lowerInput.includes("кампани")) {
      return "Для создания эффективной рекламной кампании рекомендую перейти в раздел 'Рекламный кабинет'. Там вы сможете попрактиковаться в настройке таргетинга и создании объявлений для VK.";
    }
    
    if (lowerInput.includes("метрик") || lowerInput.includes("аналитик")) {
      return "Основные метрики для оценки эффективности рекламы: CTR (кликабельность), CPC (стоимость клика), CPM (стоимость 1000 показов), CR (конверсия), CPL (стоимость лида) и ROMI (возврат инвестиций в маркетинг).";
    }
    
    return "Спасибо за ваш вопрос! Я помогу вам разобраться в маркетинге. Можете задать более конкретный вопрос о трендах, рекламных кампаниях или метриках эффективности.";
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="mx-auto max-w-4xl">
      <div className="border-b border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground">Чат с AI-наставником</h2>
        </div>
      </div>

      <ScrollArea className="h-[500px] p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 items-start",
                message.type === "user" && "flex-row-reverse"
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white font-bold",
                  message.type === "user" && "bg-chat-user",
                  message.type === "bot" && "bg-chat-bot",
                  message.type === "system" && "bg-chat-system"
                )}
              >
                {message.type === "user" ? (
                  "А"
                ) : message.type === "bot" ? (
                  <Bot className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
              </div>

              <div
                className={cn(
                  "rounded-lg px-4 py-2 max-w-[80%]",
                  message.type === "user" &&
                    "bg-chat-user text-white rounded-br-sm",
                  message.type === "bot" &&
                    "bg-secondary text-secondary-foreground rounded-bl-sm",
                  message.type === "system" &&
                    "bg-chat-system/10 text-foreground border border-chat-system/20"
                )}
              >
                <p className="text-sm leading-relaxed">{message.text}</p>
                <p className="mt-1 text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString("ru-RU", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 items-start">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-chat-bot text-white">
                <Bot className="h-5 w-5" />
              </div>
              <div className="rounded-lg bg-secondary px-4 py-2 rounded-bl-sm">
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce" />
                  <div className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:0.15s]" />
                  <div className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:0.3s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="border-t border-border bg-card p-4">
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                // Handle file upload
                console.log("File selected:", e.target.files[0]);
              }
            }}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handleFileClick}
            className="shrink-0"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Введите сообщение..."
            className="flex-1"
          />
          <Button onClick={handleSend} className="shrink-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
