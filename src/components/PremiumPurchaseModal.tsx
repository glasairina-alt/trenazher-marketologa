import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { reachGoal, MetrikaGoals } from "@/lib/metrika";
import { api } from "@/lib/api";
import { Check, CreditCard, Shield, Loader2 } from "lucide-react";

interface PremiumPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PaymentResponse {
  paymentId: string;
  confirmationUrl: string;
  status: string;
}

const features = [
  "Полное прохождение кейса с диалогами",
  "Создание рекламных креативов",
  "Настройка и запуск рекламной кампании",
  "Работа с возражениями клиента",
  "Аналитика и подготовка отчёта",
  "Скачивание диалогов в DOCX",
];

export const PremiumPurchaseModal = ({ isOpen, onClose }: PremiumPurchaseModalProps) => {
  const { user, isAuthenticated, login, register } = useAuth();
  const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setPassword("");
      setName("");
      setPhone("");
      setPrivacyConsent(false);
      setShowLoginForm(false);
    }
  }, [isOpen]);

  const handleRegisterAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!privacyConsent) {
      toast({
        title: "Требуется согласие",
        description: "Необходимо дать согласие на обработку персональных данных",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      await register(email, password, name, phone);
      reachGoal(MetrikaGoals.REGISTER_SUCCESS);
      
      toast({
        title: "Регистрация успешна!",
        description: "Перенаправляем на оплату...",
      });
      
      await initiatePayment();
    } catch (error: any) {
      toast({
        title: "Ошибка регистрации",
        description: error.message || "Не удалось создать аккаунт",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginAndPay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      reachGoal(MetrikaGoals.LOGIN_SUCCESS);
      
      toast({
        title: "Вход успешен!",
        description: "Перенаправляем на оплату...",
      });
      
      await initiatePayment();
    } catch (error: any) {
      toast({
        title: "Ошибка входа",
        description: error.message || "Неверный email или пароль",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const initiatePayment = async () => {
    setIsPaymentLoading(true);
    
    try {
      reachGoal(MetrikaGoals.PAYMENT_STARTED);
      
      const response = await api.post<PaymentResponse>('/api/payment/create', {});
      
      if (response.confirmationUrl && response.paymentId) {
        localStorage.setItem('lastPaymentId', response.paymentId);
        window.location.href = response.confirmationUrl;
      } else {
        throw new Error('No confirmation URL received');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось создать платёж. Попробуйте ещё раз.",
        variant: "destructive",
      });
      setIsPaymentLoading(false);
    }
  };

  const handlePayNow = async () => {
    reachGoal(MetrikaGoals.BUTTON_UNLOCK_PREMIUM);
    await initiatePayment();
  };

  if (user?.role === 'premium_user' || user?.role === 'admin') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              У вас уже есть полный доступ!
            </DialogTitle>
            <DialogDescription className="text-center">
              Вы можете пользоваться всеми функциями тренажёра.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={onClose} className="w-full" data-testid="button-close-premium-modal">
            Продолжить
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Полный доступ к тренажёру
          </DialogTitle>
          <DialogDescription className="text-center">
            Получите полный доступ ко всем этапам обучения
          </DialogDescription>
        </DialogHeader>

        <Card className="bg-primary/5 border-primary/20 p-4 my-2">
          <div className="space-y-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-4 pt-4 border-t border-primary/20">
            <div className="text-3xl font-bold text-foreground">790 ₽</div>
            <p className="text-xs text-muted-foreground mt-1">Одноразовый платёж, без подписки</p>
          </div>
        </Card>

        {isAuthenticated ? (
          <div className="space-y-4">
            <Button 
              onClick={handlePayNow}
              disabled={isPaymentLoading}
              className="w-full h-12 text-base font-semibold bg-[#C5F82A] hover:bg-[#b2e615] text-black"
              size="lg"
              data-testid="button-pay-now"
            >
              {isPaymentLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Переход к оплате...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Оплатить 790 ₽
                </>
              )}
            </Button>
            
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-4 w-4" />
              Безопасная оплата через ЮКассу
            </div>
          </div>
        ) : showLoginForm ? (
          <form onSubmit={handleLoginAndPay} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="example@mail.ru"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                data-testid="input-modal-login-email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password">Пароль</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
                data-testid="input-modal-login-password"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold bg-[#C5F82A] hover:bg-[#b2e615] text-black" 
              disabled={isLoading}
              data-testid="button-modal-login-pay"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Вход...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Войти и оплатить
                </>
              )}
            </Button>

            <button
              type="button"
              onClick={() => setShowLoginForm(false)}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-switch-to-register"
            >
              Нет аккаунта? Зарегистрироваться
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterAndPay} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="register-name">Имя</Label>
              <Input
                id="register-name"
                type="text"
                placeholder="Ваше имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
                data-testid="input-modal-register-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-phone">Телефон</Label>
              <Input
                id="register-phone"
                type="tel"
                placeholder="+7 (999) 123-45-67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={isLoading}
                data-testid="input-modal-register-phone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
                type="email"
                placeholder="example@mail.ru"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                data-testid="input-modal-register-email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-password">Пароль</Label>
              <Input
                id="register-password"
                type="password"
                placeholder="Минимум 6 символов"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={isLoading}
                data-testid="input-modal-register-password"
              />
            </div>

            <div className="flex items-start space-x-2 pt-1">
              <Checkbox 
                id="modal-privacy-consent" 
                checked={privacyConsent}
                onCheckedChange={(checked) => setPrivacyConsent(checked as boolean)}
                disabled={isLoading}
                data-testid="checkbox-modal-privacy-consent"
              />
              <label
                htmlFor="modal-privacy-consent"
                className="text-xs text-muted-foreground leading-tight cursor-pointer"
              >
                Даю согласие на{" "}
                <a
                  href="https://voitovichirina.ru/politika"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  обработку персональных данных
                </a>
                {" "}и принимаю{" "}
                <a
                  href="/oferta"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  условия оферты
                </a>
              </label>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold bg-[#C5F82A] hover:bg-[#b2e615] text-black" 
              disabled={isLoading || !privacyConsent}
              data-testid="button-modal-register-pay"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Создание аккаунта...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-5 w-5" />
                  Зарегистрироваться и оплатить
                </>
              )}
            </Button>

            <button
              type="button"
              onClick={() => setShowLoginForm(true)}
              className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-switch-to-login"
            >
              Уже есть аккаунт? Войти
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
              <Shield className="h-4 w-4" />
              Безопасная оплата через ЮКассу
            </div>
          </form>
        )}

        <p className="text-xs text-center text-muted-foreground">
          Нажимая кнопку оплаты, вы соглашаетесь с{" "}
          <a href="/oferta" target="_blank" className="text-primary hover:underline">
            условиями оферты
          </a>
        </p>
      </DialogContent>
    </Dialog>
  );
};
