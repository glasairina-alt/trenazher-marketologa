import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Lock, TrendingUp, ExternalLink } from "lucide-react";
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
    <Card className="relative">
      {isCabinetLocked && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg">
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

      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Рекламный кабинет
        </CardTitle>
        <Badge variant="outline">Имитатор VK Реклама</Badge>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step 1: Campaign Settings */}
        <div>
          <h3 className="text-lg font-semibold mb-3">1. Настройка кампании</h3>
          <div className="text-sm text-muted-foreground">
            <p>✓ Тип: Сайт</p>
            <p>✓ Формат: Баннерная реклама</p>
          </div>
        </div>

        {/* Step 2: Audience */}
        <div>
          <h3 className="text-lg font-semibold mb-3">
            2. Настройка Аудитории (г. Калуга)
          </h3>
          <div className="text-sm text-muted-foreground mb-2">
            <p>✓ Возраст: 18-24, 25-34, 35-45</p>
            <p>✓ Интересы: Отношения, Семья, Подарки и Праздники</p>
          </div>
        </div>

        {/* Step 3: Ad Creation */}
        <div>
          <h3 className="text-lg font-semibold mb-3">3. Создание Объявления</h3>
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
            <div className="border rounded-lg p-4 bg-muted/30">
              <h4 className="text-sm font-semibold mb-2">Превью объявления:</h4>
              <div className="bg-card border rounded-lg overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  {uploadedCreativeUrl ? (
                    <img
                      src={uploadedCreativeUrl}
                      alt="Creative"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-4xl opacity-30">🌹</div>
                  )}
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-sm line-clamp-2 mb-1">
                    {adData?.headline || "Заголовок объявления"}
                  </h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {adData?.text || "Текст вашего объявления появится здесь..."}
                  </p>
                  <button className="w-full bg-primary text-primary-foreground rounded py-1.5 text-xs font-medium flex items-center justify-center gap-1">
                    Перейти
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Budget & Launch */}
        <div>
          <h3 className="text-lg font-semibold mb-3">4. Бюджет и Запуск</h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="p-3 border rounded-lg text-center">
              <p className="text-xs text-muted-foreground mb-1">Общий бюджет</p>
              <p className="text-lg font-bold">{budget.toLocaleString()} ₽</p>
            </div>
            <div className="p-3 border rounded-lg text-center">
              <p className="text-xs text-muted-foreground mb-1">Остаток</p>
              <p className="text-lg font-bold text-success">0 ₽</p>
            </div>
            <div className="p-3 border rounded-lg text-center">
              <p className="text-xs text-muted-foreground mb-1">Конверсии</p>
              <p className="text-lg font-bold">{conversions}</p>
            </div>
          </div>

          <Button
            onClick={handleLaunch}
            disabled={!canLaunch || campaignLaunched}
            className="w-full"
          >
            {campaignLaunched ? "Кампания запущена" : "Запустить кампанию"}
          </Button>
        </div>

        {/* Step 5: Reports */}
        {campaignLaunched && (
          <div>
            <h3 className="text-lg font-semibold mb-3">5. Отчеты</h3>
            <Button
              onClick={() => setShowReport(true)}
              variant="outline"
              className="w-full"
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
