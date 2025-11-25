import { Lock, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: () => void;
}

export const PaywallModal = ({ isOpen, onClose, onPurchase }: PaywallModalProps) => {
  const features = [
    "Полный доступ к симулятору рекламного кабинета",
    "Запуск рекламной кампании",
    "Работа с паникой клиента",
    "Построение маркетингового отчета по итогам"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl">
            Разблокируйте полный доступ
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Чтобы продолжить работу в тренажере и запустить рекламную кампанию, приобретите полный доступ
          </DialogDescription>
        </DialogHeader>

        <Card className="bg-primary/5 border-primary/20 p-6 my-4">
          <div className="space-y-3 mb-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">{feature}</span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="text-4xl font-bold text-foreground">790 ₽</div>
          </div>
        </Card>

        <div className="space-y-2">
          <Button 
            onClick={onPurchase}
            className="w-full h-12 text-base font-semibold"
            size="lg"
            data-testid="button-purchase-premium"
          >
            Получить полный доступ
          </Button>
          <Button 
            onClick={onClose}
            variant="ghost"
            className="w-full"
            data-testid="button-close-paywall"
          >
            Пока не готов
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
