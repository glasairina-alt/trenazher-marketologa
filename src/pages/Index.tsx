import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/ChatInterface";
import { AdCabinet } from "@/components/AdCabinet";
import { AdReportTab } from "@/components/AdReportTab";
import { PaywallModal } from "@/components/PaywallModal";
import { AuthModal } from "@/components/AuthModal";
import { MessageCircle, TrendingUp, FileText, Lock, User, LogOut, Shield } from "lucide-react";
import type { StageType, Message } from "@/types/stages";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [currentStage, setCurrentStage] = useState<StageType>("INITIAL");
  const [isCabinetLocked, setIsCabinetLocked] = useState(true);
  const [uploadedCreativeUrl, setUploadedCreativeUrl] = useState("");
  const [adData, setAdData] = useState({
    headline: "",
    text: "",
  });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "bot",
      text: "Привет! Введите /start чтобы начать кейс.",
      timestamp: new Date(),
    },
  ]);

  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";
  const isPaidUser = user?.role === "admin" || user?.role === "premium_user";

  const handleLogout = () => {
    logout();
    toast({
      title: "Выход выполнен",
      description: "Вы успешно вышли из системы",
    });
  };

  const handleAuthSuccess = () => {
    toast({
      title: "Добро пожаловать!",
      description: "Вы успешно вошли в систему",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-primary shrink-0" />
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-foreground whitespace-normal break-words leading-tight">
                  Тренажер маркетолога "Твой первый клиент"
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Кейс: «Срочный запуск 14 февраля»</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {isAdmin && (
                <Button onClick={() => navigate("/admin")} variant="outline" size="sm" className="gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Админ-панель</span>
                </Button>
              )}
              {!isPaidUser && !isAdmin && (
                <Button onClick={() => setIsPaywallOpen(true)} variant="default" size="sm" className="gap-2">
                  <Lock className="h-4 w-4" />
                  <span className="hidden sm:inline">Полный доступ</span>
                </Button>
              )}
              {user ? (
                <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Выход</span>
                </Button>
              ) : (
                <Button onClick={() => setIsAuthOpen(true)} variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Вход</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Чат с клиентом</span>
            </TabsTrigger>
            <TabsTrigger value="cabinet" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Рекламный кабинет</span>
            </TabsTrigger>
            <TabsTrigger value="report" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Отчет</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="mt-6">
            <div className="max-w-4xl mx-auto">
              <ChatInterface
                currentStage={currentStage}
                setCurrentStage={setCurrentStage}
                setIsCabinetLocked={setIsCabinetLocked}
                setUploadedCreativeUrl={setUploadedCreativeUrl}
                adData={adData}
                isActive={activeTab === "chat"}
                messages={messages}
                setMessages={setMessages}
              />
            </div>
          </TabsContent>

          <TabsContent value="cabinet" className="mt-6">
            <div className="max-w-4xl mx-auto">
              <AdCabinet
                currentStage={currentStage}
                setCurrentStage={setCurrentStage}
                isCabinetLocked={isCabinetLocked}
                uploadedCreativeUrl={uploadedCreativeUrl}
                adData={adData}
                setAdData={setAdData}
                setActiveTab={setActiveTab}
                isPaidUser={isPaidUser}
                onPurchaseRequest={() => {
                  // TODO: Здесь вызовите вашу логику оплаты
                  // После успешной оплаты: setIsPaidUser(true)
                  console.log("Запрос на оплату 790₽");
                  // Временно для теста:
                  // setIsPaidUser(true);
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="report" className="mt-6">
            <AdReportTab currentStage={currentStage} setCurrentStage={setCurrentStage} />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-border bg-card mt-8 sm:mt-12">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 text-center text-xs sm:text-sm text-muted-foreground">
          <p>© 2025 Интерактивный тренажер маркетолога</p>
          <p className="mt-2">
            Автор: Ирина Войтович, маркетолог-наставник{" "}
            <a
              href="https://t.me/irinavoitovich"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              @irinavoitovich
            </a>
          </p>
        </div>
      </footer>

      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        onPurchase={() => {
          console.log("Запрос на оплату 790₽");
          // TODO: Реализовать реальную оплату
          // После успешной оплаты: setIsPaidUser(true)
          setIsPaywallOpen(false);
        }}
      />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={handleAuthSuccess} />
    </div>
  );
};

export default Index;
