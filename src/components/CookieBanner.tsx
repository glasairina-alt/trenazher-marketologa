import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const COOKIE_CONSENT_KEY = "cookie-consent-accepted";

export const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!hasConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-300"
      data-testid="cookie-banner"
    >
      <div className="bg-[#16181D] border-t border-white/10 shadow-lg">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex-1 text-sm text-white/90 pr-8 sm:pr-0">
              <p>
                Мы используем cookies для улучшения работы сайта и аналитики посещений.{" "}
                <a
                  href="https://voitovichirina.ru/politika"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C5F82A] hover:underline"
                  data-testid="link-privacy-policy"
                >
                  Политика конфиденциальности
                </a>
              </p>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                onClick={handleAccept}
                className="flex-1 sm:flex-none bg-[#C5F82A] text-black hover:bg-[#B5E81A] font-medium"
                data-testid="button-accept-cookies"
              >
                Принять
              </Button>
              <Button
                onClick={handleClose}
                variant="ghost"
                size="icon"
                className="shrink-0 text-white/60 hover:text-white hover:bg-white/10"
                data-testid="button-close-banner"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
