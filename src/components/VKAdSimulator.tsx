import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdPreview } from "@/components/AdPreview";
import { AdReportModal } from "@/components/AdReportModal";
import { Globe, FileText, Image as ImageIcon, FileSpreadsheet } from "lucide-react";

export const VKAdSimulator = () => {
  const [step, setStep] = useState(1);
  const [campaignType, setCampaignType] = useState("website");
  const [adFormat, setAdFormat] = useState("banner");
  const [selectedAges, setSelectedAges] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [adHeadline, setAdHeadline] = useState("");
  const [adText, setAdText] = useState("");
  const [budget] = useState(15000);
  const [isLaunched, setIsLaunched] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const ages = ["18-24", "25-34", "35-45", "46-55", "55+"];
  const interests = [
    "Отношения, Семья",
    "Автомобили",
    "Подарки и Праздники",
    "Доставка еды",
    "Красота и Уход",
    "Подростки",
    "Бизнес",
    "Садоводство",
  ];

  const handleAgeToggle = (age: string) => {
    setSelectedAges((prev) =>
      prev.includes(age) ? prev.filter((a) => a !== age) : [...prev, age]
    );
  };

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleLaunch = () => {
    setIsLaunched(true);
    setStep(5);
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {[1, 2, 3, 4, 5].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-colors ${
                step >= s
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted bg-background text-muted-foreground"
              }`}
            >
              {s}
            </div>
            {s < 5 && (
              <div
                className={`h-0.5 w-12 mx-2 transition-colors ${
                  step > s ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Campaign Settings */}
      {step === 1 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">
              1. Настройка кампании
            </h3>
            <RadioGroup value={campaignType} onValueChange={setCampaignType}>
              <div className="flex items-center space-x-2 mb-3">
                <RadioGroupItem value="website" id="website" />
                <Label htmlFor="website" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Сайт
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="leadform" id="leadform" />
                <Label htmlFor="leadform" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Лид-формы
                </Label>
              </div>
            </RadioGroup>

            <div className="mt-6">
              <Label className="mb-2 block">Формат объявления</Label>
              <RadioGroup value={adFormat} onValueChange={setAdFormat}>
                <div className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value="banner" id="banner" />
                  <Label htmlFor="banner" className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Баннерная реклама
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="post" id="post" />
                  <Label htmlFor="post" className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    Пост в сообществе
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <Button onClick={() => setStep(2)} className="mt-6">
              Далее
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Audience */}
      {step === 2 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">
              2. Настройка Аудитории (г. Калуга)
            </h3>

            <div className="mb-6">
              <Label className="mb-3 block">Возраст</Label>
              <div className="flex flex-wrap gap-2">
                {ages.map((age) => (
                  <Badge
                    key={age}
                    variant={selectedAges.includes(age) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => handleAgeToggle(age)}
                  >
                    {age}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-3 block">Ключевые интересы</Label>
              <div className="space-y-2">
                {interests.map((interest) => (
                  <div key={interest} className="flex items-center space-x-2">
                    <Checkbox
                      id={interest}
                      checked={selectedInterests.includes(interest)}
                      onCheckedChange={() => handleInterestToggle(interest)}
                    />
                    <Label htmlFor={interest} className="cursor-pointer">
                      {interest}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button variant="outline" onClick={() => setStep(1)}>
                Назад
              </Button>
              <Button onClick={() => setStep(3)}>Далее</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Ad Creation */}
      {step === 3 && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">
                3. Создание Объявления
              </h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="headline">Заголовок</Label>
                  <Input
                    id="headline"
                    value={adHeadline}
                    onChange={(e) => setAdHeadline(e.target.value)}
                    placeholder="Введите заголовок..."
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {adHeadline.length}/60 символов
                  </p>
                </div>

                <div>
                  <Label htmlFor="text">Текст объявления</Label>
                  <Textarea
                    id="text"
                    value={adText}
                    onChange={(e) => setAdText(e.target.value)}
                    placeholder="Введите текст объявления..."
                    rows={4}
                    maxLength={220}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {adText.length}/220 символов
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Назад
                </Button>
                <Button
                  onClick={() => setStep(4)}
                  disabled={!adHeadline || !adText}
                >
                  Далее
                </Button>
              </div>
            </CardContent>
          </Card>

          <AdPreview headline={adHeadline} text={adText} />
        </div>
      )}

      {/* Step 4: Budget & Launch */}
      {step === 4 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">4. Бюджет и Запуск</h3>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">
                  Общий бюджет
                </p>
                <p className="text-2xl font-bold">{budget.toLocaleString()} ₽</p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">
                  Остаток средств
                </p>
                <p className="text-2xl font-bold text-success">
                  {budget.toLocaleString()} ₽
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Конверсии</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(3)}>
                Назад
              </Button>
              <Button onClick={handleLaunch} className="flex-1">
                Запустить кампанию
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Reports */}
      {step === 5 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-semibold mb-4">5. Отчеты</h3>

            {isLaunched ? (
              <div className="text-center py-8">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/10 mb-4">
                  <svg
                    className="h-8 w-8 text-success"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-lg font-semibold mb-2">
                  Кампания успешно запущена!
                </p>
                <p className="text-muted-foreground mb-6">
                  Статистика будет доступна через несколько часов
                </p>
                <Button onClick={() => setShowReport(true)}>
                  Сформировать отчет
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Запустите кампанию, чтобы увидеть отчеты</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <AdReportModal open={showReport} onOpenChange={setShowReport} />
    </div>
  );
};
