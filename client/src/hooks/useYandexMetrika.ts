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
 * Хук для инициализации Яндекс.Метрики в SPA приложении
 * Правильно работает с React Router (wouter) и отслеживает переходы
 */
export const useYandexMetrika = (pathname: string) => {
  // Инициализация счётчика при первой загрузке
  useEffect(() => {
    // Проверяем, что функция ym загружена
    if (typeof window.ym === 'function') {
      try {
        // Инициализируем счётчик БЕЗ ssr:true
        window.ym(YANDEX_METRIKA_ID, 'init', {
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor: true,
          ecommerce: 'dataLayer',
        });
        console.log('✅ Яндекс.Метрика инициализирована');
      } catch (error) {
        console.error('❌ Ошибка инициализации Яндекс.Метрики:', error);
      }
    } else {
      // Если скрипт ещё не загрузился, пробуем через 100мс
      const timer = setTimeout(() => {
        if (typeof window.ym === 'function') {
          window.ym(YANDEX_METRIKA_ID, 'init', {
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true,
            ecommerce: 'dataLayer',
          });
          console.log('✅ Яндекс.Метрика инициализирована (отложенная)');
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, []); // Выполняется только один раз при монтировании

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
