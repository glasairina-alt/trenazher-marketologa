import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/ChatInterface";
import { AdCabinet } from "@/components/AdCabinet";
import { AdReportTab } from "@/components/AdReportTab";
import { PremiumPurchaseModal } from "@/components/PremiumPurchaseModal";
import { AuthModal } from "@/components/AuthModal";
import { ChangePasswordModal } from "@/components/ChangePasswordModal";
import { MessageCircle, TrendingUp, FileText, Lock, User, LogOut, Shield, Key } from "lucide-react";
import type { StageType, Message } from "@/types/stages";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { reachGoal, MetrikaGoals } from "@/lib/metrika";

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
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";
  const isPaidUser = user?.role === "admin" || user?.role === "premium_user";
  
  // Ref для отслеживания, была ли уже отправлена цель lesson_completed
  const lessonCompletedRef = useRef(false);
  
  // Отправка цели lesson_completed при достижении стадии FINAL
  useEffect(() => {
    if (currentStage === "FINAL" && !lessonCompletedRef.current) {
      reachGoal(MetrikaGoals.LESSON_COMPLETED);
      lessonCompletedRef.current = true;
    }
    // Сбрасываем флаг при начале нового кейса
    if (currentStage === "INITIAL") {
      lessonCompletedRef.current = false;
    }
  }, [currentStage]);

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
                <p className="text-xs sm:text-sm text-muted-foreground/80 mt-2 truncate font-medium">Кейс: «Срочный запуск 14 февраля»</p>
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
                <Button 
                  onClick={() => {
                    reachGoal(MetrikaGoals.BUTTON_UNLOCK_PREMIUM);
                    setIsPaywallOpen(true);
                  }} 
                  variant="default" 
                  size="sm" 
                  className="gap-2"
                  data-testid="button-unlock-premium-header"
                >
                  <Lock className="h-4 w-4" />
                  <span className="hidden sm:inline">Полный доступ</span>
                </Button>
              )}
              {user ? (
                <>
                  <Button onClick={() => setIsChangePasswordOpen(true)} variant="outline" size="sm" className="gap-2" data-testid="button-open-change-password">
                    <Key className="h-4 w-4" />
                    <span className="hidden sm:inline">Сменить пароль</span>
                  </Button>
                  <Button onClick={handleLogout} variant="outline" size="sm" className="gap-2">
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Выход</span>
                  </Button>
                </>
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
                onPurchaseRequest={() => setIsPaywallOpen(true)}
              />
            </div>
          </TabsContent>

          <TabsContent value="report" className="mt-6">
            <AdReportTab currentStage={currentStage} setCurrentStage={setCurrentStage} />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-border bg-card mt-8 sm:mt-12">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            © 2025 Интерактивный тренажер маркетолога
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
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
          <div className="mt-3 text-xs text-muted-foreground/80 space-y-1">
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <a
                href="https://voitovichirina.ru/politika"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
                data-testid="link-privacy-policy-footer"
              >
                Политика обработки персональных данных
              </a>
              <span className="hidden sm:inline">•</span>
              <a
                href="/oferta"
                className="hover:text-primary transition-colors"
                data-testid="link-oferta-footer"
              >
                Договор оферты
              </a>
            </div>
            <p className="mt-1">ИНН 645318153031</p>
          </div>
        </div>
      </footer>

      <PremiumPurchaseModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
      />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={handleAuthSuccess} />
      
      <ChangePasswordModal 
        isOpen={isChangePasswordOpen} 
        onClose={() => setIsChangePasswordOpen(false)}
        onSuccess={() => {
          toast({
            title: "Пароль успешно изменен",
            description: "Теперь вы можете использовать новый пароль для входа",
          });
        }}
      />
    </div>
  );
};

export default Index;
