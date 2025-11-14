import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface AdReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AdReportModal = ({ open, onOpenChange }: AdReportModalProps) => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState({
    spend: "15000",
    impressions: "110867",
    clicks: "410",
    leads: "23",
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

  const handleCalculate = () => {
    const spend = parseFloat(metrics.spend);
    const impressions = parseFloat(metrics.impressions);
    const clicks = parseFloat(metrics.clicks);
    const leads = parseFloat(metrics.leads);
    const sales = parseFloat(metrics.sales || "0");
    const revenue = parseFloat(metrics.revenue || "0");

    const ctr = ((clicks / impressions) * 100).toFixed(2);
    const cpc = (spend / clicks).toFixed(2);
    const cpm = ((spend / impressions) * 1000).toFixed(2);
    const cr1 = ((leads / clicks) * 100).toFixed(2);
    const cpl = (spend / leads).toFixed(2);

    let cr2 = "0";
    let avgCheck = "0";
    let romi = "0";

    if (sales > 0 && revenue > 0) {
      cr2 = ((sales / leads) * 100).toFixed(2);
      avgCheck = (revenue / sales).toFixed(2);
      romi = (((revenue - spend) / spend) * 100).toFixed(2);
    }

    setCalculated({
      ctr,
      cpc,
      cpm,
      cr1,
      cpl,
      cr2,
      avgCheck,
      romi,
    });

    toast({
      title: "Метрики рассчитаны",
      description: "Все показатели успешно вычислены",
    });
  };

  const handleSendReport = () => {
    toast({
      title: "Отчет отправлен",
      description: "Отчет успешно отправлен клиенту",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Отчет по кампании</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Расход (руб.)</Label>
              <Input
                value={metrics.spend}
                onChange={(e) =>
                  setMetrics({ ...metrics, spend: e.target.value })
                }
                type="number"
              />
            </div>
            <div>
              <Label>Показы</Label>
              <Input
                value={metrics.impressions}
                onChange={(e) =>
                  setMetrics({ ...metrics, impressions: e.target.value })
                }
                type="number"
              />
            </div>
            <div>
              <Label>Клики</Label>
              <Input
                value={metrics.clicks}
                onChange={(e) =>
                  setMetrics({ ...metrics, clicks: e.target.value })
                }
                type="number"
              />
            </div>
            <div>
              <Label>Заявки</Label>
              <Input
                value={metrics.leads}
                onChange={(e) =>
                  setMetrics({ ...metrics, leads: e.target.value })
                }
                type="number"
              />
            </div>
            <div>
              <Label>Продажи (запросите у клиента)</Label>
              <Input
                value={metrics.sales}
                onChange={(e) =>
                  setMetrics({ ...metrics, sales: e.target.value })
                }
                type="number"
                placeholder="0"
              />
            </div>
            <div>
              <Label>Доход (руб., запросите у клиента)</Label>
              <Input
                value={metrics.revenue}
                onChange={(e) =>
                  setMetrics({ ...metrics, revenue: e.target.value })
                }
                type="number"
                placeholder="0"
              />
            </div>
          </div>

          <Button onClick={handleCalculate} className="w-full">
            Рассчитать метрики
          </Button>

          {calculated.ctr && (
            <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
              <h3 className="font-semibold">Рассчитанные показатели:</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">CTR (%):</span>
                  <span className="ml-2 font-semibold">{calculated.ctr}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">CPC (руб.):</span>
                  <span className="ml-2 font-semibold">{calculated.cpc}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">CPM (руб.):</span>
                  <span className="ml-2 font-semibold">{calculated.cpm}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">CR1 (%):</span>
                  <span className="ml-2 font-semibold">{calculated.cr1}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">CPL (руб.):</span>
                  <span className="ml-2 font-semibold">{calculated.cpl}</span>
                </div>
                {parseFloat(calculated.cr2) > 0 && (
                  <>
                    <div>
                      <span className="text-muted-foreground">CR2 (%):</span>
                      <span className="ml-2 font-semibold">
                        {calculated.cr2}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Средний чек (руб.):
                      </span>
                      <span className="ml-2 font-semibold">
                        {calculated.avgCheck}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">ROMI (%):</span>
                      <span
                        className={`ml-2 font-semibold ${
                          parseFloat(calculated.romi) > 0
                            ? "text-success"
                            : "text-destructive"
                        }`}
                      >
                        {calculated.romi}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="pt-3 border-t text-xs text-muted-foreground space-y-1">
                <p>
                  <strong>CTR</strong> - кликабельность (клики / показы × 100)
                </p>
                <p>
                  <strong>CPC</strong> - стоимость клика (расход / клики)
                </p>
                <p>
                  <strong>CPM</strong> - стоимость 1000 показов (расход / показы
                  × 1000)
                </p>
                <p>
                  <strong>CR1</strong> - конверсия в заявку (заявки / клики ×
                  100)
                </p>
                <p>
                  <strong>CPL</strong> - стоимость заявки (расход / заявки)
                </p>
                <p>
                  <strong>CR2</strong> - конверсия в продажу (продажи / заявки ×
                  100)
                </p>
                <p>
                  <strong>ROMI</strong> - возврат инвестиций ((доход - расход) /
                  расход × 100)
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Закрыть
          </Button>
          {calculated.ctr && (
            <Button onClick={handleSendReport}>Отправить отчет</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
