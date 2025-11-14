import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";
import { AdReportModal } from "@/components/AdReportModal";
import { useToast } from "@/hooks/use-toast";
import type { StageType } from "@/types/stages";

interface AdCabinetProps {
  currentStage: StageType;
  setCurrentStage: (stage: StageType) => void;
  isCabinetLocked: boolean;
  uploadedCreativeUrl: string;
  adData?: { headline: string; text: string };
  setAdData: (data: { headline: string; text: string }) => void;
}

export const AdCabinet = ({
  currentStage,
  setCurrentStage,
  isCabinetLocked,
  uploadedCreativeUrl,
  adData = { headline: "", text: "" },
  setAdData,
}: AdCabinetProps) => {
  const { toast } = useToast();
  const [budget] = useState(15000);
  const [conversions, setConversions] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [campaignLaunched, setCampaignLaunched] = useState(false);

  const canLaunch =
    adData?.headline?.trim() !== "" &&
    adData?.text?.trim() !== "" &&
    uploadedCreativeUrl !== "";

  const handleLaunch = () => {
    if (!canLaunch) {
      let errorMsg = "Вы не настроили рекламное объявление. ";
      if (!adData?.headline?.trim()) errorMsg += "Заполните Заголовок. ";
      if (!adData?.text?.trim()) errorMsg += "Заполните Текст. ";
      if (uploadedCreativeUrl === "")
        errorMsg += "Дождитесь согласования креатива от клиента.";

      toast({
        title: "Ошибка",
        description: errorMsg,
        variant: "destructive",
      });
      return;
    }

    if (currentStage !== "STAGE_3_LAUNCH") return;

    setCampaignLaunched(true);
    setConversions(23);
    toast({
      title: "Кампания запущена!",
      description: "Реклама успешно запущена",
    });

    setTimeout(() => {
      toast({
        title: "Поздравляю!",
        description:
          "Вы запустили рекламную кампанию. Теперь подождем, когда пойдут первые заявки. Сообщите своему клиенту, что вы запустили рекламу.",
      });
      setCurrentStage("STAGE_3_LAUNCH_WAIT_USER");
    }, 1000);
  };

  useEffect(() => {
    if (
      currentStage === "STAGE_7_REPORT_DATA_2" ||
      currentStage === "STAGE_8_REPORT_SUBMIT"
    ) {
      setConversions(23);
    }
  }, [currentStage]);

  return (
    <Card className="relative overflow-hidden">
      {isCabinetLocked && (
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <Lock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold text-foreground">
              Рекламный кабинет заблокирован
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Следуйте инструкциям в чате
            </p>
          </div>
        </div>
      )}

      <CardHeader className="bg-gradient-to-r from-[#4680C2] to-[#5181B8] text-white">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-white">
              <svg className="h-6 w-6" viewBox="0 0 48 48" fill="currentColor">
                <path d="M24 4.5C12.7 4.5 3.5 13.7 3.5 25S12.7 45.5 24 45.5 44.5 36.3 44.5 25 35.3 4.5 24 4.5zm6.7 24.7c.4.4.4 1 0 1.4l-1.4 1.4c-.4.4-1 .4-1.4 0L24 28.1l-3.9 3.9c-.4.4-1 .4-1.4 0l-1.4-1.4c-.4-.4-.4-1 0-1.4l3.9-3.9-3.9-3.9c-.4-.4-.4-1 0-1.4l1.4-1.4c.4-.4 1-.4 1.4 0l3.9 3.9 3.9-3.9c.4-.4 1-.4 1.4 0l1.4 1.4c.4.4.4 1 0 1.4L28.1 24l2.6 5.2z"/>
              </svg>
              Кабинет VK Реклама
            </CardTitle>
            <p className="text-sm text-white/90 mt-1">Управление рекламными кампаниями</p>
          </div>
          <Badge className="bg-white/20 text-white border-white/30">Симулятор</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 bg-[#F0F2F5]">
        {/* Step 1: Campaign Settings */}
        <div className="bg-white rounded-lg p-4 border border-[#E7E8EC]">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-[#2C2D2E]">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#4680C2] text-white text-sm font-bold">1</div>
            Настройка кампании
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-[#626D7A]">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Тип: Сайт</span>
            </div>
            <div className="flex items-center gap-2 text-[#626D7A]">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Формат: Баннерная реклама</span>
            </div>
          </div>
        </div>

        {/* Step 2: Audience */}
        <div className="bg-white rounded-lg p-4 border border-[#E7E8EC]">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-[#2C2D2E]">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#4680C2] text-white text-sm font-bold">2</div>
            Настройка Аудитории
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-[#626D7A]">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Город: Калуга</span>
            </div>
            <div className="flex items-center gap-2 text-[#626D7A]">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Возраст: 18-24, 25-34, 35-45</span>
            </div>
            <div className="flex items-center gap-2 text-[#626D7A]">
              <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Интересы: Отношения, Семья, Подарки и Праздники</span>
            </div>
          </div>
        </div>

        {/* Step 3: Ad Creation */}
        <div className="bg-white rounded-lg p-4 border border-[#E7E8EC]">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-[#2C2D2E]">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#4680C2] text-white text-sm font-bold">3</div>
            Создание Объявления
          </h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="headline">Заголовок</Label>
              <Input
                id="headline"
                value={adData?.headline || ""}
                onChange={(e) =>
                  setAdData({ ...adData, headline: e.target.value })
                }
                placeholder="Введите заголовок..."
                maxLength={60}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {(adData?.headline || "").length}/60 символов
              </p>
            </div>

            <div>
              <Label htmlFor="text">Текст объявления</Label>
              <Textarea
                id="text"
                value={adData?.text || ""}
                onChange={(e) => setAdData({ ...adData, text: e.target.value })}
                placeholder="Введите текст объявления..."
                rows={3}
                maxLength={220}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {(adData?.text || "").length}/220 символов
              </p>
            </div>

            {/* Preview */}
            <div className="border-2 border-[#E7E8EC] rounded-lg p-3 bg-[#F7F8FA]">
              <h4 className="text-xs font-semibold mb-2 text-[#626D7A] uppercase">Превью объявления</h4>
              <div className="bg-white border border-[#E7E8EC] rounded-lg overflow-hidden shadow-sm">
                <div className="aspect-video bg-gradient-to-br from-[#E1E8ED] to-[#C8D4DE] flex items-center justify-center relative">
                  {uploadedCreativeUrl ? (
                    <img
                      src={uploadedCreativeUrl}
                      alt="Creative"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-5xl opacity-40">🌹</div>
                  )}
                  <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded">
                    Реклама
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-sm line-clamp-2 mb-1 text-[#2C2D2E]">
                    {adData?.headline || "Заголовок объявления"}
                  </h4>
                  <p className="text-xs text-[#626D7A] line-clamp-2 mb-3">
                    {adData?.text || "Текст вашего объявления появится здесь..."}
                  </p>
                  <button className="w-full bg-[#4680C2] hover:bg-[#5181B8] text-white rounded py-2 text-xs font-medium transition-colors">
                    Перейти
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Budget & Launch */}
        <div className="bg-white rounded-lg p-4 border border-[#E7E8EC]">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-[#2C2D2E]">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#4680C2] text-white text-sm font-bold">4</div>
            Бюджет и Запуск
          </h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="p-3 bg-[#F7F8FA] border border-[#E7E8EC] rounded-lg text-center">
              <p className="text-xs text-[#626D7A] mb-1">Общий бюджет</p>
              <p className="text-lg font-bold text-[#2C2D2E]">{budget.toLocaleString()} ₽</p>
            </div>
            <div className="p-3 bg-[#F7F8FA] border border-[#E7E8EC] rounded-lg text-center">
              <p className="text-xs text-[#626D7A] mb-1">Остаток</p>
              <p className="text-lg font-bold text-green-600">0 ₽</p>
            </div>
            <div className="p-3 bg-[#F7F8FA] border border-[#E7E8EC] rounded-lg text-center">
              <p className="text-xs text-[#626D7A] mb-1">Конверсии</p>
              <p className="text-lg font-bold text-[#4680C2]">{conversions}</p>
            </div>
          </div>

          <Button
            onClick={handleLaunch}
            disabled={!canLaunch || campaignLaunched}
            className="w-full bg-[#4680C2] hover:bg-[#5181B8] text-white"
          >
            {campaignLaunched ? "✓ Кампания запущена" : "Запустить кампанию"}
          </Button>
        </div>

        {/* Step 5: Reports */}
        {campaignLaunched && (
          <div className="bg-white rounded-lg p-4 border border-[#E7E8EC]">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-[#2C2D2E]">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#4680C2] text-white text-sm font-bold">5</div>
              Отчеты
            </h3>
            <Button
              onClick={() => setShowReport(true)}
              className="w-full bg-[#5181B8] hover:bg-[#4680C2] text-white"
            >
              Сформировать отчет
            </Button>
          </div>
        )}
      </CardContent>

      <AdReportModal
        open={showReport}
        onOpenChange={setShowReport}
        currentStage={currentStage}
        setCurrentStage={setCurrentStage}
      />
    </Card>
  );
};
