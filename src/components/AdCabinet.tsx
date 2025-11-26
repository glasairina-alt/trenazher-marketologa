import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Lock, Globe, ShoppingBag, Smartphone, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { StageType } from "@/types/stages";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import defaultLogo from "@/assets/default-ad-logo.png";
import { LockedSection } from "./LockedSection";

interface AdCabinetProps {
  currentStage: StageType;
  setCurrentStage: (stage: StageType) => void;
  isCabinetLocked: boolean;
  uploadedCreativeUrl: string;
  adData?: { headline: string; text: string };
  setAdData: (data: { headline: string; text: string }) => void;
  setActiveTab: (tab: string) => void;
  isPaidUser: boolean;
  onPurchaseRequest: () => void;
}

export const AdCabinet = ({
  currentStage,
  setCurrentStage,
  isCabinetLocked,
  uploadedCreativeUrl,
  adData = { headline: "", text: "" },
  setAdData,
  setActiveTab,
  isPaidUser,
  onPurchaseRequest,
}: AdCabinetProps) => {
  const { toast } = useToast();
  const [budget] = useState(15000);
  const [conversions, setConversions] = useState(0);
  const [impressions, setImpressions] = useState(10361);
  const [clicks, setClicks] = useState(41);
  const [remainingBudget, setRemainingBudget] = useState(10547);
  const [campaignLaunched, setCampaignLaunched] = useState(false);
  // Campaign settings
  const [campaignType, setCampaignType] = useState("");
  const [regions, setRegions] = useState<string[]>([]);
  const [expandAudience, setExpandAudience] = useState("");
  const [gender, setGender] = useState("");
  const [ageFrom, setAgeFrom] = useState("");
  const [ageTo, setAgeTo] = useState("");
  const [ageRating, setAgeRating] = useState("");
  const [socialAd, setSocialAd] = useState(false);
  
  // Ad creative
  const [headline, setHeadline] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [buttonLabel, setButtonLabel] = useState("");
  
  // Interests
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  // Collapsible sections
  const [sectionsOpen, setSectionsOpen] = useState({
    demographics: false,
    interests: false,
    audiences: false,
    devices: false,
  });

  const availableInterests = [
    "Путешествия",
    "Технологии",
    "Спорт",
    "Кулинария",
    "Мода",
    "Музыка",
    "Кино",
    "Книги",
    "Автомобили",
    "Недвижимость",
    "Образование",
    "Здоровье",
    "Бизнес",
    "Искусство",
    "Игры"
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const canLaunch =
    campaignType !== "" &&
    headline.trim() !== "" &&
    shortDescription.trim() !== "" &&
    siteUrl.trim() !== "" &&
    buttonLabel !== "" &&
    uploadedCreativeUrl !== "";

  const handleLaunch = () => {
    if (!canLaunch) {
      const missing: string[] = [];
      if (campaignType === "") missing.push("Тип кампании");
      if (headline.trim() === "") missing.push("Заголовок");
      if (shortDescription.trim() === "") missing.push("Короткое описание");
      if (siteUrl.trim() === "") missing.push("Ссылка на сайт");
      if (buttonLabel === "") missing.push("Надпись на кнопке");
      if (!uploadedCreativeUrl) missing.push("Логотип/креатив");

      toast({
        title: "Заполните обязательные поля",
        description: missing.length ? missing.join(", ") : "Проверьте форму",
        variant: "destructive",
      });
      return;
    }

    if (currentStage !== "STAGE_3_LAUNCH") {
      toast({
        title: "Действие недоступно",
        description: "К запуску перейдем на соответствующем шаге сценария",
        variant: "destructive",
      });
      return;
    }

    setCampaignLaunched(true);
    setAdData({ headline, text: shortDescription });
    
    toast({
      title: "Реклама запущена! 🚀",
      description: "Поздравляю! Вы запустили рекламную кампанию.",
      duration: 5000,
    });

    setTimeout(() => {
      setCurrentStage("STAGE_3_LAUNCH_WAIT_USER");
      setActiveTab("chat");
    }, 1500);
  };

  useEffect(() => {
    // Автоматически устанавливаем campaignLaunched если мы на этапах после запуска
    if (
      currentStage === "STAGE_3_LAUNCH_WAIT_USER" ||
      currentStage === "STAGE_3_WAIT_CLIENT_RESPONSE" ||
      currentStage === "STAGE_4_PANIC" ||
      currentStage === "STAGE_4_WAIT_RESOLUTION" ||
      currentStage === "STAGE_5_ORDERS_COMING" ||
      currentStage === "STAGE_5_REPORT" ||
      currentStage === "STAGE_6_REPORT_WAIT" ||
      currentStage === "STAGE_7_REPORT_DATA" ||
      currentStage === "STAGE_7_REPORT_DATA_2" ||
      currentStage === "STAGE_8_REPORT_SUBMIT" ||
      currentStage === "STAGE_8_REPORT_SENT" ||
      currentStage === "STAGE_9_EXPLAIN" ||
      currentStage === "STAGE_10_SETTINGS" ||
      currentStage === "FINAL"
    ) {
      setCampaignLaunched(true);
    }

    // Устанавливаем начальную статистику на STAGE_5_ORDERS_COMING
    if (currentStage === "STAGE_5_ORDERS_COMING") {
      setConversions(2);
      setImpressions(10361);
      setClicks(41);
      setRemainingBudget(10547);
    }
    
    // Обновляем финальную статистику сразу после "Наступило 15 февраля..." (STAGE_5_REPORT+)
    if (
      currentStage === "STAGE_5_REPORT" ||
      currentStage === "STAGE_6_REPORT_WAIT" ||
      currentStage === "STAGE_7_REPORT_DATA" ||
      currentStage === "STAGE_7_REPORT_DATA_2" ||
      currentStage === "STAGE_8_REPORT_SUBMIT" ||
      currentStage === "STAGE_8_REPORT_SENT" ||
      currentStage === "STAGE_9_EXPLAIN" ||
      currentStage === "STAGE_10_SETTINGS" ||
      currentStage === "FINAL"
    ) {
      setConversions(23);
      setImpressions(110867);
      setClicks(410);
      setRemainingBudget(0);
    }
  }, [currentStage]);

  const toggleSection = (section: keyof typeof sectionsOpen) => {
    setSectionsOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const campaignTypes = [
    { 
      id: "site", 
      icon: Globe, 
      title: "Сайт", 
      description: "Конверсии и переходы на ваш сайт" 
    },
    { 
      id: "catalog", 
      icon: ShoppingBag, 
      title: "Каталог товаров", 
      description: "Продвижение товаров или услуг из каталога" 
    },
    { 
      id: "app", 
      icon: Smartphone, 
      title: "Мобильное приложение", 
      description: "Установки приложений и конверсии внутри него" 
    },
    { 
      id: "leads", 
      icon: FileText, 
      title: "Лид-формы и опросы", 
      description: "Сбор лидов для бизнеса или обратной связи" 
    },
  ];

  return (
    <Card className="relative overflow-hidden">
      {isCabinetLocked && (
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-10 flex items-start justify-center rounded-lg p-4 pt-8 sm:pt-12">
          <div className="text-center">
            <Lock className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-3 sm:mb-4" />
            <p className="text-base sm:text-lg font-semibold text-foreground">
              Рекламный кабинет заблокирован
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              Следуйте инструкциям в чате
            </p>
          </div>
        </div>
      )}

      <CardHeader className="bg-gradient-to-r from-[#4680C2] to-[#5181B8] text-white border-b-0 p-3 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <CardTitle className="flex items-center gap-2 text-white text-base sm:text-lg">
              <svg className="h-5 w-5 sm:h-6 sm:w-6 shrink-0" viewBox="0 0 48 48" fill="currentColor">
                <path d="M24 4.32c-10.94 0-19.81 8.88-19.81 19.81 0 10.94 8.87 19.81 19.81 19.81 10.93 0 19.81-8.87 19.81-19.81 0-10.93-8.88-19.81-19.81-19.81zM31.87 27.64c.53 1.49-1.09 2.77-2.45 1.86l-7.13-4.82c-.64-.43-1.03-1.15-1.03-1.92v-8.38c0-.85.69-1.54 1.54-1.54s1.54.69 1.54 1.54v7.58l6.53 4.42c.45.31.72.82.72 1.37 0 .35-.11.68-.3.96-.19.29-.42.53-.72.68z"/>
              </svg>
              <span className="truncate">Рекламный кабинет</span>
            </CardTitle>
            <p className="text-white/90 text-xs sm:text-sm mt-1">VK Реклама</p>
          </div>
          <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/30 hover:bg-white/20 text-xs sm:text-sm shrink-0 h-8 sm:h-9 px-2 sm:px-4">
            + СИМУЛЯТОР
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 bg-[#F0F2F5]">
        {/* Steps indicator */}
        <div className="flex items-center gap-1 sm:gap-2 p-3 sm:p-4 bg-white border-b border-[#E7E8EC] overflow-x-auto">
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-6 h-6 rounded-full bg-[#4680C2] text-white flex items-center justify-center text-xs sm:text-sm font-medium shrink-0">
              1
            </div>
            <span className="text-xs sm:text-sm font-medium whitespace-nowrap">Настройка кампании</span>
          </div>
          <span className="text-[#AEB7C2] text-xs sm:text-sm">—</span>
          <div className="flex items-center gap-1 sm:gap-2 opacity-50">
            <div className="w-6 h-6 rounded-full bg-[#E7E8EC] text-[#AEB7C2] flex items-center justify-center text-xs sm:text-sm font-medium shrink-0">
              2
            </div>
            <span className="text-xs sm:text-sm text-[#AEB7C2] whitespace-nowrap">Группы объявлений</span>
          </div>
          <span className="text-[#AEB7C2] text-xs sm:text-sm">—</span>
          <div className="flex items-center gap-1 sm:gap-2 opacity-50">
            <div className="w-6 h-6 rounded-full bg-[#E7E8EC] text-[#AEB7C2] flex items-center justify-center text-xs sm:text-sm font-medium shrink-0">
              3
            </div>
            <span className="text-xs sm:text-sm text-[#AEB7C2] whitespace-nowrap">Объявления</span>
          </div>
        </div>

        {/* Campaign section */}
        <div className="p-2 sm:p-4 space-y-3 sm:space-y-4">
          <Card className="border-[#E7E8EC] bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm sm:text-base font-medium">Кампания</CardTitle>
                <Button variant="ghost" size="sm" className="h-6 sm:h-8 text-[#4680C2]">
                  <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="actions" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-[#F0F2F5]">
                  <TabsTrigger value="actions" className="text-xs sm:text-sm px-1 sm:px-3">
                    <span className="hidden sm:inline">Целевые действия</span>
                    <span className="sm:hidden">Действия</span>
                  </TabsTrigger>
                  <TabsTrigger value="awareness" className="text-xs sm:text-sm px-1 sm:px-3">
                    <span className="hidden sm:inline">Узнаваемость и охват</span>
                    <span className="sm:hidden">Охват</span>
                  </TabsTrigger>
                  <TabsTrigger value="smart" className="text-xs sm:text-sm px-1 sm:px-3">
                    <span className="hidden sm:inline">✨ Смарт-кампания</span>
                    <span className="sm:hidden">✨ Смарт</span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="actions" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
                  <div>
                    <Label className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 block">
                      Что будете рекламировать? <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {campaignTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <button
                            key={type.id}
                            onClick={() => setCampaignType(type.id)}
                            className={`p-3 sm:p-4 rounded-lg border-2 text-left transition-all hover:border-[#4680C2] ${
                              campaignType === type.id
                                ? "border-[#4680C2] bg-[#E8F0FE]"
                                : "border-[#E7E8EC] bg-white"
                            }`}
                          >
                            <Icon className="h-4 w-4 sm:h-5 sm:w-5 mb-2" />
                            <div className="font-medium text-xs sm:text-sm">{type.title}</div>
                            <div className="text-xs text-[#818C99] mt-1 hidden sm:block">
                              {type.description}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Regions */}
          <Card className="border-[#E7E8EC] bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm sm:text-base font-medium">
                Регионы показа <span className="text-red-500">*</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-xs sm:text-sm text-[#818C99]">Быстрый выбор</div>
                <div className="flex gap-1 sm:gap-2 flex-wrap">
                  {["Россия", "Москва", "Санкт-Петербург"].map((region) => (
                    <Button
                      key={region}
                      variant={regions.includes(region) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setRegions(prev =>
                          prev.includes(region)
                            ? prev.filter(r => r !== region)
                            : [...prev, region]
                        );
                      }}
                      className={`text-xs sm:text-sm px-2 sm:px-3 ${regions.includes(region) ? "bg-[#4680C2] text-white" : ""}`}
                    >
                      {region}
                    </Button>
                  ))}
                </div>
                <Input
                  placeholder="Страна, регион или город"
                  className="bg-[#F0F2F5] border-[#E7E8EC] text-sm"
                />
              </div>
            </CardContent>
          </Card>

          {/* Audience expansion */}
          <Card className="border-[#E7E8EC] bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm sm:text-base font-medium">
                Расширение аудитории
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={expandAudience} onValueChange={setExpandAudience}>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="recommended" id="recommended" className="mt-0.5" />
                  <div className="space-y-1">
                    <Label htmlFor="recommended" className="font-normal cursor-pointer text-xs sm:text-sm">
                      Расширить аудиторию <span className="text-[#4680C2]">(рекомендуется)</span>
                    </Label>
                    <p className="text-xs text-[#818C99]">
                      Алгоритм подберет аудиторию, которые помогут увеличить эффективность рекламы
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Demographics */}
          {isPaidUser ? (
            <Card className="border-[#E7E8EC] bg-white">
              <CardHeader 
                className="pb-3 cursor-pointer hover:bg-[#F9FAFB]"
                onClick={() => toggleSection('demographics')}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm sm:text-base font-medium">Демография</CardTitle>
                  {sectionsOpen.demographics ? (
                    <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-[#4680C2]" />
                  ) : (
                    <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-[#4680C2]" />
                  )}
                </div>
              </CardHeader>
              {sectionsOpen.demographics && (
                <CardContent className="space-y-3 sm:space-y-4">
                  <div>
                    <Label className="text-xs sm:text-sm mb-2 block">Пол</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger className="bg-[#F0F2F5] border-[#E7E8EC] text-sm">
                        <SelectValue placeholder="Любой" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Любой</SelectItem>
                        <SelectItem value="male">Мужской</SelectItem>
                        <SelectItem value="female">Женский</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs sm:text-sm mb-2 block">Возраст</Label>
                    <div className="flex gap-2">
                      <Select value={ageFrom} onValueChange={setAgeFrom}>
                        <SelectTrigger className="bg-[#F0F2F5] border-[#E7E8EC] text-sm">
                          <SelectValue placeholder="От" />
                        </SelectTrigger>
                        <SelectContent>
                          {[12, 14, 16, 18, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70].map(age => (
                            <SelectItem key={age} value={age.toString()}>{age}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={ageTo} onValueChange={setAgeTo}>
                        <SelectTrigger className="bg-[#F0F2F5] border-[#E7E8EC] text-sm">
                          <SelectValue placeholder="До" />
                        </SelectTrigger>
                        <SelectContent>
                          {[18, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75].map(age => (
                            <SelectItem key={age} value={age.toString()}>{age}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs sm:text-sm mb-2 block">Возрастная маркировка</Label>
                    <Select value={ageRating} onValueChange={setAgeRating}>
                      <SelectTrigger className="bg-[#F0F2F5] border-[#E7E8EC] text-sm">
                        <SelectValue placeholder="Не выбрана" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0+">0+</SelectItem>
                        <SelectItem value="6+">6+</SelectItem>
                        <SelectItem value="12+">12+</SelectItem>
                        <SelectItem value="16+">16+</SelectItem>
                        <SelectItem value="18+">18+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="social-ad" 
                      checked={socialAd}
                      onCheckedChange={(checked) => setSocialAd(checked as boolean)}
                    />
                    <Label htmlFor="social-ad" className="text-xs sm:text-sm font-normal cursor-pointer">
                      Социальная реклама
                    </Label>
                  </div>
                </CardContent>
              )}
            </Card>
          ) : (
            <LockedSection onClick={onPurchaseRequest}>
              <Card className="border-[#E7E8EC] bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm sm:text-base font-medium">Демография</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="h-10 bg-[#F0F2F5] rounded"></div>
                  <div className="h-10 bg-[#F0F2F5] rounded"></div>
                </CardContent>
              </Card>
            </LockedSection>
          )}

          {/* Interests */}
          {isPaidUser ? (
            <Card className="border-[#E7E8EC] bg-white">
              <CardHeader 
                className="pb-3 cursor-pointer hover:bg-[#F9FAFB]"
                onClick={() => toggleSection('interests')}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">
                    Интересы и поведение аудитории
                  </CardTitle>
                  {sectionsOpen.interests ? (
                    <ChevronUp className="h-5 w-5 text-[#4680C2]" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-[#4680C2]" />
                  )}
                </div>
                <p className="text-sm text-[#818C99]">
                  {selectedInterests.length > 0 
                    ? `Выбрано: ${selectedInterests.length}` 
                    : "Не выбран"}
                </p>
              </CardHeader>
              {sectionsOpen.interests && (
                <CardContent>
                  <div className="space-y-2">
                    <Input
                      placeholder="Поиск интересов..."
                      className="bg-[#F0F2F5] border-[#E7E8EC] mb-3"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      {availableInterests.map((interest) => (
                        <div key={interest} className="flex items-center space-x-2">
                          <Checkbox
                            id={`interest-${interest}`}
                            checked={selectedInterests.includes(interest)}
                            onCheckedChange={() => toggleInterest(interest)}
                          />
                          <Label
                            htmlFor={`interest-${interest}`}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {interest}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ) : (
            <LockedSection onClick={onPurchaseRequest}>
              <Card className="border-[#E7E8EC] bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-medium">
                    Интересы и поведение аудитории
                  </CardTitle>
                  <p className="text-sm text-[#818C99]">Не выбран</p>
                </CardHeader>
                <CardContent>
                  <div className="h-32 bg-[#F0F2F5] rounded"></div>
                </CardContent>
              </Card>
            </LockedSection>
          )}

          {/* Ad Creative */}
          {!isPaidUser ? (
            <LockedSection onClick={onPurchaseRequest}>
              <Card className="border-[#E7E8EC] bg-white">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm sm:text-base font-medium">Объявление</CardTitle>
                    <Button variant="ghost" size="sm" className="h-6 sm:h-8 text-[#4680C2]">
                      <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                      </svg>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-3 sm:space-y-4">
                      {/* Logo upload */}
                      <div>
                        <Label className="text-xs sm:text-sm mb-2 block">
                          Логотип <span className="text-red-500">*</span>
                        </Label>
                        <div className="border-2 border-dashed border-[#E7E8EC] rounded-lg p-4 sm:p-6 text-center bg-[#F9FAFB]">
                          {uploadedCreativeUrl ? (
                            <img 
                              src={uploadedCreativeUrl} 
                              alt="Logo" 
                              className="max-h-16 sm:max-h-20 mx-auto rounded"
                            />
                          ) : (
                            <div>
                              <Button variant="link" className="text-[#4680C2] text-xs sm:text-sm">
                                + Выбрать логотип
                              </Button>
                              <p className="text-xs text-[#818C99] mt-1">
                                Минимум 100×100 пикселей • JPEG, PNG или GIF
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Headline */}
                      <div>
                        <Label className="text-xs sm:text-sm mb-2 block">
                          Заголовок <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Input
                            value={headline}
                            onChange={(e) => setHeadline(e.target.value)}
                            placeholder="Не выбран"
                            className="bg-[#F0F2F5] border-[#E7E8EC] text-sm pr-16"
                            maxLength={40}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#818C99]">
                            {headline.length} / 40
                          </span>
                        </div>
                      </div>

                      {/* Short description */}
                      <div>
                        <Label className="text-xs sm:text-sm mb-2 block">
                          Короткое описание <span className="text-red-500">*</span>
                        </Label>
                        <div className="relative">
                          <Textarea
                            value={shortDescription}
                            onChange={(e) => setShortDescription(e.target.value)}
                            placeholder=""
                            className="bg-[#F0F2F5] border-[#E7E8EC] min-h-[80px] text-sm"
                            maxLength={90}
                          />
                          <span className="absolute right-3 bottom-3 text-xs text-[#818C99]">
                            {shortDescription.length} / 90
                          </span>
                        </div>
                      </div>

                      {/* Long description */}
                      <div>
                        <Label className="text-xs sm:text-sm mb-2 block">Длинное описание</Label>
                        <div className="relative">
                          <Textarea
                            value={longDescription}
                            onChange={(e) => setLongDescription(e.target.value)}
                            placeholder=""
                            className="bg-[#F0F2F5] border-[#E7E8EC] min-h-[120px] text-sm"
                            maxLength={500}
                          />
                          <span className="absolute right-3 bottom-3 text-xs text-[#818C99]">
                            {longDescription.length} / 500
                          </span>
                        </div>
                      </div>

                      {/* Call to action */}
                      <div>
                        <Label className="text-xs sm:text-sm mb-2 block">
                          Текст рядом с кнопкой <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          value={buttonText}
                          onChange={(e) => setButtonText(e.target.value)}
                          placeholder="Не выбран"
                          className="bg-[#F0F2F5] border-[#E7E8EC] text-sm"
                          maxLength={80}
                        />
                      </div>

                      {/* Website URL */}
                      <div>
                        <Label className="text-xs sm:text-sm mb-2 block">
                          Ссылка на сайт <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          value={siteUrl}
                          onChange={(e) => setSiteUrl(e.target.value)}
                          placeholder="mysite.com/"
                          className="bg-[#F0F2F5] border-[#E7E8EC] text-sm"
                        />
                      </div>

                      {/* Button label */}
                      <div>
                        <Label className="text-xs sm:text-sm mb-2 block">
                          Надпись на кнопке <span className="text-red-500">*</span>
                        </Label>
                        <Select value={buttonLabel} onValueChange={setButtonLabel}>
                          <SelectTrigger className="bg-[#F0F2F5] border-[#E7E8EC] text-sm">
                            <SelectValue placeholder="Не выбрано" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="learn">Узнать подробнее</SelectItem>
                            <SelectItem value="go">Перейти</SelectItem>
                            <SelectItem value="order">Заказать</SelectItem>
                            <SelectItem value="buy">Купить</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Preview section */}
                    <div>
                      <Label className="text-xs sm:text-sm mb-2 block">Предпросмотр</Label>
                      <Tabs defaultValue="feed" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 bg-[#F0F2F5] h-auto">
                          <TabsTrigger 
                            value="feed"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#4680C2] data-[state=active]:bg-transparent text-xs sm:text-sm px-2 sm:px-4"
                          >
                            Лента
                          </TabsTrigger>
                          <TabsTrigger 
                            value="story"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#4680C2] data-[state=active]:bg-transparent text-xs sm:text-sm px-2 sm:px-4"
                          >
                            <span className="hidden sm:inline">В сторис</span>
                            <span className="sm:hidden">Сторис</span>
                          </TabsTrigger>
                          <TabsTrigger 
                            value="fullscreen"
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#4680C2] data-[state=active]:bg-transparent text-xs sm:text-sm px-2 sm:px-4"
                          >
                            <span className="hidden sm:inline">Полноэкранный блок</span>
                            <span className="sm:hidden">Полный блок</span>
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="feed" className="p-2 sm:p-4 m-0">
                          <div className="bg-white rounded-lg border border-[#E7E8EC] overflow-hidden">
                            {/* Header with logo and menu */}
                            <div className="flex items-center justify-between p-2 sm:p-3 border-b border-[#E7E8EC]">
                              <div className="flex items-center gap-2 min-w-0">
                                <img 
                                  src={uploadedCreativeUrl || defaultLogo} 
                                  alt="Logo" 
                                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shrink-0"
                                />
                                <div className="min-w-0">
                                  <div className="text-xs sm:text-sm font-medium truncate">{headline || "Заголовок"}</div>
                                  <div className="text-xs text-[#818C99]">Реклама</div>
                                </div>
                              </div>
                              <button className="text-[#818C99] shrink-0 ml-2">⋯</button>
                            </div>
                            
                            {/* Creative image */}
                            {uploadedCreativeUrl ? (
                              <img 
                                src={uploadedCreativeUrl} 
                                alt="Preview" 
                                className="w-full"
                              />
                            ) : (
                              <div className="aspect-video bg-[#F0F2F5] flex items-center justify-center p-2">
                                <p className="text-xs sm:text-sm text-[#818C99] text-center">ЗАГРУЗИТЕ ИЗОБРАЖЕНИЕ ИЛИ ВИДЕО 1:1</p>
                              </div>
                            )}
                            
                            {/* Description and button */}
                            <div className="p-2 sm:p-3 space-y-2 sm:space-y-3">
                              <div className="text-xs sm:text-sm break-words">{shortDescription || "Короткое описание"}</div>
                              {buttonLabel && (
                                <Button 
                                  className="w-full bg-[#4680C2] hover:bg-[#4680C2]/90 text-white text-xs sm:text-sm h-8 sm:h-10"
                                >
                                  {buttonLabel === "learn" && "Узнать подробнее"}
                                  {buttonLabel === "go" && "Перейти"}
                                  {buttonLabel === "order" && "Заказать"}
                                  {buttonLabel === "buy" && "Купить"}
                                </Button>
                              )}
                            </div>
                          </div>
                        </TabsContent>
                        <TabsContent value="story" className="p-4 m-0">
                          <div className="text-center text-sm text-[#818C99]">
                            Предпросмотр ленты
                          </div>
                        </TabsContent>
                        <TabsContent value="fullscreen" className="p-4 m-0">
                          <div className="text-center text-sm text-[#818C99]">
                            Предпросмотр полноэкранного блока
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </LockedSection>
          ) : (
            <Card className="border-[#E7E8EC] bg-white">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm sm:text-base font-medium">Объявление</CardTitle>
                  <Button variant="ghost" size="sm" className="h-6 sm:h-8 text-[#4680C2]">
                    <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-3 sm:space-y-4">
                    {/* Logo upload */}
                    <div>
                      <Label className="text-xs sm:text-sm mb-2 block">
                        Логотип <span className="text-red-500">*</span>
                      </Label>
                      <div className="border-2 border-dashed border-[#E7E8EC] rounded-lg p-4 sm:p-6 text-center bg-[#F9FAFB]">
                        {uploadedCreativeUrl ? (
                          <img 
                            src={uploadedCreativeUrl} 
                            alt="Logo" 
                            className="max-h-16 sm:max-h-20 mx-auto rounded"
                          />
                        ) : (
                          <div>
                            <Button variant="link" className="text-[#4680C2] text-xs sm:text-sm">
                              + Выбрать логотип
                            </Button>
                            <p className="text-xs text-[#818C99] mt-1">
                              Минимум 100×100 пикселей • JPEG, PNG или GIF
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Headline */}
                    <div>
                      <Label className="text-xs sm:text-sm mb-2 block">
                        Заголовок <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          value={headline}
                          onChange={(e) => setHeadline(e.target.value)}
                          placeholder="Не выбран"
                          className="bg-[#F0F2F5] border-[#E7E8EC] text-sm pr-16"
                          maxLength={40}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#818C99]">
                          {headline.length} / 40
                        </span>
                      </div>
                    </div>

                    {/* Short description */}
                    <div>
                      <Label className="text-xs sm:text-sm mb-2 block">
                        Короткое описание <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Textarea
                          value={shortDescription}
                          onChange={(e) => setShortDescription(e.target.value)}
                          placeholder=""
                          className="bg-[#F0F2F5] border-[#E7E8EC] min-h-[80px] text-sm"
                          maxLength={90}
                        />
                        <span className="absolute right-3 bottom-3 text-xs text-[#818C99]">
                          {shortDescription.length} / 90
                        </span>
                      </div>
                    </div>

                    {/* Long description */}
                    <div>
                      <Label className="text-xs sm:text-sm mb-2 block">Длинное описание</Label>
                      <div className="relative">
                        <Textarea
                          value={longDescription}
                          onChange={(e) => setLongDescription(e.target.value)}
                          placeholder=""
                          className="bg-[#F0F2F5] border-[#E7E8EC] min-h-[120px] text-sm"
                          maxLength={500}
                        />
                        <span className="absolute right-3 bottom-3 text-xs text-[#818C99]">
                          {longDescription.length} / 500
                        </span>
                      </div>
                    </div>

                    {/* Call to action */}
                    <div>
                      <Label className="text-xs sm:text-sm mb-2 block">
                        Текст рядом с кнопкой <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={buttonText}
                        onChange={(e) => setButtonText(e.target.value)}
                        placeholder="Не выбран"
                        className="bg-[#F0F2F5] border-[#E7E8EC] text-sm"
                        maxLength={80}
                      />
                    </div>

                    {/* Website URL */}
                    <div>
                      <Label className="text-xs sm:text-sm mb-2 block">
                        Ссылка на сайт <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={siteUrl}
                        onChange={(e) => setSiteUrl(e.target.value)}
                        placeholder="mysite.com/"
                        className="bg-[#F0F2F5] border-[#E7E8EC] text-sm"
                      />
                    </div>

                    {/* Button label */}
                    <div>
                      <Label className="text-xs sm:text-sm mb-2 block">
                        Надпись на кнопке <span className="text-red-500">*</span>
                      </Label>
                      <Select value={buttonLabel} onValueChange={setButtonLabel}>
                        <SelectTrigger className="bg-[#F0F2F5] border-[#E7E8EC] text-sm">
                          <SelectValue placeholder="Не выбрано" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="learn">Узнать подробнее</SelectItem>
                          <SelectItem value="go">Перейти</SelectItem>
                          <SelectItem value="order">Заказать</SelectItem>
                          <SelectItem value="buy">Купить</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Preview section */}
                  <div>
                    <Label className="text-xs sm:text-sm mb-2 block">Предпросмотр</Label>
                    <Tabs defaultValue="feed" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 bg-[#F0F2F5] h-auto">
                        <TabsTrigger 
                          value="feed"
                          className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#4680C2] data-[state=active]:bg-transparent text-xs sm:text-sm px-2 sm:px-4"
                        >
                          Лента
                        </TabsTrigger>
                        <TabsTrigger 
                          value="story"
                          className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#4680C2] data-[state=active]:bg-transparent text-xs sm:text-sm px-2 sm:px-4"
                        >
                          <span className="hidden sm:inline">В сторис</span>
                          <span className="sm:hidden">Сторис</span>
                        </TabsTrigger>
                        <TabsTrigger 
                          value="fullscreen"
                          className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#4680C2] data-[state=active]:bg-transparent text-xs sm:text-sm px-2 sm:px-4"
                        >
                          <span className="hidden sm:inline">Полноэкранный блок</span>
                          <span className="sm:hidden">Полный блок</span>
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="feed" className="p-2 sm:p-4 m-0">
                        <div className="bg-white rounded-lg border border-[#E7E8EC] overflow-hidden">
                          {/* Header with logo and menu */}
                          <div className="flex items-center justify-between p-2 sm:p-3 border-b border-[#E7E8EC]">
                            <div className="flex items-center gap-2 min-w-0">
                              <img 
                                src={uploadedCreativeUrl || defaultLogo} 
                                alt="Logo" 
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="text-xs sm:text-sm font-medium truncate">{headline || "Заголовок"}</div>
                                <div className="text-xs text-[#818C99]">Реклама</div>
                              </div>
                            </div>
                            <button className="text-[#818C99] shrink-0 ml-2">⋯</button>
                          </div>
                          
                          {/* Creative image */}
                          {uploadedCreativeUrl ? (
                            <img 
                              src={uploadedCreativeUrl} 
                              alt="Preview" 
                              className="w-full"
                            />
                          ) : (
                            <div className="aspect-video bg-[#F0F2F5] flex items-center justify-center p-2">
                              <p className="text-xs sm:text-sm text-[#818C99] text-center">ЗАГРУЗИТЕ ИЗОБРАЖЕНИЕ ИЛИ ВИДЕО 1:1</p>
                            </div>
                          )}
                          
                          {/* Description and button */}
                          <div className="p-2 sm:p-3 space-y-2 sm:space-y-3">
                            <div className="text-xs sm:text-sm break-words">{shortDescription || "Короткое описание"}</div>
                            {buttonLabel && (
                              <Button 
                                className="w-full bg-[#4680C2] hover:bg-[#4680C2]/90 text-white text-xs sm:text-sm h-8 sm:h-10"
                              >
                                {buttonLabel === "learn" && "Узнать подробнее"}
                                {buttonLabel === "go" && "Перейти"}
                                {buttonLabel === "order" && "Заказать"}
                                {buttonLabel === "buy" && "Купить"}
                              </Button>
                            )}
                          </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="story" className="p-4 m-0">
                        <div className="text-center text-sm text-[#818C99]">
                          Предпросмотр ленты
                        </div>
                      </TabsContent>
                      <TabsContent value="fullscreen" className="p-4 m-0">
                        <div className="text-center text-sm text-[#818C99]">
                          Предпросмотр полноэкранного блока
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Launch section */}
          <Card className="border-[#E7E8EC] bg-white">
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-[#818C99]">Бюджет кампании</p>
                  <p className="text-xl sm:text-2xl font-semibold">{budget.toLocaleString('ru-RU')} ₽</p>
                </div>
                <Button
                  onClick={handleLaunch}
                  disabled={campaignLaunched}
                  className="bg-[#4680C2] hover:bg-[#3d6fa8] text-white px-4 sm:px-8 w-full sm:w-auto text-sm sm:text-base"
                  data-testid="button-launch-campaign"
                >
                  {campaignLaunched ? "Кампания запущена" : "Запустить кампанию"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Statistics section */}
          {campaignLaunched && (
            <Card className="border-[#E7E8EC] bg-white">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm sm:text-base font-medium">Статистика кампании</CardTitle>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                    Активна
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  <div className="p-3 bg-[#F0F2F5] rounded-lg">
                    <p className="text-xs sm:text-sm text-[#818C99] mb-1">Остаток бюджета</p>
                    <p className="text-xl sm:text-2xl font-semibold">
                      {remainingBudget.toLocaleString("ru-RU")} ₽
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm text-[#818C99]">Показы</p>
                      <p className="text-base sm:text-xl font-semibold">{impressions.toLocaleString("ru-RU")}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm text-[#818C99]">Клики</p>
                      <p className="text-base sm:text-xl font-semibold">{clicks.toLocaleString("ru-RU")}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm text-[#818C99]">Конверсии</p>
                      <p className="text-base sm:text-xl font-semibold">{conversions}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reports section */}
          {campaignLaunched && (currentStage === "STAGE_5_ORDERS_COMING" || currentStage === "STAGE_5_REPORT" || currentStage === "STAGE_6_REPORT_WAIT" || currentStage === "STAGE_7_REPORT_DATA" || currentStage === "STAGE_7_REPORT_DATA_2" || currentStage === "STAGE_8_REPORT_SUBMIT" || currentStage === "STAGE_8_REPORT_SENT" || currentStage === "STAGE_9_EXPLAIN" || currentStage === "STAGE_10_SETTINGS" || currentStage === "FINAL") && (
            <Card className="border-[#E7E8EC] bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm sm:text-base font-medium">Отчеты</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentStage === "STAGE_5_ORDERS_COMING" && (
                    <div className="p-2 sm:p-3 bg-chat-system/10 border border-chat-system/20 rounded-lg mb-3">
                      <p className="text-xs sm:text-sm text-foreground">
                        💡 <strong>Подсказка:</strong> Конверсии появились! Вернитесь в чат и ответьте клиенту.
                      </p>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm text-[#818C99]">Конверсии</p>
                      <p className="text-xl sm:text-2xl font-semibold">{conversions}</p>
                    </div>
                    <Button
                      onClick={() => setActiveTab("report")}
                      className="bg-[#4680C2] hover:bg-[#3d6fa8] text-white w-full sm:w-auto text-xs sm:text-sm"
                      disabled={currentStage !== "STAGE_5_REPORT" && currentStage !== "STAGE_6_REPORT_WAIT" && currentStage !== "STAGE_7_REPORT_DATA" && currentStage !== "STAGE_7_REPORT_DATA_2"}
                    >
                      Сформировать отчет
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
