import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatInterface } from "@/components/ChatInterface";
import { AdCabinet } from "@/components/AdCabinet";
import { AdReportTab } from "@/components/AdReportTab";
import { MessageCircle, TrendingUp, FileText } from "lucide-react";
import type { StageType } from "@/types/stages";

const Index = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [currentStage, setCurrentStage] = useState<StageType>("INITIAL");
  const [isCabinetLocked, setIsCabinetLocked] = useState(true);
  const [uploadedCreativeUrl, setUploadedCreativeUrl] = useState("");
  const [adData, setAdData] = useState({
    headline: "",
    text: "",
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Тренажер Маркетолога
              </h1>
              <p className="text-sm text-muted-foreground">
                Кейс: «Срочный запуск 14 февраля»
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Чат с клиентом
            </TabsTrigger>
            <TabsTrigger value="cabinet" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Рекламный кабинет
            </TabsTrigger>
            <TabsTrigger value="report" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Отчет
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
              />
            </div>
          </TabsContent>

          <TabsContent value="report" className="mt-6">
            <AdReportTab
              currentStage={currentStage}
              setCurrentStage={setCurrentStage}
            />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>© 2023 Интерактивный тренажер маркетолога</p>
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
    </div>
  );
};

export default Index;
