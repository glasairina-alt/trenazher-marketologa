import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CaseContent {
  id: string;
  client_name: string;
  case_title: string;
  product_price: number;
  product_description: string;
  budget: number;
  image_1_url: string | null;
  image_2_url: string | null;
  image_3_url: string | null;
}

interface AdMetrics {
  id: string;
  impressions: number;
  clicks: number;
  conversions: number;
}

interface MetricAnswer {
  id: string;
  metric_name: string;
  correct_values: number[];
}

export default function AdminContent() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isAdmin = user?.role === "admin";

  const [caseContent, setCaseContent] = useState<CaseContent>({
    id: "",
    client_name: "",
    case_title: "",
    product_price: 0,
    product_description: "",
    budget: 0,
    image_1_url: null,
    image_2_url: null,
    image_3_url: null,
  });

  const [adMetrics, setAdMetrics] = useState<AdMetrics>({
    id: "",
    impressions: 0,
    clicks: 0,
    conversions: 0,
  });

  const [metricAnswers, setMetricAnswers] = useState<MetricAnswer[]>([]);

  useEffect(() => {
    if (!authLoading) {
      checkAdminAccess();
    }
  }, [authLoading, user]);

  const checkAdminAccess = async () => {
    if (!user) {
      navigate("/");
      return;
    }

    if (user.role !== "admin") {
      toast({
        title: "Доступ запрещен",
        description: "У вас нет прав администратора",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    await loadContent();
  };

  const loadContent = async () => {
    try {
      setLoading(true);

      const [caseResult, metricsResult, answersResult] = await Promise.all([
        supabase.from("case_content").select("*").single(),
        supabase.from("ad_metrics").select("*").single(),
        supabase.from("metric_answers").select("*").order("metric_name"),
      ]);

      if (caseResult.error) throw caseResult.error;
      if (metricsResult.error) throw metricsResult.error;
      if (answersResult.error) throw answersResult.error;

      setCaseContent(caseResult.data);
      setAdMetrics(metricsResult.data);
      setMetricAnswers(answersResult.data || []);
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCaseContent = async () => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from("case_content")
        .update({
          client_name: caseContent.client_name,
          case_title: caseContent.case_title,
          product_price: caseContent.product_price,
          product_description: caseContent.product_description,
          budget: caseContent.budget,
          image_1_url: caseContent.image_1_url,
          image_2_url: caseContent.image_2_url,
          image_3_url: caseContent.image_3_url,
        })
        .eq("id", caseContent.id);

      if (error) throw error;

      toast({
        title: "Сохранено",
        description: "Контент кейса успешно обновлен",
      });
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMetrics = async () => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from("ad_metrics")
        .update({
          impressions: adMetrics.impressions,
          clicks: adMetrics.clicks,
          conversions: adMetrics.conversions,
        })
        .eq("id", adMetrics.id);

      if (error) throw error;

      toast({
        title: "Сохранено",
        description: "Метрики рекламы успешно обновлены",
      });
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMetricAnswers = async () => {
    try {
      setSaving(true);

      for (const metric of metricAnswers) {
        const { error } = await supabase
          .from("metric_answers")
          .update({
            correct_values: metric.correct_values,
          })
          .eq("id", metric.id);

        if (error) throw error;
      }

      toast({
        title: "Сохранено",
        description: "Правильные ответы успешно обновлены",
      });
    } catch (error: any) {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleMetricValueChange = (metricId: string, index: number, value: string) => {
    setMetricAnswers((prev) =>
      prev.map((metric) => {
        if (metric.id === metricId) {
          const newValues = [...metric.correct_values];
          const numValue = parseFloat(value);
          if (!isNaN(numValue)) {
            newValues[index] = numValue;
          } else if (value === "") {
            newValues.splice(index, 1);
          }
          return { ...metric, correct_values: newValues };
        }
        return metric;
      })
    );
  };

  const handleAddMetricValue = (metricId: string) => {
    setMetricAnswers((prev) =>
      prev.map((metric) => {
        if (metric.id === metricId && metric.correct_values.length < 3) {
          return {
            ...metric,
            correct_values: [...metric.correct_values, 0],
          };
        }
        return metric;
      })
    );
  };

  const getMetricLabel = (metricName: string) => {
    const labels: Record<string, string> = {
      ctr: "CTR (%)",
      cpc: "CPC (руб)",
      cpm: "CPM (руб)",
      cr1: "CR1 (%)",
      cpl: "CPL (руб)",
      cr2: "CR2 (%)",
      avgCheck: "Средний чек (руб)",
      romi: "ROMI (%)",
    };
    return labels[metricName] || metricName;
  };

  if (authLoading || loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Управление контентом</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <Tabs defaultValue="case" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="case">Кейс и клиент</TabsTrigger>
            <TabsTrigger value="metrics">Метрики рекламы</TabsTrigger>
            <TabsTrigger value="answers">Правильные ответы</TabsTrigger>
          </TabsList>

          <TabsContent value="case" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Информация о клиенте и кейсе</CardTitle>
                <CardDescription>
                  Измените название кейса и имя клиента
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="case_title">Название кейса</Label>
                  <Input
                    id="case_title"
                    value={caseContent.case_title}
                    onChange={(e) =>
                      setCaseContent({ ...caseContent, case_title: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_name">Имя клиента</Label>
                  <Input
                    id="client_name"
                    value={caseContent.client_name}
                    onChange={(e) =>
                      setCaseContent({ ...caseContent, client_name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Бюджет рекламы (₽)</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={caseContent.budget}
                    onChange={(e) =>
                      setCaseContent({
                        ...caseContent,
                        budget: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Информация о продукте</CardTitle>
                <CardDescription>
                  Измените цену и описание продукта
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="product_price">Цена продукта (₽)</Label>
                  <Input
                    id="product_price"
                    type="number"
                    value={caseContent.product_price}
                    onChange={(e) =>
                      setCaseContent({
                        ...caseContent,
                        product_price: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="product_description">Описание продукта</Label>
                  <Textarea
                    id="product_description"
                    value={caseContent.product_description}
                    onChange={(e) =>
                      setCaseContent({
                        ...caseContent,
                        product_description: e.target.value,
                      })
                    }
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Фотографии клиента</CardTitle>
                <CardDescription>
                  Введите URL-адреса трех фотографий
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image_1">Фотография 1</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image_1"
                      placeholder="https://..."
                      value={caseContent.image_1_url || ""}
                      onChange={(e) =>
                        setCaseContent({
                          ...caseContent,
                          image_1_url: e.target.value,
                        })
                      }
                    />
                  </div>
                  {caseContent.image_1_url && (
                    <img
                      src={caseContent.image_1_url}
                      alt="Фото 1"
                      className="w-32 h-32 object-cover rounded-md border"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_2">Фотография 2</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image_2"
                      placeholder="https://..."
                      value={caseContent.image_2_url || ""}
                      onChange={(e) =>
                        setCaseContent({
                          ...caseContent,
                          image_2_url: e.target.value,
                        })
                      }
                    />
                  </div>
                  {caseContent.image_2_url && (
                    <img
                      src={caseContent.image_2_url}
                      alt="Фото 2"
                      className="w-32 h-32 object-cover rounded-md border"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_3">Фотография 3</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image_3"
                      placeholder="https://..."
                      value={caseContent.image_3_url || ""}
                      onChange={(e) =>
                        setCaseContent({
                          ...caseContent,
                          image_3_url: e.target.value,
                        })
                      }
                    />
                  </div>
                  {caseContent.image_3_url && (
                    <img
                      src={caseContent.image_3_url}
                      alt="Фото 3"
                      className="w-32 h-32 object-cover rounded-md border"
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleSaveCaseContent}
              disabled={saving}
              className="w-full"
            >
              <Save className="mr-2 h-4 w-4" />
              Сохранить изменения кейса
            </Button>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Метрики рекламной кампании</CardTitle>
                <CardDescription>
                  Измените показатели рекламы (показы, клики, конверсии)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="impressions">Показы</Label>
                  <Input
                    id="impressions"
                    type="number"
                    value={adMetrics.impressions}
                    onChange={(e) =>
                      setAdMetrics({
                        ...adMetrics,
                        impressions: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clicks">Клики</Label>
                  <Input
                    id="clicks"
                    type="number"
                    value={adMetrics.clicks}
                    onChange={(e) =>
                      setAdMetrics({
                        ...adMetrics,
                        clicks: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conversions">Конверсии</Label>
                  <Input
                    id="conversions"
                    type="number"
                    value={adMetrics.conversions}
                    onChange={(e) =>
                      setAdMetrics({
                        ...adMetrics,
                        conversions: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="mt-6 p-4 bg-muted rounded-lg space-y-2">
                  <h3 className="font-semibold">Рассчитанные метрики:</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">CTR:</span>
                      <span className="ml-2 font-medium">
                        {adMetrics.impressions > 0
                          ? ((adMetrics.clicks / adMetrics.impressions) * 100).toFixed(2)
                          : 0}
                        %
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">CR:</span>
                      <span className="ml-2 font-medium">
                        {adMetrics.clicks > 0
                          ? ((adMetrics.conversions / adMetrics.clicks) * 100).toFixed(2)
                          : 0}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleSaveMetrics}
              disabled={saving}
              className="w-full"
            >
              <Save className="mr-2 h-4 w-4" />
              Сохранить метрики
            </Button>
          </TabsContent>

          <TabsContent value="answers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Правильные ответы для проверки</CardTitle>
                <CardDescription>
                  Укажите правильные значения метрик (до 3 вариантов для каждой)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {metricAnswers.map((metric) => (
                  <div key={metric.id} className="space-y-3 p-4 border border-border rounded-lg">
                    <Label className="text-base font-semibold">
                      {getMetricLabel(metric.metric_name)}
                    </Label>
                    <div className="space-y-2">
                      {metric.correct_values.map((value, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <Label className="text-sm text-muted-foreground min-w-[100px]">
                            Вариант {index + 1}:
                          </Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={value}
                            onChange={(e) =>
                              handleMetricValueChange(metric.id, index, e.target.value)
                            }
                            className="flex-1"
                          />
                        </div>
                      ))}
                      {metric.correct_values.length < 3 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddMetricValue(metric.id)}
                          className="w-full"
                        >
                          + Добавить вариант
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Button
              onClick={handleSaveMetricAnswers}
              disabled={saving}
              className="w-full"
            >
              <Save className="mr-2 h-4 w-4" />
              Сохранить правильные ответы
            </Button>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
