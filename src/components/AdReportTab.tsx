import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { StageType } from "@/types/stages";

interface AdReportTabProps {
  currentStage: StageType;
  setCurrentStage: (stage: StageType) => void;
}

export const AdReportTab = ({
  currentStage,
  setCurrentStage,
}: AdReportTabProps) => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState({
    spend: "",
    impressions: "",
    clicks: "",
    leads: "",
  });

  const [calculated, setCalculated] = useState({
    ctr: "",
    cpc: "",
    cpm: "",
    cr1: "",
    cpl: "",
  });

  const handleCalculate = () => {
    const spend = parseFloat(metrics.spend);
    const impressions = parseFloat(metrics.impressions);
    const clicks = parseFloat(metrics.clicks);
    const leads = parseFloat(metrics.leads);

    if (!spend || !impressions || !clicks || !leads) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    const ctr = ((clicks / impressions) * 100).toFixed(2);
    const cpc = (spend / clicks).toFixed(2);
    const cpm = ((spend / impressions) * 1000).toFixed(2);
    const cr1 = ((leads / clicks) * 100).toFixed(2);
    const cpl = (spend / leads).toFixed(2);

    setCalculated({
      ctr,
      cpc,
      cpm,
      cr1,
      cpl,
    });

    toast({
      title: "Метрики рассчитаны",
      description: "Все показатели успешно вычислены",
    });
  };

  const allFieldsFilled = () => {
    return (
      metrics.spend &&
      metrics.impressions &&
      metrics.clicks &&
      metrics.leads &&
      calculated.ctr
    );
  };

  const handleSendReport = () => {
    if (!allFieldsFilled()) {
      toast({
        title: "Ошибка",
        description: "Заполните все поля и рассчитайте метрики",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Отчет отправлен",
      description: "Отчет успешно отправлен клиенту",
    });

    if (currentStage === "STAGE_7_REPORT_DATA_2") {
      toast({
        title: "Задача",
        description: "Обязательно оповестите Анну, что отчет готов.",
      });
      setCurrentStage("STAGE_8_REPORT_SUBMIT");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Отчет по рекламной кампании</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Основные метрики */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Данные из рекламного кабинета</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="spend">Расход (₽) *</Label>
                <Input
                  id="spend"
                  type="number"
                  value={metrics.spend}
                  onChange={(e) =>
                    setMetrics({ ...metrics, spend: e.target.value })
                  }
                  placeholder="15000"
                />
              </div>
              <div>
                <Label htmlFor="impressions">Показы *</Label>
                <Input
                  id="impressions"
                  type="number"
                  value={metrics.impressions}
                  onChange={(e) =>
                    setMetrics({ ...metrics, impressions: e.target.value })
                  }
                  placeholder="110867"
                />
              </div>
              <div>
                <Label htmlFor="clicks">Клики *</Label>
                <Input
                  id="clicks"
                  type="number"
                  value={metrics.clicks}
                  onChange={(e) =>
                    setMetrics({ ...metrics, clicks: e.target.value })
                  }
                  placeholder="410"
                />
              </div>
              <div>
                <Label htmlFor="leads">Лиды/Заявки *</Label>
                <Input
                  id="leads"
                  type="number"
                  value={metrics.leads}
                  onChange={(e) =>
                    setMetrics({ ...metrics, leads: e.target.value })
                  }
                  placeholder="23"
                />
              </div>
            </div>
          </div>

          {/* Подсказка для запроса данных */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm font-medium text-amber-900">
              💡 Подсказка: Для расчета полных показателей ROMI, CR2 и среднего чека необходимо запросить у клиента данные о продажах и выручке
            </p>
          </div>

          {/* Рассчитанные метрики */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Рассчитанные показатели</h3>
              <Button onClick={handleCalculate}>
                Рассчитать показатели
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>CTR (%)</Label>
                <Input value={calculated.ctr} readOnly placeholder="0.00" />
              </div>
              <div>
                <Label>CPC (₽)</Label>
                <Input value={calculated.cpc} readOnly placeholder="0.00" />
              </div>
              <div>
                <Label>CPM (₽)</Label>
                <Input value={calculated.cpm} readOnly placeholder="0.00" />
              </div>
              <div>
                <Label>CR1 (%) - Клик → Лид</Label>
                <Input value={calculated.cr1} readOnly placeholder="0.00" />
              </div>
              <div>
                <Label>CPL (₽)</Label>
                <Input value={calculated.cpl} readOnly placeholder="0.00" />
              </div>
            </div>
          </div>


          {/* Кнопка отправки */}
          <div className="flex justify-end">
            <Button
              onClick={handleSendReport}
              disabled={!allFieldsFilled()}
              size="lg"
            >
              Отправить отчет клиенту
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
