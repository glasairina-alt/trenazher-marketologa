import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Lock, Globe, ShoppingBag, Smartphone, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { AdReportModal } from "@/components/AdReportModal";
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
  
  // Collapsible sections
  const [sectionsOpen, setSectionsOpen] = useState({
    demographics: false,
    interests: false,
    audiences: false,
    devices: false,
  });

  const canLaunch =
    campaignType !== "" &&
    regions.length > 0 &&
    headline.trim() !== "" &&
    shortDescription.trim() !== "" &&
    siteUrl.trim() !== "" &&
    uploadedCreativeUrl !== "";

  const handleLaunch = () => {
    if (!canLaunch) {
      let errorMsg = "Заполните все обязательные поля кампании. ";
      
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
    setAdData({ headline, text: shortDescription });
    
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

      <CardHeader className="bg-gradient-to-r from-[#4680C2] to-[#5181B8] text-white border-b-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-white">
              <svg className="h-6 w-6" viewBox="0 0 48 48" fill="currentColor">
                <path d="M24 4.32c-10.94 0-19.81 8.88-19.81 19.81 0 10.94 8.87 19.81 19.81 19.81 10.93 0 19.81-8.87 19.81-19.81 0-10.93-8.88-19.81-19.81-19.81zM31.87 27.64c.53 1.49-1.09 2.77-2.45 1.86l-7.13-4.82c-.64-.43-1.03-1.15-1.03-1.92v-8.38c0-.85.69-1.54 1.54-1.54s1.54.69 1.54 1.54v7.58l6.53 4.42c.45.31.72.82.72 1.37 0 .35-.11.68-.3.96-.19.29-.42.53-.72.68z"/>
              </svg>
              Рекламный кабинет
            </CardTitle>
            <p className="text-white/90 text-sm mt-1">VK Реклама</p>
          </div>
          <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
            + АВТОНОМНАЯ
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 bg-[#F0F2F5]">
        {/* Steps indicator */}
        <div className="flex items-center gap-2 p-4 bg-white border-b border-[#E7E8EC]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#4680C2] text-white flex items-center justify-center text-sm font-medium">
              1
            </div>
            <span className="text-sm font-medium">Настройка кампании</span>
          </div>
          <span className="text-[#AEB7C2]">—</span>
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-6 h-6 rounded-full bg-[#E7E8EC] text-[#AEB7C2] flex items-center justify-center text-sm font-medium">
              2
            </div>
            <span className="text-sm text-[#AEB7C2]">Группы объявлений</span>
          </div>
          <span className="text-[#AEB7C2]">—</span>
          <div className="flex items-center gap-2 opacity-50">
            <div className="w-6 h-6 rounded-full bg-[#E7E8EC] text-[#AEB7C2] flex items-center justify-center text-sm font-medium">
              3
            </div>
            <span className="text-sm text-[#AEB7C2]">Объявления</span>
          </div>
        </div>

        {/* Campaign section */}
        <div className="p-4 space-y-4">
          <Card className="border-[#E7E8EC] bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">Кампания</CardTitle>
                <Button variant="ghost" size="sm" className="h-8 text-[#4680C2]">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="actions" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-[#F0F2F5]">
                  <TabsTrigger value="actions" className="text-sm">
                    Целевые действия
                  </TabsTrigger>
                  <TabsTrigger value="awareness" className="text-sm">
                    Узнаваемость и охват
                  </TabsTrigger>
                  <TabsTrigger value="smart" className="text-sm">
                    ✨ Смарт-кампания
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="actions" className="space-y-4 mt-4">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      Что будете рекламировать? <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {campaignTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <button
                            key={type.id}
                            onClick={() => setCampaignType(type.id)}
                            className={`p-4 rounded-lg border-2 text-left transition-all hover:border-[#4680C2] ${
                              campaignType === type.id
                                ? "border-[#4680C2] bg-[#E8F0FE]"
                                : "border-[#E7E8EC] bg-white"
                            }`}
                          >
                            <Icon className="h-5 w-5 mb-2" />
                            <div className="font-medium text-sm">{type.title}</div>
                            <div className="text-xs text-[#818C99] mt-1">
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
              <CardTitle className="text-base font-medium">
                Регионы показа <span className="text-red-500">*</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-[#818C99]">Быстрый выбор</div>
                <div className="flex gap-2">
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
                      className={regions.includes(region) ? "bg-[#4680C2] text-white" : ""}
                    >
                      {region}
                    </Button>
                  ))}
                </div>
                <Input
                  placeholder="Страна, регион или город"
                  className="bg-[#F0F2F5] border-[#E7E8EC]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Audience expansion */}
          <Card className="border-[#E7E8EC] bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">
                Расширение аудитории
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={expandAudience} onValueChange={setExpandAudience}>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="recommended" id="recommended" />
                  <div className="space-y-1">
                    <Label htmlFor="recommended" className="font-normal cursor-pointer">
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
          <Card className="border-[#E7E8EC] bg-white">
            <CardHeader 
              className="pb-3 cursor-pointer hover:bg-[#F9FAFB]"
              onClick={() => toggleSection('demographics')}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">Демография</CardTitle>
                {sectionsOpen.demographics ? (
                  <ChevronUp className="h-5 w-5 text-[#4680C2]" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-[#4680C2]" />
                )}
              </div>
            </CardHeader>
            {sectionsOpen.demographics && (
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm mb-2 block">Пол</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="bg-[#F0F2F5] border-[#E7E8EC]">
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
                  <Label className="text-sm mb-2 block">Возраст</Label>
                  <div className="flex gap-2">
                    <Select value={ageFrom} onValueChange={setAgeFrom}>
                      <SelectTrigger className="bg-[#F0F2F5] border-[#E7E8EC]">
                        <SelectValue placeholder="От" />
                      </SelectTrigger>
                      <SelectContent>
                        {[12, 14, 16, 18, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70].map(age => (
                          <SelectItem key={age} value={age.toString()}>{age}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={ageTo} onValueChange={setAgeTo}>
                      <SelectTrigger className="bg-[#F0F2F5] border-[#E7E8EC]">
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
                  <Label className="text-sm mb-2 block">Возрастная маркировка</Label>
                  <Select value={ageRating} onValueChange={setAgeRating}>
                    <SelectTrigger className="bg-[#F0F2F5] border-[#E7E8EC]">
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
                  <Label htmlFor="social-ad" className="text-sm font-normal cursor-pointer">
                    Социальная реклама
                  </Label>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Interests */}
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
              <p className="text-sm text-[#818C99]">Не выбран</p>
            </CardHeader>
            {sectionsOpen.interests && (
              <CardContent>
                <Input
                  placeholder="Поиск интересов..."
                  className="bg-[#F0F2F5] border-[#E7E8EC]"
                />
              </CardContent>
            )}
          </Card>

          {/* Audiences */}
          <Card className="border-[#E7E8EC] bg-white">
            <CardHeader 
              className="pb-3 cursor-pointer hover:bg-[#F9FAFB]"
              onClick={() => toggleSection('audiences')}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">Аудитории</CardTitle>
                {sectionsOpen.audiences ? (
                  <ChevronUp className="h-5 w-5 text-[#4680C2]" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-[#4680C2]" />
                )}
              </div>
              <p className="text-sm text-[#818C99]">Не выбраны</p>
            </CardHeader>
            {sectionsOpen.audiences && (
              <CardContent>
                <Button variant="outline" className="w-full border-[#E7E8EC]">
                  + Добавить аудиторию
                </Button>
              </CardContent>
            )}
          </Card>

          {/* Devices */}
          <Card className="border-[#E7E8EC] bg-white">
            <CardHeader 
              className="pb-3 cursor-pointer hover:bg-[#F9FAFB]"
              onClick={() => toggleSection('devices')}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">Устройства</CardTitle>
                {sectionsOpen.devices ? (
                  <ChevronUp className="h-5 w-5 text-[#4680C2]" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-[#4680C2]" />
                )}
              </div>
              <p className="text-sm text-[#818C99]">Все устройства</p>
            </CardHeader>
            {sectionsOpen.devices && (
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="desktop" defaultChecked />
                    <Label htmlFor="desktop" className="text-sm font-normal cursor-pointer">
                      Компьютеры
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="mobile" defaultChecked />
                    <Label htmlFor="mobile" className="text-sm font-normal cursor-pointer">
                      Мобильные устройства
                    </Label>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Ad Creative */}
          <Card className="border-[#E7E8EC] bg-white">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">Объявление</CardTitle>
                <Button variant="ghost" size="sm" className="h-8 text-[#4680C2]">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                  </svg>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* Logo upload */}
                  <div>
                    <Label className="text-sm mb-2 block">
                      Логотип <span className="text-red-500">*</span>
                    </Label>
                    <div className="border-2 border-dashed border-[#E7E8EC] rounded-lg p-6 text-center bg-[#F9FAFB]">
                      {uploadedCreativeUrl ? (
                        <img 
                          src={uploadedCreativeUrl} 
                          alt="Logo" 
                          className="max-h-20 mx-auto rounded"
                        />
                      ) : (
                        <div>
                          <Button variant="link" className="text-[#4680C2]">
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
                    <Label className="text-sm mb-2 block">
                      Заголовок <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        placeholder="Не выбран"
                        className="bg-[#F0F2F5] border-[#E7E8EC]"
                        maxLength={40}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#818C99]">
                        {headline.length} / 40
                      </span>
                    </div>
                  </div>

                  {/* Short description */}
                  <div>
                    <Label className="text-sm mb-2 block">
                      Короткое описание <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Textarea
                        value={shortDescription}
                        onChange={(e) => setShortDescription(e.target.value)}
                        placeholder=""
                        className="bg-[#F0F2F5] border-[#E7E8EC] min-h-[80px]"
                        maxLength={90}
                      />
                      <span className="absolute right-3 bottom-3 text-xs text-[#818C99]">
                        {shortDescription.length} / 90
                      </span>
                    </div>
                  </div>

                  {/* Long description */}
                  <div>
                    <Label className="text-sm mb-2 block">Длинное описание</Label>
                    <div className="relative">
                      <Textarea
                        value={longDescription}
                        onChange={(e) => setLongDescription(e.target.value)}
                        placeholder=""
                        className="bg-[#F0F2F5] border-[#E7E8EC] min-h-[120px]"
                        maxLength={16384}
                      />
                      <span className="absolute right-3 bottom-3 text-xs text-[#818C99]">
                        {longDescription.length} / 16384
                      </span>
                    </div>
                  </div>

                  {/* Button text */}
                  <div>
                    <Label className="text-sm mb-2 block">Текст рядом с кнопкой</Label>
                    <div className="relative">
                      <Input
                        value={buttonText}
                        onChange={(e) => setButtonText(e.target.value)}
                        placeholder="Не выбран"
                        className="bg-[#F0F2F5] border-[#E7E8EC]"
                        maxLength={30}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#818C99]">
                        {buttonText.length} / 30
                      </span>
                    </div>
                  </div>

                  {/* Site URL */}
                  <div>
                    <Label className="text-sm mb-2 block">
                      Ссылка на сайт <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={siteUrl}
                      onChange={(e) => setSiteUrl(e.target.value)}
                      placeholder="http://mail.ru/"
                      className="bg-[#F0F2F5] border-[#E7E8EC]"
                    />
                  </div>

                  {/* Button label */}
                  <div>
                    <Label className="text-sm mb-2 block">
                      Надпись на кнопке <span className="text-red-500">*</span>
                    </Label>
                    <Select>
                      <SelectTrigger className="bg-[#F0F2F5] border-[#E7E8EC]">
                        <SelectValue placeholder="Не выбрана" />
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

                {/* Preview */}
                <div>
                  <Label className="text-sm mb-3 block">Предпросмотр</Label>
                  <div className="border border-[#E7E8EC] rounded-lg overflow-hidden bg-white">
                    <Tabs defaultValue="feed" className="w-full">
                      <TabsList className="w-full justify-start rounded-none border-b border-[#E7E8EC] bg-transparent h-auto p-0">
                        <TabsTrigger 
                          value="feed" 
                          className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#4680C2] data-[state=active]:bg-transparent"
                        >
                          Пост
                        </TabsTrigger>
                        <TabsTrigger 
                          value="story" 
                          className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#4680C2] data-[state=active]:bg-transparent"
                        >
                          В ленте
                        </TabsTrigger>
                        <TabsTrigger 
                          value="fullscreen" 
                          className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#4680C2] data-[state=active]:bg-transparent"
                        >
                          Полноэкранный блок
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="feed" className="p-4 m-0">
                        <div className="space-y-3">
                          {uploadedCreativeUrl && (
                            <img 
                              src={uploadedCreativeUrl} 
                              alt="Preview" 
                              className="w-full rounded-lg"
                            />
                          )}
                          {!uploadedCreativeUrl && (
                            <div className="aspect-video bg-[#F0F2F5] rounded-lg flex items-center justify-center">
                              <p className="text-sm text-[#818C99]">ЗАГРУЗИТЕ ИЗОБРАЖЕНИЕ ИЛИ ВИДЕО 1:1</p>
                            </div>
                          )}
                          <div className="space-y-1">
                            <div className="text-sm font-medium">{headline || "Заголовок"}</div>
                            <div className="text-xs text-[#818C99]">{shortDescription || "Короткое описание"}</div>
                          </div>
                          <Badge className="bg-[#4680C2] text-white text-xs">Реклама</Badge>
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
              </div>
            </CardContent>
          </Card>

          {/* Launch section */}
          <Card className="border-[#E7E8EC] bg-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#818C99]">Бюджет кампании</p>
                  <p className="text-2xl font-semibold">{budget.toLocaleString('ru-RU')} ₽</p>
                </div>
                <Button
                  onClick={handleLaunch}
                  disabled={!canLaunch || campaignLaunched}
                  className="bg-[#4680C2] hover:bg-[#3d6fa8] text-white px-8"
                >
                  {campaignLaunched ? "Кампания запущена" : "Запустить кампанию"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Reports section */}
          {campaignLaunched && (
            <Card className="border-[#E7E8EC] bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Отчеты</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-1">
                    <p className="text-sm text-[#818C99]">Конверсии</p>
                    <p className="text-2xl font-semibold">{conversions}</p>
                  </div>
                  <Button
                    onClick={() => setShowReport(true)}
                    className="bg-[#4680C2] hover:bg-[#3d6fa8] text-white"
                  >
                    Сформировать отчет
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>

      {showReport && (
        <AdReportModal
          open={showReport}
          onOpenChange={setShowReport}
          currentStage={currentStage}
          setCurrentStage={setCurrentStage}
        />
      )}
    </Card>
  );
};
