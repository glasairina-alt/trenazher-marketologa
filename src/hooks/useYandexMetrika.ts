import { useEffect } from 'react';

// Расширяем Window для TypeScript
declare global {
  interface Window {
    ym?: (
      id: number,
      method: string,
      ...params: any[]
    ) => void;
  }
}

const YANDEX_METRIKA_ID = 105483627;

/**
 * Хук для отслеживания переходов в SPA приложении
 * Инициализация происходит в index.html
 */
export const useYandexMetrika = (pathname: string) => {
  // Отслеживание переходов между страницами
  useEffect(() => {
    if (typeof window.ym === 'function') {
      try {
        // Отправляем hit при изменении URL
        window.ym(YANDEX_METRIKA_ID, 'hit', window.location.href);
        console.log('📊 Метрика: переход на', pathname);
      } catch (error) {
        console.error('❌ Ошибка отправки hit:', error);
      }
    }
  }, [pathname]); // Выполняется при каждом изменении пути
};
