import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { reachGoal, MetrikaGoals } from "@/lib/metrika";
import { 
  CheckCircle2, 
  Loader2, 
  XCircle,
  ArrowRight,
  RefreshCw
} from "lucide-react";

type PaymentStatus = 'loading' | 'succeeded' | 'pending' | 'canceled' | 'error';

interface PaymentStatusResponse {
  paymentId: string;
  status: string;
  paid: boolean;
  amount: string;
  currency: string;
}

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState<PaymentStatus>('loading');
  const [isChecking, setIsChecking] = useState(false);
  
  const paymentId = searchParams.get('paymentId') || localStorage.getItem('lastPaymentId');

  const checkPaymentStatus = async () => {
    if (!paymentId) {
      setStatus('error');
      return;
    }

    setIsChecking(true);
    
    try {
      const response = await api.get<PaymentStatusResponse>(`/api/payment/status/${paymentId}`);
      
      if (response.status === 'succeeded' && response.paid) {
        setStatus('succeeded');
        reachGoal(MetrikaGoals.PAYMENT_SUCCESS);
        await refreshUser();
        localStorage.removeItem('lastPaymentId');
      } else if (response.status === 'canceled') {
        setStatus('canceled');
        localStorage.removeItem('lastPaymentId');
      } else if (response.status === 'pending' || response.status === 'waiting_for_capture') {
        setStatus('pending');
      } else {
        setStatus('pending');
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      setStatus('error');
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      checkPaymentStatus();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [paymentId]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <Card className="bg-[#16181D] border-white/10 text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Loader2 className="w-16 h-16 text-[#C5F82A] animate-spin" />
              </div>
              <CardTitle className="text-2xl text-white">Проверяем оплату...</CardTitle>
              <CardDescription className="text-slate-400">
                Пожалуйста, подождите
              </CardDescription>
            </CardHeader>
          </Card>
        );

      case 'succeeded':
        return (
          <Card className="bg-[#16181D] border-white/10 text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="w-20 h-20 text-[#C5F82A]" />
              </div>
              <CardTitle className="text-3xl text-white">Оплата прошла успешно!</CardTitle>
              <CardDescription className="text-slate-400 text-lg mt-2">
                Теперь у вас есть полный доступ к тренажёру
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-[#C5F82A]/10 border border-[#C5F82A]/20 rounded-lg">
                <p className="text-[#C5F82A] font-medium">
                  Премиум-статус активирован
                </p>
                <p className="text-slate-400 text-sm mt-1">
                  Все модули тренажёра теперь доступны
                </p>
              </div>
              
              <Link to="/trainer">
                <Button 
                  className="w-full py-6 text-lg bg-[#C5F82A] hover:bg-[#b2e615] text-black font-bold"
                  data-testid="button-go-to-trainer"
                >
                  Перейти к тренажёру
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        );

      case 'pending':
        return (
          <Card className="bg-[#16181D] border-white/10 text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Loader2 className="w-16 h-16 text-yellow-500 animate-spin" />
              </div>
              <CardTitle className="text-2xl text-white">Платёж обрабатывается</CardTitle>
              <CardDescription className="text-slate-400">
                Это может занять несколько минут
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-400">
                Если вы уже оплатили, доступ откроется автоматически. 
                Вы можете проверить статус, нажав кнопку ниже.
              </p>
              <Button
                onClick={checkPaymentStatus}
                disabled={isChecking}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                data-testid="button-check-status"
              >
                {isChecking ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Проверить статус
              </Button>
            </CardContent>
          </Card>
        );

      case 'canceled':
        return (
          <Card className="bg-[#16181D] border-white/10 text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <XCircle className="w-16 h-16 text-red-500" />
              </div>
              <CardTitle className="text-2xl text-white">Платёж отменён</CardTitle>
              <CardDescription className="text-slate-400">
                Оплата не была завершена
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/payment">
                <Button 
                  className="w-full bg-[#C5F82A] hover:bg-[#b2e615] text-black font-bold"
                  data-testid="button-try-again"
                >
                  Попробовать снова
                </Button>
              </Link>
              <Link to="/">
                <Button 
                  variant="outline" 
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  На главную
                </Button>
              </Link>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card className="bg-[#16181D] border-white/10 text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <XCircle className="w-16 h-16 text-red-500" />
              </div>
              <CardTitle className="text-2xl text-white">Произошла ошибка</CardTitle>
              <CardDescription className="text-slate-400">
                Не удалось проверить статус платежа
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-400 text-sm">
                Если деньги были списаны, свяжитесь с нами: trafik-im@yandex.ru
              </p>
              <Button
                onClick={checkPaymentStatus}
                disabled={isChecking}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                {isChecking ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Повторить проверку
              </Button>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {renderContent()}
      </div>
    </div>
  );
};

export default PaymentSuccess;
