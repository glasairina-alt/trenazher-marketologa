import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
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
    sales: "",
    revenue: "",
  });

  const [calculated, setCalculated] = useState({
    ctr: "",
    cpc: "",
    cpm: "",
    cr1: "",
    cpl: "",
    cr2: "",
    avgCheck: "",
    romi: "",
  });

  const [isCorrect, setIsCorrect] = useState(false);
  const [showError, setShowError] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState<Record<string, number[]>>({
    ctr: [],
    cpc: [],
    cpm: [],
    cr1: [],
    cpl: [],
    cr2: [],
    avgCheck: [],
    romi: [],
  });

  useEffect(() => {
    loadCorrectAnswers();
  }, []);

  const loadCorrectAnswers = async () => {
    try {
      const { data, error } = await supabase
        .from("metric_answers")
        .select("*");

      if (error) throw error;

      if (data) {
        const answersMap: Record<string, number[]> = {};
        data.forEach((item) => {
          answersMap[item.metric_name] = item.correct_values;
        });
        setCorrectAnswers(answersMap);
      }
    } catch (error) {
      console.error("Error loading correct answers:", error);
    }
  };

  const checkAnswers = (calculatedMetrics: {
    ctr: string;
    cpc: string;
    cpm: string;
    cr1: string;
    cpl: string;
    cr2: string;
    avgCheck: string;
    romi: string;
  }) => {
    const isValueCorrect = (value: string, correctValues: number[]) => {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return false;
      return correctValues.some(correct => Math.abs(numValue - correct) < 0.01);
    };

    return (
      isValueCorrect(calculatedMetrics.ctr, correctAnswers.ctr) &&
      isValueCorrect(calculatedMetrics.cpc, correctAnswers.cpc) &&
      isValueCorrect(calculatedMetrics.cpm, correctAnswers.cpm) &&
      isValueCorrect(calculatedMetrics.cr1, correctAnswers.cr1) &&
      isValueCorrect(calculatedMetrics.cpl, correctAnswers.cpl) &&
      isValueCorrect(calculatedMetrics.cr2, correctAnswers.cr2) &&
      isValueCorrect(calculatedMetrics.avgCheck, correctAnswers.avgCheck) &&
      isValueCorrect(calculatedMetrics.romi, correctAnswers.romi)
    );
  };

  const handleCheckAnswers = () => {
    if (!calculated.ctr || !calculated.cpc || !calculated.cpm || !calculated.cr1 || 
        !calculated.cpl || !calculated.cr2 || !calculated.avgCheck || !calculated.romi) {
      toast({
        title: "Ошибка",
        description: "Заполните все рассчитанные показатели",
        variant: "destructive",
      });
      return;
    }

    const correct = checkAnswers(calculated);
    setIsCorrect(correct);
    
    if (correct) {
      setShowError(false);
      toast({
        title: "Отлично! 🎉",
        description: "Все показатели рассчитаны правильно!",
      });
      
      // Подсказка о следующем шаге
      setTimeout(() => {
        toast({
          title: "Следующий шаг",
          description: "Теперь нажмите кнопку 'Отправить отчет клиенту' и сообщите Анне в чате, что отчет готов!",
          duration: 8000,
        });
      }, 1500);
    } else {
      setShowError(true);
      toast({
        title: "Проверьте расчеты",
        description: "Некоторые показатели рассчитаны неверно. Проверьте формулы.",
        variant: "destructive",
      });
    }
  };

  const canSendReport = () => {
    return isCorrect;
  };

  const handleSendReport = () => {
    if (!canSendReport()) {
      toast({
        title: "Ошибка",
        description: "Сначала проверьте расчеты — все показатели должны быть верны",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Отчет отправлен",
      description: "Отчет успешно отправлен клиенту",
    });

    if (currentStage === "STAGE_7_REPORT_DATA_2") {
      setCurrentStage("STAGE_8_REPORT_SUBMIT");
    }
  };

  const isReportLocked = currentStage !== "STAGE_5_REPORT" && 
    currentStage !== "STAGE_6_REPORT_WAIT" &&
    currentStage !== "STAGE_7_REPORT_DATA" && 
    currentStage !== "STAGE_7_REPORT_DATA_2" && 
    currentStage !== "STAGE_8_REPORT_SUBMIT" && 
    currentStage !== "STAGE_8_REPORT_SENT" &&
    currentStage !== "STAGE_9_EXPLAIN" && 
    currentStage !== "STAGE_10_SETTINGS" &&
    currentStage !== "FINAL";

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      <Card className="relative overflow-hidden min-h-[600px]">
        {isReportLocked && (
          <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-10 flex items-start pt-24 sm:pt-32 justify-center rounded-lg p-4">
            <div className="text-center">
              <Lock className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
              <p className="text-base sm:text-lg font-semibold text-foreground">
                Отчет заблокирован
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                Запустите рекламную кампанию и получите данные от клиента
              </p>
            </div>
          </div>
        )}
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Отчет по рекламной кампании</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6">
          {/* Основные метрики */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Данные из рекламного кабинета</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
              <div>
                <Label htmlFor="sales">Продажи</Label>
                <Input
                  id="sales"
                  type="number"
                  value={metrics.sales}
                  onChange={(e) =>
                    setMetrics({ ...metrics, sales: e.target.value })
                  }
                  placeholder="Запросите у клиента"
                />
              </div>
              <div>
                <Label htmlFor="revenue">Выручка (₽)</Label>
                <Input
                  id="revenue"
                  type="number"
                  value={metrics.revenue}
                  onChange={(e) =>
                    setMetrics({ ...metrics, revenue: e.target.value })
                  }
                  placeholder="Запросите у клиента"
                />
              </div>
            </div>
          </div>

          {/* Рассчитанные метрики */}
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2">
              <h3 className="text-base sm:text-lg font-semibold">Рассчитанные показатели</h3>
              <Button onClick={handleCheckAnswers} className="w-full sm:w-auto text-sm">
                Проверить расчеты
              </Button>
            </div>
            
            {showError && calculated.ctr && (
              <div className="mb-4 p-3 sm:p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-destructive">
                  ⚠️ Некоторые показатели рассчитаны неверно. Проверьте формулы и введенные данные.
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <Label>CTR (%)</Label>
                <Input 
                  type="number"
                  value={calculated.ctr} 
                  onChange={(e) => setCalculated({ ...calculated, ctr: e.target.value })}
                  placeholder="0.00" 
                />
              </div>
              <div>
                <Label>CPC (₽)</Label>
                <Input 
                  type="number"
                  value={calculated.cpc} 
                  onChange={(e) => setCalculated({ ...calculated, cpc: e.target.value })}
                  placeholder="0.00" 
                />
              </div>
              <div>
                <Label>CPM (₽)</Label>
                <Input 
                  type="number"
                  value={calculated.cpm} 
                  onChange={(e) => setCalculated({ ...calculated, cpm: e.target.value })}
                  placeholder="0.00" 
                />
              </div>
              <div>
                <Label>CR1 (%) - Клик → Лид</Label>
                <Input 
                  type="number"
                  value={calculated.cr1} 
                  onChange={(e) => setCalculated({ ...calculated, cr1: e.target.value })}
                  placeholder="0.00" 
                />
              </div>
              <div>
                <Label>CPL (₽)</Label>
                <Input 
                  type="number"
                  value={calculated.cpl} 
                  onChange={(e) => setCalculated({ ...calculated, cpl: e.target.value })}
                  placeholder="0.00" 
                />
              </div>
              <div>
                <Label>CR2 (%) - Лид → Продажа</Label>
                <Input 
                  type="number"
                  value={calculated.cr2} 
                  onChange={(e) => setCalculated({ ...calculated, cr2: e.target.value })}
                  placeholder="0.00" 
                />
              </div>
              <div>
                <Label>Средний чек (₽)</Label>
                <Input 
                  type="number"
                  value={calculated.avgCheck} 
                  onChange={(e) => setCalculated({ ...calculated, avgCheck: e.target.value })}
                  placeholder="0.00" 
                />
              </div>
              <div>
                <Label>ROMI (%)</Label>
                <Input 
                  type="number"
                  value={calculated.romi} 
                  onChange={(e) => setCalculated({ ...calculated, romi: e.target.value })}
                  placeholder="0.00" 
                />
              </div>
            </div>
          </div>

          {/* Кнопка отправки */}
          <div className="flex flex-col gap-3">
            {!isCorrect && calculated.ctr && calculated.cpc && calculated.cpm && 
             calculated.cr1 && calculated.cpl && calculated.cr2 && 
             calculated.avgCheck && calculated.romi && (
              <div className="p-3 sm:p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <p className="text-xs sm:text-sm text-center font-medium">
                  ⬆️ <strong>Важно:</strong> Сначала нажмите кнопку "Проверить расчеты" выше!
                </p>
              </div>
            )}
            
            <Button
              onClick={handleSendReport}
              disabled={!canSendReport()}
              size="lg"
              className={isCorrect ? "animate-pulse hover:animate-none" : ""}
            >
              Отправить отчет клиенту
            </Button>
            
            {isCorrect && (
              <div className="p-3 bg-chat-system/10 border border-chat-system/20 rounded-lg">
                <p className="text-xs sm:text-sm text-center text-muted-foreground">
                  💡 <strong>Подсказка:</strong> После того, как вы отправите отчет, вернитесь в чат и напишите клиенту, что вы отправили отчет.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
