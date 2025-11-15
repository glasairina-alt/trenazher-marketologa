import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Message, StageType } from "@/types/stages";
import { handleStageLogic } from "@/utils/stageHandlers";
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from "docx";

interface ChatInterfaceProps {
  currentStage: StageType;
  setCurrentStage: (stage: StageType) => void;
  setIsCabinetLocked: (locked: boolean) => void;
  setUploadedCreativeUrl: (url: string) => void;
  adData: { headline: string; text: string };
  isActive: boolean;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onAutoTriggerStage?: () => void;
}

export const ChatInterface = ({
  currentStage,
  setCurrentStage,
  setIsCabinetLocked,
  setUploadedCreativeUrl,
  adData,
  isActive,
  messages,
  setMessages,
  onAutoTriggerStage,
}: ChatInterfaceProps) => {
  const flowerEmojis = ["🌹", "🌷", "🌺"];
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [fileAttachEnabled, setFileAttachEnabled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  // Автоматический триггер после отправки отчета - удален из ChatInterface
  useEffect(() => {
    if (currentStage === "STAGE_8_REPORT_SUBMIT") {
      const triggerReportStage = async () => {
        const hasTriggered = messages.some(m => 
          m.text.includes("Напомните Анне в чате")
        );
        
        if (!hasTriggered) {
          // Автоматический переход к следующему этапу уже происходит в stageHandlers
        }
      };
      
      triggerReportStage();
    }
  }, [currentStage, messages]);

  // Автоматический триггер при переходе на стадию после запуска рекламы
  useEffect(() => {
    if (currentStage === "STAGE_3_LAUNCH_WAIT_USER" && isActive) {
      const hasTriggered = messages.some(m => 
        m.text.includes("Реклама запущена!")
      );
      
      if (!hasTriggered) {
        // Небольшая задержка для переключения вкладки
        setTimeout(() => {
          handleStageLogic({
            currentStage,
            userInput: "",
            setCurrentStage,
            addMessage,
            setFileAttachEnabled,
            setIsCabinetLocked,
            showTyping,
            hideTyping,
            sleep,
          });
        }, 100);
      }
    }
  }, [currentStage, isActive]);

  const addMessage = (text: string, type: Message["type"], imageUrl?: string) => {
    const newMessage: Message = {
      id: Date.now() + Math.random(),
      type,
      text,
      imageUrl,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const showTyping = async () => {
    setIsTyping(true);
  };

  const hideTyping = async () => {
    setIsTyping(false);
  };

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userInput = inputValue.trim();
    addMessage(userInput, "user");
    setInputValue("");

    // Команда /start
    if (userInput.toLowerCase() === "/start") {
      addMessage(
        "**Кейс:** Клиент 'Анна' (магазин цветов) присылает вам сообщение 12 февраля.",
        "system"
      );
      await sleep(1000);
      addMessage(
        "Здравствуйте! Мне посоветовали вас. У нас скоро 14 февраля, надо срочно запустить рекламу — праздник же! 💐 Бюджет… ну, тысяч 15 максимум. Жду от вас креативы и запуск завтра! Ах да — сайта нет, только социальная сеть ВК, но я ей давно не занималась.",
        "bot"
      );
      await sleep(500);
      addMessage("**Задача:** Ответьте клиенту.", "system-alert");
      setCurrentStage("STAGE_1_INITIAL_REPLY");
      setIsCabinetLocked(true);
      setUploadedCreativeUrl("");
      return;
    }

    // Обработка остальных этапов
    await handleStageLogic({
      currentStage,
      userInput,
      setCurrentStage,
      addMessage,
      setFileAttachEnabled,
      setIsCabinetLocked,
      showTyping,
      hideTyping,
      sleep,
    });
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      addMessage("Пожалуйста, загрузите изображение", "system-alert");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageUrl = e.target.result as string;
      addMessage("", "user-image", imageUrl);
      fileInputRef.current!.value = "";

      await sleep(500);
      await showTyping();
      await sleep(1000);
      await hideTyping();

      if (currentStage === "STAGE_8_REPORT_SUBMIT") {
        addMessage("", "user-image", imageUrl);
        await sleep(1000);
        setCurrentStage("STAGE_8_REPORT_SENT");
        return;
      }

      if (currentStage === "STAGE_2_CREATIVE_1") {
        addMessage("Мне не нравится ваш креатив. Переделайте его.", "bot");
        await sleep(500);
        addMessage(
          "**Задача:** Вам нужно переделывать креатив и прислать его снова.",
          "system-alert"
        );
        setCurrentStage("STAGE_2_CREATIVE_2");
      } else if (currentStage === "STAGE_2_CREATIVE_2") {
        setUploadedCreativeUrl(imageUrl);
        addMessage("Да, этот мне нравится. Запускайте рекламу.", "bot");
        setFileAttachEnabled(false);
        setCurrentStage("STAGE_3_LAUNCH");
        setIsCabinetLocked(false);
        await sleep(1000);
        addMessage(
          "**Подсказка:** Вам нужно зайти в рекламный кабинет (справа) и нажать кнопку \"Запустить кампанию\".",
          "system-alert"
        );
      }
    };
    reader.readAsDataURL(file);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const downloadDialogs = async () => {
    // Фильтруем только диалоги клиент-ученик (без системных сообщений и подсказок)
    const clientDialogs = messages.filter(
      (msg) => msg.type === "bot" || msg.type === "user"
    );

    // Создаем параграфы для документа
    const paragraphs: Paragraph[] = [];

    // Заголовок документа
    paragraphs.push(
      new Paragraph({
        text: "Диалоги: Клиент-Маркетолог",
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );

    paragraphs.push(
      new Paragraph({
        text: "Кейс: «Срочный запуск 14 февраля»",
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      })
    );

    // Добавляем диалоги
    clientDialogs.forEach((msg) => {
      const speaker = msg.type === "user" ? "Маркетолог" : "Клиент (Анна)";
      const timestamp = msg.timestamp.toLocaleString("ru-RU");

      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `[${timestamp}] ${speaker}:`,
              bold: true,
            }),
          ],
          spacing: { before: 200, after: 100 },
        })
      );

      paragraphs.push(
        new Paragraph({
          text: msg.text,
          spacing: { after: 200 },
        })
      );
    });

    // Создаем документ
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    });

    // Генерируем и скачиваем файл
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "dialogi-klient-marketolog.docx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <div className="border-b border-border bg-card p-3 sm:p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-lg sm:text-xl">
              А
            </div>
            <div>
              <h2 className="font-semibold text-sm sm:text-base text-foreground">Анна</h2>
              <span className="text-xs text-success">Online</span>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-3 sm:p-4">
        <div className="space-y-3 sm:space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-2 sm:gap-3 items-start",
                message.type === "user" && "flex-row-reverse",
                (message.type === "system" || message.type === "system-alert") &&
                  "justify-center"
              )}
            >
              {message.type !== "system" && message.type !== "system-alert" && (
                <div
                  className={cn(
                    "flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full text-white font-bold text-base sm:text-lg",
                    message.type === "user" && "bg-gradient-to-br from-green-500 to-emerald-600",
                    (message.type === "bot" ||
                      message.type === "bot-image" ||
                      message.type === "user-image") &&
                      "bg-gradient-to-br from-purple-500 to-pink-500"
                  )}
                >
                  {message.type === "user" ? "Я" : "А"}
                </div>
              )}

              <div
                className={cn(
                  "rounded-lg px-3 py-2 sm:px-4 max-w-[85%] sm:max-w-[80%] text-sm sm:text-base",
                  message.type === "user" &&
                    "bg-chat-user text-white rounded-br-sm",
                  (message.type === "bot" || message.type === "bot-image") &&
                    "bg-secondary text-secondary-foreground rounded-bl-sm",
                  (message.type === "system" || message.type === "system-alert") &&
                    "bg-chat-system/10 text-foreground border border-chat-system/20 max-w-full text-left",
                  message.type === "system-alert" && "bg-destructive/10 border-destructive/20"
                )}
              >
                {message.type === "bot-image" ? (
                  <div className="w-48 h-32 bg-gradient-to-br from-pink-100 via-rose-100 to-purple-100 rounded flex items-center justify-center">
                    <div className="text-7xl leading-none select-none" style={{ fontSize: '5rem' }}>
                      {flowerEmojis[message.id % flowerEmojis.length]}
                    </div>
                  </div>
                ) : message.type === "user-image" && message.imageUrl ? (
                  <img
                    src={message.imageUrl}
                    alt="Uploaded creative"
                    className="max-w-full h-auto rounded"
                  />
                ) : (
                  <>
                    <div
                      className="text-sm leading-relaxed whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{
                        __html: message.text
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1</a>'),
                      }}
                    />
                    {message.type !== "system" && message.type !== "system-alert" && (
                      <p className="mt-1 text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString("ru-RU", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2 sm:gap-3 items-start">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-base sm:text-lg">
                А
              </div>
              <div className="rounded-lg bg-secondary px-3 py-2 sm:px-4 rounded-bl-sm">
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce" />
                  <div className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:0.15s]" />
                  <div className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:0.3s]" />
                </div>
              </div>
            </div>
          )}

          {currentStage === "FINAL" && (
            <div className="flex justify-center mt-4">
              <Button 
                onClick={downloadDialogs}
                variant="default"
                className="gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Скачать мои диалоги
              </Button>
            </div>
          )}
          
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="border-t border-border bg-card p-3 sm:p-4 rounded-b-lg">
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={!fileAttachEnabled}
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
            disabled={isTyping}
          />
          <Button onClick={handleSend} className="shrink-0" disabled={isTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
