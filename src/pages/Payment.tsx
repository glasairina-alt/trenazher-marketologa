import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { reachGoal, MetrikaGoals } from "@/lib/metrika";
import { 
  CreditCard, 
  Shield, 
  Check, 
  ArrowLeft, 
  Loader2,
  Lock
} from "lucide-react";

interface PaymentResponse {
  paymentId: string;
  confirmationUrl: string;
  status: string;
  amount: string;
  currency: string;
}

const Payment = () => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const features = [
    "Полное прохождение кейса с диалогами",
    "Создание рекламных креативов",
    "Настройка и запуск рекламной кампании",
    "Работа с возражениями клиента",
    "Аналитика и подготовка отчёта",
    "Скачивание диалогов в DOCX"
  ];

  const handlePayment = async () => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    setIsLoading(true);
    
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
        description: error.message || "Не удалось создать платёж. Попробуйте позже.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] text-white">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
          data-testid="link-back-home"
        >
          <ArrowLeft size={20} />
          Вернуться на главную
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Полный доступ к тренажёру
            </h1>
            <p className="text-slate-400 text-lg mb-6">
              Получите полный доступ ко всем этапам тренажёра маркетолога и пройдите реальный кейс от начала до конца.
            </p>

            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0">
                    <Check className="w-5 h-5 text-[#C5F82A]" />
                  </div>
                  <span className="text-slate-300">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 p-4 bg-[#16181D] rounded-lg border border-white/10">
              <Shield className="w-6 h-6 text-[#C5F82A]" />
              <div className="text-sm text-slate-400">
                Безопасная оплата через ЮКассу. Ваши данные защищены.
              </div>
            </div>
          </div>

          <div>
            <Card className="bg-[#16181D] border-white/10">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl text-white">Премиум доступ</CardTitle>
                <CardDescription className="text-slate-400">
                  Одноразовый платёж, без подписки
                </CardDescription>
              </CardHeader>
              
              <CardContent className="text-center pb-6">
                <div className="mb-6">
                  <span className="text-5xl font-bold text-white">790</span>
                  <span className="text-2xl text-slate-400 ml-2">₽</span>
                </div>
                
                <div className="text-sm text-slate-500 mb-6">
                  Включает все модули и материалы
                </div>

                {!isAuthenticated && (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mb-4">
                    <p className="text-sm text-yellow-200">
                      Для оплаты необходимо войти в аккаунт или зарегистрироваться
                    </p>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex flex-col gap-4">
                <Button
                  onClick={handlePayment}
                  disabled={isLoading}
                  className="w-full py-6 text-lg bg-[#C5F82A] hover:bg-[#b2e615] text-black font-bold"
                  data-testid="button-pay"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Создание платежа...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      {isAuthenticated ? "Оплатить 790 ₽" : "Войти и оплатить"}
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                  <Lock className="w-4 h-4" />
                  Безопасное соединение
                </div>
              </CardFooter>
            </Card>

            <div className="mt-6 text-center text-sm text-slate-500">
              Нажимая кнопку оплаты, вы соглашаетесь с{" "}
              <Link to="/oferta" className="text-[#C5F82A] hover:underline">
                условиями оферты
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
