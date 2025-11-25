/**
 * Yandex Metrika Goals Tracking Utility
 * 
 * Используйте эти функции для отслеживания целей в Яндекс Метрике.
 * Цели должны быть созданы в Метрике с типом "JavaScript-событие".
 * 
 * Настройка целей в Метрике:
 * 1. Перейдите в Метрику → Цели → Добавить цель
 * 2. Выберите "JavaScript-событие"
 * 3. Укажите идентификатор цели (например: button_start_free)
 * 4. Сохраните цель
 * 
 * Доступные цели:
 * - button_login: Клик на кнопку "Войти"
 * - button_start_free: Клик на кнопку "Начать бесплатно"
 * - login_success: Успешный вход в аккаунт
 * - register_success: Успешная регистрация
 * - button_unlock_premium: Клик на кнопку покупки
 * - payment_success: Успешная оплата
 * - password_change_success: Успешная смена пароля
 */

// Yandex Metrika Counter ID
const METRIKA_COUNTER_ID = 105483627;

// Declare global ym function type
declare global {
  interface Window {
    ym?: (counterId: number, method: string, goalId: string, params?: Record<string, unknown>) => void;
  }
}

/**
 * Отправляет событие достижения цели в Яндекс Метрику
 * 
 * @param goalId - Идентификатор цели (создаётся в настройках Метрики)
 * @param params - Дополнительные параметры для передачи с целью
 * 
 * @example
 * // Простое отслеживание клика
 * reachGoal('button_start_free');
 * 
 * // С дополнительными параметрами
 * reachGoal('register_success', { role: 'premium_user' });
 */
export function reachGoal(goalId: string, params?: Record<string, unknown>): void {
  try {
    if (typeof window !== 'undefined' && window.ym) {
      window.ym(METRIKA_COUNTER_ID, 'reachGoal', goalId, params);
      console.log(`[Metrika] Goal reached: ${goalId}`, params || '');
    } else {
      console.warn('[Metrika] ym() not available, goal not tracked:', goalId);
    }
  } catch (error) {
    console.error('[Metrika] Error tracking goal:', goalId, error);
  }
}

/**
 * Предопределённые цели для удобства использования
 */
export const MetrikaGoals = {
  // Кнопки на лендинге
  BUTTON_LOGIN: 'button_login',
  BUTTON_START_FREE: 'button_start_free',
  BUTTON_TRY_DEMO: 'button_try_demo',
  BUTTON_UNLOCK_PREMIUM: 'button_unlock_premium',
  
  // Аутентификация
  LOGIN_SUCCESS: 'login_success',
  REGISTER_SUCCESS: 'register_success',
  LOGOUT: 'logout',
  
  // Оплата
  PAYMENT_STARTED: 'payment_started',
  PAYMENT_SUCCESS: 'payment_success',
  
  // Пользовательские действия
  PASSWORD_CHANGE_SUCCESS: 'password_change_success',
  
  // Тренажёр
  TRAINER_STARTED: 'trainer_started',
  LESSON_COMPLETED: 'lesson_completed',
} as const;

/**
 * Хук для использования в React компонентах
 * Возвращает функцию trackGoal, которая безопасно отправляет цели
 */
export function useMetrika() {
  return {
    trackGoal: reachGoal,
    goals: MetrikaGoals,
  };
}
