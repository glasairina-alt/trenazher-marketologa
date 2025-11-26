import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MessageCircle,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Zap,
  Lock,
  ArrowRight,
  Target,
  Users,
  ShieldCheck,
  Send,
  Download,
  School,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { reachGoal, MetrikaGoals } from '@/lib/metrika';
import { PremiumPurchaseModal } from '@/components/PremiumPurchaseModal';

const LOGO_URL = "https://static.tildacdn.com/tild3339-6163-4562-b862-373037323038/___.png";

export default function Landing() {
  const { openAuthModal } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);

  const handleStartFree = () => {
    reachGoal(MetrikaGoals.BUTTON_START_FREE);
    navigate('/trainer');
  };

  const handleLogin = () => {
    reachGoal(MetrikaGoals.BUTTON_LOGIN);
    openAuthModal('login');
  };

  const handleOpenPremiumModal = () => {
    reachGoal(MetrikaGoals.BUTTON_UNLOCK_PREMIUM);
    setIsPremiumModalOpen(true);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0C10] text-slate-200 font-sans selection:bg-[#C5F82A] selection:text-black overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-[#0B0C10]/80 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <a 
            href="https://voitovichirina.ru/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xl font-bold tracking-tighter text-white flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img
              src={LOGO_URL}
              alt="Логотип Твой первый клиент"
              className="h-10 md:h-12 object-contain"
              onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/100x40/0B0C10/C5F82A?text=LOGO"; }}
            />
          </a>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-300">
            <NavLink href="#главная" label="Главная" />
            <NavLink href="#тариф" label="Тариф" />
            <NavLink href="#отзывы" label="Отзывы" />
            <NavLink href="#faq" label="FAQ" />
          </div>

          <button 
            onClick={handleLogin}
            className="hidden md:block bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full text-sm font-medium transition-all"
            data-testid="button-login"
          >
            Войти
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-all"
            data-testid="button-mobile-menu"
            aria-label="Открыть меню"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 top-[73px] bg-black/50 backdrop-blur-sm z-40"
            onClick={closeMobileMenu}
          />
        )}

        {/* Mobile Menu Panel */}
        <div className={`md:hidden fixed top-[73px] right-0 w-64 h-[calc(100vh-73px)] bg-[#16181D] border-l border-white/10 transform transition-transform duration-300 ease-in-out z-50 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex flex-col p-6 space-y-6">
            <a
              href="#главная"
              onClick={closeMobileMenu}
              className="text-slate-300 hover:text-[#C5F82A] font-medium text-lg transition-colors"
              data-testid="mobile-link-home"
            >
              Главная
            </a>
            <a
              href="#тариф"
              onClick={closeMobileMenu}
              className="text-slate-300 hover:text-[#C5F82A] font-medium text-lg transition-colors"
              data-testid="mobile-link-pricing"
            >
              Тариф
            </a>
            <a
              href="#отзывы"
              onClick={closeMobileMenu}
              className="text-slate-300 hover:text-[#C5F82A] font-medium text-lg transition-colors"
              data-testid="mobile-link-testimonials"
            >
              Отзывы
            </a>
            <a
              href="#faq"
              onClick={closeMobileMenu}
              className="text-slate-300 hover:text-[#C5F82A] font-medium text-lg transition-colors"
              data-testid="mobile-link-faq"
            >
              FAQ
            </a>
            
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  closeMobileMenu();
                  handleLogin();
                }}
                className="w-full bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full text-sm font-medium transition-all"
                data-testid="mobile-button-login"
              >
                Войти
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header id="главная" className="relative pt-32 pb-20 md:pt-48 md:pb-20 px-4">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#C5F82A] opacity-[0.07] blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#C5F82A] animate-pulse"></span>
            <span className="text-xs md:text-sm font-medium text-slate-300 tracking-wide uppercase">Симулятор реальной работы</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-8">
            Твой первый клиент — <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5F82A] to-emerald-400">без страха и хаоса</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Практический тренажёр для маркетологов-новичков: попробуй вести переговоры, получать правки, запускать рекламу и делать отчёт — как в реальных проектах, но в безопасной среде.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <button 
              onClick={handleStartFree}
              className="w-full md:w-auto bg-[#C5F82A] hover:bg-[#b2e615] text-black px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(197,248,42,0.3)]"
              data-testid="button-start-free"
            >
              Начать бесплатно
              <ArrowRight className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4 px-6 py-4 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C5F82A]" />
                <span>Без риска</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#C5F82A]" />
                <span>Реальные кейсы</span>
              </div>
            </div>
          </div>
        </div>

        {/* UI Mockup */}
        <div className="mt-20 max-w-4xl mx-auto relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-transparent to-transparent z-20"></div>
          <div className="bg-[#16181D] border border-white/10 rounded-2xl p-2 md:p-4 shadow-2xl shadow-black/50">
            <div className="bg-[#0B0C10] rounded-xl p-6 border border-white/5 grid md:grid-cols-3 gap-6">
              {/* Mock Chat */}
              <div className="col-span-1 space-y-4">
                <div className="flex items-center gap-3 mb-4 opacity-70">
                  <div className="w-8 h-8 rounded-full bg-indigo-500 border border-white/20 shadow-md"></div>
                  <div className="text-sm font-semibold text-white">Анна (Клиент)</div>
                </div>
                <div className="bg-white/10 p-3 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl text-xs text-slate-300 leading-relaxed">
                  Нам нужно запустить рекламу вчера. Бюджет 50 000. Справишься?
                </div>
                <div className="bg-[#C5F82A]/10 border border-[#C5F82A]/20 p-3 rounded-tl-2xl rounded-br-2xl rounded-bl-2xl text-xs text-[#C5F82A] ml-auto w-4/5">
                  Конечно! Давайте обсудим детали и KPI.
                </div>
              </div>
              
              {/* Mock Stats */}
              <div className="col-span-2 space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-white">Результаты кампании</h3>
                  <div className="h-8 w-24 bg-[#C5F82A] rounded-full flex items-center justify-center text-black text-xs font-bold shadow-md">Запуск</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <StatBox value="2.4%" label="CTR (Кликбельность)" accentColor="text-[#C5F82A]" />
                  <StatBox value="750 ₽" label="Цена лида (CPL)" accentColor="text-red-400" />
                  <StatBox value="200/250" label="KPI лидов" accentColor="text-blue-400" />
                </div>
                
                <div className="mt-4 sm:mt-6">
                  <div className="text-slate-500 text-xs sm:text-sm mb-2">Динамика конверсий</div>
                  <div className="flex gap-3 sm:gap-4 items-end h-24 sm:h-32 pb-2 border-b border-white/10">
                    <Bar height="h-[40%]" color="bg-indigo-500/20" tooltip="День 1: 0.8%" />
                    <Bar height="h-[60%]" color="bg-indigo-500/40" tooltip="День 2: 1.2%" />
                    <Bar height="h-[85%]" color="bg-[#C5F82A]" tooltip="День 3: 2.4%" final={true} />
                  </div>
                  <div className="flex justify-between text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-wider sm:tracking-widest pt-2">
                    <span>Тест A</span>
                    <span>Тест B</span>
                    <span className="text-[#C5F82A]">Оптимальный</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* For Whom Section (Bento Grid) */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <span className="text-[#C5F82A] font-mono text-sm tracking-wider uppercase mb-2 block">Аудитория</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Кому это подходит?</h2>
            <p className="text-slate-400 text-lg">Если ты закончил <span className="text-[#C5F82A] font-bold">теоретический курс</span>, но боишься брать первого клиента — начни здесь.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <BentoCard
              icon={<Users className="text-blue-400" />}
              title="Новичкам без практики"
              desc="Знаешь теорию, но никогда не запускал рекламу за реальные деньги."
            />
            <BentoCard
              icon={<MessageCircle className="text-purple-400" />}
              title="Боишься переговоров"
              desc="Не знаешь, как отвечать на неудобные вопросы и оценивать свою работу."
            />
            <BentoCard
              icon={<Zap className="text-orange-400" />}
              title="Путаница в кабинетах"
              desc="Интерфейсы пугают? Научимся нажимать правильные кнопки без паники."
            />
            <BentoCard
              icon={<Target className="text-[#C5F82A]" />}
              desc="Вместо абстрактных учебных задач — симуляция живого проекта."
              title="Нужен реальный кейс"
            />
          </div>
        </div>
      </section>

      {/* What's Inside (Process) */}
      <section className="py-20 px-4 bg-[#0F1116] relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#C5F82A] font-mono text-sm tracking-wider uppercase mb-2 block">Что внутри</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Полный маршрут маркетолога</h2>
              <p className="text-slate-400 text-lg mb-12">
                От первого неуверенного «алло» до отправки финального отчёта. Пройди этот путь виртуально, чтобы в реальности чувствовать себя профи.
              </p>

              <div className="space-y-8 relative">
                <div className="absolute left-[19px] top-2 bottom-6 w-[2px] bg-white/10"></div>

                <StepItem number="1" title="Переговоры и сбор ТЗ" desc="Узнаем боли клиента и формулируем задачу." />
                <StepItem number="2" title="Креативы и правки" desc="Создаем рекламу и получаем «любимые» правки клиента." />
                <StepItem number="3" title="Запуск в симуляторе" desc="Настройка аудиторий и бюджета в безопасном интерфейсе." />
                <StepItem number="4" title="Работа с возражениями" desc="«Почему так дорого?» и «Где мои лиды?»." />
                <StepItem number="5" title="Отчёт и результаты" desc="Учимся объяснять цифры простым языком." />
              </div>
            </div>
            
            {/* Interactive Element */}
            <div className="relative">
              <div className="bg-[#1A1D24] border border-white/10 rounded-3xl p-8 relative z-10 aspect-square flex flex-col justify-between overflow-hidden group hover:shadow-[0_0_30px_rgba(197,248,42,0.1)] transition-shadow">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5F82A] blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
                
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full text-xs text-slate-300 mb-4 border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    Входящее сообщение
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Диалог с заказчиком</h3>
                  <p className="text-slate-400 text-sm">Клиент недоволен цветом кнопки на баннере. Твои действия?</p>
                </div>

                <div className="mt-8 space-y-3">
                  <button className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#C5F82A]/50 transition-all text-sm text-slate-200">
                    <span className="block text-xs text-slate-500 mb-1">Вариант А (Профессиональный)</span>
                    Объяснить, что этот цвет конвертит лучше по статистике, и предложить A/B-тест.
                  </button>
                  <button className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#C5F82A]/50 transition-all text-sm text-slate-200">
                    <span className="block text-xs text-slate-500 mb-1">Вариант Б (Ошибка)</span>
                    Молча всё переделать, как он хочет, теряя контроль над стратегией.
                  </button>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 w-full h-full border border-white/5 rounded-3xl z-0 bg-[#0B0C10] transform translate-x-3 translate-y-3"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <RoadmapSection />

      {/* Interface Preview Section */}
      <InterfacePreviewSection />
      
      {/* Results & Why it works */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          <div>
            <div className="mb-8 text-left">
              <span className="text-[#C5F82A] font-mono text-sm tracking-wider uppercase mb-2 block">Результат</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-8">Почему это работает?</h2>
            <div className="grid grid-cols-1 gap-4">
              <WhyCard
                title="Не курс, а полевая практика"
                desc="Ты действуешь, а не смотришь видео. Мозг запоминает лучше, когда руки делают."
              />
              <WhyCard
                title="Ошибаться — безопасно"
                desc="Типичные промахи новичков проходишь в тренажере без риска и последствий."
              />
              <WhyCard
                title="Максимально близко к реальности"
                desc="Сценарий создан на базе десятков реальных проектов. От поведения клиента до структуры задач повторяет живую работу."
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#16181D] to-[#0B0C10] rounded-3xl p-8 border border-white/5 flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-white mb-6">После тренажёра ты:</h3>
            <div className="space-y-6">
              <ResultItem text="Понимаешь, что делать с первым клиентом и не впадаешь в ступор." />
              <ResultItem text="Уверенно ведёшь диалог и аргументируешь свои решения." />
              <ResultItem text="Умеешь запускать рекламу и составлять понятные отчёты." />
              <ResultItem text="Больше не считаешь себя «зеленым» новичком." />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="тариф" className="py-20 px-4 bg-[#0F1116]">
        <div className="max-w-4xl mx-auto">
          <div className="text-left mb-16">
            <span className="text-[#C5F82A] font-mono text-sm tracking-wider uppercase mb-2 block">ТАРИФ</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Выбери свой старт</h2>
            <p className="text-slate-400">Попробуй демо-режим или разблокируй полный сценарий работы с клиентом.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Free Plan */}
            <div className="bg-[#16181D] rounded-3xl p-8 border border-white/5 hover:border-white/10 transition-all flex flex-col">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Бесплатно</h3>
                <p className="text-slate-500 text-sm h-10">Познакомиться с форматом и попробовать свои силы.</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-bold text-white">0 ₽</span>
              </div>
              
              <ul className="space-y-4 mb-8 flex-grow">
                <PricingItem text="Первая встреча с клиентом" active={true} />
                <PricingItem text="ТЗ, задачи, первые правки" active={true} />
                <PricingItem text="Настройка рекламы" active={false} />
                <PricingItem text="Работа с возражениями" active={false} />
                <PricingItem text="Финальный отчёт" active={false} />
              </ul>

              <button 
                onClick={handleStartFree}
                className="w-full py-4 rounded-xl border border-white/20 text-white hover:bg-white/5 transition-all font-medium min-h-[60px]"
                data-testid="button-try-demo"
              >
                Попробовать демо
              </button>
            </div>

            {/* Paid Plan */}
            <div className="bg-[#1A1D24] rounded-3xl p-8 border border-[#C5F82A] relative overflow-hidden shadow-[0_0_30px_-10px_rgba(197,248,42,0.2)] flex flex-col">
              <div className="absolute top-0 right-0 bg-[#C5F82A] text-black text-xs font-bold px-4 py-1 rounded-bl-xl">
                РЕКОМЕНДУЕМ
              </div>
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Полная практика</h3>
                <p className="text-slate-400 text-sm h-10">Пройди весь цикл и перестань чувствовать себя новичком.</p>
              </div>
              <div className="mb-8">
                <span className="text-4xl font-bold text-white">790 ₽</span>
                <span className="text-slate-500 line-through ml-3 text-sm">2 900 ₽</span>
                <p className="text-xs text-[#C5F82A] mt-2 font-medium">
                  Полный доступ к сервису будет предоставлен сразу после оплаты.
                </p>
              </div>
              
              <ul className="space-y-4 mb-8 flex-grow">
                <PricingItem text="Все этапы из бесплатного" active={true} highlight={true} />
                <PricingItem text="Настройка и запуск рекламы" active={true} highlight={true} />
                <PricingItem text="Работа с возражениями" active={true} highlight={true} />
                <PricingItem text="Отчёт, выводы, финал" active={true} highlight={true} />
                <PricingItem text="Скачивание и оценка диалогов с клиентом" active={true} highlight={true} icon={Download} />
              </ul>

              <button 
                onClick={handleOpenPremiumModal}
                className="w-full py-4 rounded-xl bg-[#C5F82A] hover:bg-[#b2e615] text-black transition-all font-bold shadow-lg shadow-[#C5F82A]/20 min-h-[60px]" 
                data-testid="button-unlock-premium"
              >
                Открыть доступ за 790 ₽
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Author Section */}
      <AuthorSection />

      {/* Testimonials Section */}
      <TestimonialSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Final CTA */}
      <footer className="py-32 px-4 text-center relative overflow-hidden bg-[#0F1116]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#C5F82A] opacity-[0.05] blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Сделай первый шаг <br/>в профессию
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            Хватит учиться — пора действовать.
          </p>
          <button 
            onClick={handleStartFree}
            className="bg-[#C5F82A] hover:bg-[#b2e615] text-black px-12 py-5 rounded-2xl font-bold text-xl transition-all transform hover:scale-105 shadow-[0_0_30px_rgba(197,248,42,0.3)]"
            data-testid="button-start-footer"
          >
            Начать бесплатно
          </button>
          
          <div className="mt-12 flex flex-col items-center">
            <a 
              href="https://voitovichirina.ru/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block hover:opacity-70 transition-opacity"
            >
              <img
                src={LOGO_URL}
                alt="Логотип Твой первый клиент"
                className="h-10 object-contain opacity-50 mb-4"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/120x40/0B0C10/C5F82A?text=LOGO"; }}
              />
            </a>
            <p className="text-xs text-slate-600">
              © 2025 Все права защищены.
              <a href="https://voitovichirina.ru/politika" target="_blank" rel="noopener noreferrer" className="ml-4 text-slate-500 hover:text-[#C5F82A] transition-colors underline" data-testid="link-privacy-policy-landing">
                Политика обработки персональных данных
              </a>
              <Link to="/oferta" className="ml-4 text-slate-500 hover:text-[#C5F82A] transition-colors underline" data-testid="link-oferta-landing">
                Договор оферты
              </Link>
            </p>
            
            <div className="text-[10px] text-slate-600 mt-2 space-y-0.5">
              <p>Войтович Ирина Вениаминовна, ИНН 645318153031</p>
              <p>тел +79910205051, trafik-im@yandex.ru</p>
            </div>
          </div>
        </div>
      </footer>

      <PremiumPurchaseModal 
        isOpen={isPremiumModalOpen} 
        onClose={() => setIsPremiumModalOpen(false)} 
      />
    </div>
  );
}

// --- Helper Components ---

const NavLink = ({ href, label }: { href: string; label: string }) => (
  <a href={href} className="hover:text-[#C5F82A] transition-colors">
    {label}
  </a>
);

const StatBox = ({ value, label, accentColor }: { value: string; label: string; accentColor: string }) => (
  <div className="bg-[#1A1D24] p-3 rounded-xl border border-white/5">
    <p className={`text-2xl font-bold ${accentColor} mb-1`}>{value}</p>
    <p className="text-xs text-slate-500 uppercase tracking-widest">{label}</p>
  </div>
);

const Bar = ({ height, color, tooltip, final }: { height: string; color: string; tooltip: string; final?: boolean }) => (
  <div className={`w-full ${color} ${height} rounded-t hover:opacity-100 transition-all relative group shadow-lg ${final ? 'shadow-[#C5F82A]/40' : 'shadow-none'}`}>
    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
      {tooltip}
    </div>
  </div>
);

const InterfacePreviewSection = () => (
  <section className="py-20 px-4 bg-[#0F1116] relative">
    <div className="max-w-6xl mx-auto">
      <div className="mb-12 text-left">
        <span className="text-[#C5F82A] font-mono text-sm tracking-wider uppercase mb-2 block">Превью интерфейса</span>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">3 в 1: Чат, Запуск, Отчёт</h2>
        <p className="text-slate-400 text-lg max-w-3xl">
          Полностью имитируем рабочую среду: от первого сообщения до аналитики.
        </p>
      </div>
      
      <div className="bg-[#16181D] border border-[#C5F82A]/30 rounded-3xl shadow-[0_0_50px_rgba(197,248,42,0.1)] p-4 md:p-8">
        <div className="flex space-x-2 border-b border-white/10 mb-6 pb-2 overflow-x-auto">
          <Tab title="Чат с клиентом" icon={MessageCircle} active={true} />
          <Tab title="Рекламный кабинет" icon={Zap} active={false} />
          <Tab title="Отчет" icon={BarChart3} active={false} />
        </div>
        
        <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-[#121418] rounded-xl border border-white/5">
          <ChatBubble type="received" text="Привет! Введите /start чтобы начать кейс." time="21:41" />
          <ChatBubble type="sent" text="/start" time="21:55" /> 
          <ChatContextBubble text="Кейс: Клиент «Анна» (магазин цветов) присылает вам сообщение 12 февраля. Задача: подготовить запуск ко Дню всех влюбленных." time="21:55" />
        </div>

        <div className="border-t border-white/10 pt-4 flex items-center gap-3 opacity-60 pointer-events-none">
          <input 
            type="text"
            placeholder="Ввод отключен в режиме предварительного просмотра."
            disabled={true}
            className="flex-1 p-3 rounded-xl bg-[#0B0C10] border border-white/10 text-slate-400 outline-none cursor-not-allowed"
          />
          <button disabled={true} className="p-3 bg-[#C5F82A] rounded-xl text-black transition-colors cursor-not-allowed">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  </section>
);

const Tab = ({ title, icon: Icon, active }: { title: string; icon: any; active: boolean }) => (
  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
    active ? 'bg-[#C5F82A]/20 text-[#C5F82A] border border-[#C5F82A]/50' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
  }`}>
    <Icon size={16} />
    {title}
  </div>
);

const ChatBubble = ({ type, text, time }: { type: 'sent' | 'received'; text: string; time: string }) => (
  <div className={`flex ${type === 'sent' ? 'justify-end' : 'justify-start'}`}>
    <div className={`max-w-[70%] p-3 rounded-xl text-sm leading-relaxed ${
      type === 'sent' 
        ? 'bg-[#C5F82A]/15 text-[#C5F82A] rounded-br-none ml-auto'
        : 'bg-white/10 text-slate-300 rounded-tl-none mr-auto'
    }`}>
      {text}
      <span className={`block text-[10px] mt-1 ${type === 'sent' ? 'text-[#C5F82A]/80' : 'text-slate-500'} text-right`}>{time}</span>
    </div>
  </div>
);

const ChatContextBubble = ({ text, time }: { text: string; time?: string }) => (
  <div className="flex justify-center w-full my-4">
    <div className="p-3 rounded-xl bg-blue-900/40 border border-blue-500/50 text-slate-300 text-xs max-w-sm text-center shadow-inner">
      {text}
      {time && <span className="block text-[10px] mt-1 text-slate-400 text-center">{time}</span>}
    </div>
  </div>
);

const TestimonialSection = () => (
  <section id="отзывы" className="py-20 px-4 bg-[#0F1116]">
    <div className="max-w-6xl mx-auto">
      <div className="mb-12 text-left">
        <span className="text-[#C5F82A] font-mono text-sm tracking-wider uppercase mb-2 block">Доказательство</span>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Прошли тренажер, чтобы снять реальный страх работы с клиентом</h2>
        <p className="text-slate-400 text-lg max-w-3xl">
          Отзывы тех, кто с нашей помощью перешел от теории к реальному заработку.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <TestimonialCard
          quote="Тренажер дал уверенность, которой не хватало после курсов. Я наконец-то понял, как работать с клиентами и делать маркетинговый отчет."
          author="Анатолий К."
          role="Трафик-менеджер (фриланс)"
          imagePlaceholder="https://placehold.co/80x80/2D3748/C5F82A?text=АК"
        />
        <TestimonialCard
          quote="Самое ценное — это разбор переговоров. Я научилась аргументировать свою позицию и перестала бояться задавать 'неудобные' вопросы клиенту."
          author="Марина С."
          role="Маркетолог-аналитик"
          imagePlaceholder="https://placehold.co/80x80/2D3748/C5F82A?text=МС"
        />
        <TestimonialCard
          quote="Отличная имитация рекламного кабинета. Ошибки, которые я совершила в тренажере, сэкономили бы мне десятки тысяч реальных рублей. Спасибо!"
          author="Ольга А."
          role="Начинающий маркетолог"
          imagePlaceholder="https://placehold.co/80x80/2D3748/C5F82A?text=ОА"
        />
      </div>
    </div>
  </section>
);

const TestimonialCard = ({ quote, author, role, imagePlaceholder }: { quote: string; author: string; role: string; imagePlaceholder: string }) => (
  <div className="bg-[#1A1D24] p-6 rounded-2xl border border-white/10 flex flex-col justify-between hover:border-[#C5F82A]/30 transition-all transform hover:scale-[1.02]">
    <blockquote className="text-slate-300 italic mb-6 relative">
      <span className="text-4xl absolute -top-4 -left-3 text-[#C5F82A] opacity-30">«</span>
      {quote}
      <span className="text-4xl absolute -bottom-8 right-0 text-[#C5F82A] opacity-30">»</span>
    </blockquote>
    <div className="flex items-center gap-4 pt-4 border-t border-white/5 mt-6">
      <img
        src={imagePlaceholder}
        alt={author}
        className="w-12 h-12 rounded-full object-cover border-2 border-[#C5F82A]/50"
        onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/48x48/2D3748/C5F82A?text=..."; }}
      />
      <div>
        <p className="text-white font-bold">{author}</p>
        <p className="text-slate-500 text-sm">{role}</p>
      </div>
    </div>
  </div>
);

const FAQSection = () => (
  <section id="faq" className="py-20 px-4">
    <div className="max-w-4xl mx-auto">
      <div className="mb-12 text-left">
        <span className="text-[#C5F82A] font-mono text-sm tracking-wider uppercase mb-2 block">Вопросы и ответы</span>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Часто задаваемые вопросы</h2>
        <p className="text-slate-400 text-lg max-w-3xl">
          Если вы не нашли ответ на свой вопрос, можете задать его автору в Telegram.
        </p>
      </div>

      <div className="space-y-4">
        <FAQItem
          question="Какой кейс я буду проходить в тренажере?"
          answer="Вы будете работать с реальным, но адаптированным, кейсом запуска рекламы для цветочного магазина к 14 февраля (День всех влюбленных). Кейс включает переговоры о запуске рекламы и бюджете, создание креативов, работу с правками, запуск кампании в симуляторе и финальный маркетинговый отчёт в период ажиотажного спроса. В платной версии доступны все этапы, включая запуск в симуляторе."
        />
        <FAQItem
          question="Нужны ли реальные рекламные кабинеты или бюджет?"
          answer="Нет. Все этапы, связанные с запуском и бюджетом, происходят внутри нашего симулятора. Это безопасная среда, где можно ошибаться без финансовых последствий. Вы не потратите ни одного реального рубля."
        />
        <FAQItem
          question="Насколько тренажер соответствует реальности?"
          answer="Сценарии, диалоги и возражения клиентов написаны на основе реального опыта десятков маркетинговых проектов. Мы максимально точно воссоздали структуру задач, общение с заказчиком и работу с правками."
        />
        <FAQItem
          question="Является ли это заменой полноценному курсу?"
          answer="Нет. Тренажер — это не курс, а практика. Он идеально дополняет теоретические знания, но не заменяет их. Он переводит ваши знания в уверенный практический навык."
        />
        <FAQItem
          question="Если мне что-то непонятно, я могу получить помощь?"
          answer="Вы проходите тренажер самостоятельно. Если вы захотите разобрать ваши действия, углубиться в темы или получить менторскую поддержку, вы можете приобрести консультацию или наставничество у автора проекта отдельно."
        />
      </div>
    </div>
  </section>
);

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[#1A1D24] rounded-xl border border-white/5 overflow-hidden transition-all duration-300 hover:border-[#C5F82A]/30">
      <button
        className="w-full text-left p-5 flex justify-between items-center hover:bg-white/10 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-bold text-white pr-4">{question}</span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-[#C5F82A] flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />}
      </button>
      <div
        className={`px-5 text-slate-400 transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-5' : 'max-h-0 opacity-0'}`}
      >
        <p className="leading-relaxed border-t border-white/5 pt-4">{answer}</p>
      </div>
    </div>
  );
};

const RoadmapSection = () => (
  <section className="py-20 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="mb-12 text-left">
        <span className="text-[#C5F82A] font-mono text-sm tracking-wider uppercase mb-2 block">План развития</span>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Маршрут от теории к Pro</h2>
        <p className="text-slate-400 text-lg max-w-3xl">
          Тренажёр — это ключевой этап между получением сертификата и реальной работой.
          Построй свою карьеру осознанно и уверенно.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-stretch gap-6">
        <RoadmapItem
          title="Шаг 1. Теория (Курсы)"
          desc="Изучение основ: термины, инструменты, платформы. Получение базовых знаний и сертификата."
          color="bg-indigo-500"
          icon={<AlertCircle size={24} />}
        />
        <div className="flex items-center justify-center md:py-16 text-slate-500">
          <ArrowRight size={32} className="rotate-90 md:rotate-0" />
        </div>
        <RoadmapItem
          title="Шаг 2. Практика (Тренажёр)"
          desc="Моделирование реальных ситуаций: переговоры, слив бюджета, правки клиента. Перевод знаний в навык."
          color="bg-[#C5F82A]"
          icon={<Zap size={24} className="text-black" />}
          active={true}
        />
        <div className="flex items-center justify-center md:py-16 text-slate-500">
          <ArrowRight size={32} className="rotate-90 md:rotate-0" />
        </div>
        <RoadmapItem
          title="Шаг 3. Реальный клиент"
          desc="Уверенное начало работы. Сбор портфолио, повышение чека и масштабирование проектов."
          color="bg-emerald-500"
          icon={<BarChart3 size={24} />}
        />
      </div>
    </div>
  </section>
);

const RoadmapItem = ({ title, desc, color, icon, active }: { title: string; desc: string; color: string; icon: React.ReactNode; active?: boolean }) => (
  <div className={`p-6 rounded-2xl border border-white/10 flex-1 relative ${active ? 'bg-[#1A1D24] shadow-[0_0_20px_rgba(197,248,42,0.2)]' : 'bg-[#16181D]'} transition-all duration-300 hover:-translate-y-1`}>
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-4`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    {active && (
      <div className="absolute -top-3 -right-3 bg-[#C5F82A] text-black text-xs font-bold px-3 py-1 rounded-full uppercase">
        ТЫ ЗДЕСЬ
      </div>
    )}
  </div>
);

const AuthorSection = () => (
  <section className="py-20 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 text-left">
        <span className="text-[#C5F82A] font-mono text-sm tracking-wider uppercase mb-2 block">АВТОР ТРЕНАЖЕРА</span>
      </div>
      
      <div className="bg-[#1A1D24] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
            <img
              src="https://static.tildacdn.com/tild6166-3230-4237-b038-653365653561/noroot.png"
              alt="Ирина Войтович, маркетинг-наставник"
              className="w-40 h-40 object-cover object-top rounded-full border-4 border-[#C5F82A] mb-4 shadow-lg"
              onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/160x160/1A1D24/C5F82A?text=IRINA"; }}
            />
            <h3 className="text-3xl font-bold text-white">Ирина Войтович</h3>
            <p className="text-[#C5F82A] font-medium mb-4">Маркетинг-наставник</p>
            
            <a
              href="https://t.me/+X7c94gFH618wODIy"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => reachGoal(MetrikaGoals.BUTTON_TELEGRAM_CHANNEL)}
              className="flex items-center gap-2 bg-[#C5F82A] text-black px-6 py-3 rounded-full font-bold text-sm transition-all hover:opacity-90 mt-4 shadow-md transform hover:scale-105"
              data-testid="button-telegram-channel"
            >
              <Send size={18} />
              Канал «Маркетинг среднего возраста»
            </a>
          </div>
          <div className="md:col-span-2 text-left pt-6 md:pt-0">
            <p className="text-slate-200 text-lg leading-relaxed mb-6">
              Моя миссия — быть рядом с теми, кто стоит на пороге новой профессии и боится шагнуть. Я помогаю увидеть, что всё не так страшно, что ошибки — часть пути,
              и что в маркетинге можно не выживать, а развиваться — спокойно, с опорой и смыслом.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AuthorDetailCard
                icon={<BarChart3 size={24} className="text-[#C5F82A]" />}
                title="Опыт в маркетинге"
                desc="7 лет в маркетинге, продажах и аналитике. Продвигаю B2C и B2B."
              />
              <AuthorDetailCard
                icon={<School size={24} className="text-purple-400" />}
                title="Обучение"
                desc="Обучаю маркетингу в Skypro (Skyeng). Автор модуля по веб-аналитике."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const AuthorDetailCard = ({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) => (
  <div className="p-4 rounded-xl bg-[#16181D] border border-white/5 hover:border-white/10 transition-all">
    <div className="flex items-center gap-3 mb-2">
      {icon}
      <h4 className="text-lg font-bold text-white">{title}</h4>
    </div>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

const BentoCard = ({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) => (
  <div className="bg-[#16181D] p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all hover:-translate-y-1 duration-300 group h-full">
    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

const StepItem = ({ number, title, desc }: { number: string; title: string; desc: string }) => (
  <div className="relative pl-12 group">
    <div className="absolute left-0 top-1 w-10 h-10 bg-[#1A1D24] border border-white/10 rounded-full flex items-center justify-center text-sm font-bold text-slate-400 group-hover:border-[#C5F82A] group-hover:text-[#C5F82A] transition-colors z-10 shadow-lg">
      {number}
    </div>
    <h4 className="text-xl font-bold text-white mb-1">{title}</h4>
    <p className="text-slate-400 text-sm">{desc}</p>
  </div>
);

const PricingItem = ({ text, active, highlight, icon: IconComponent }: { text: string; active: boolean; highlight?: boolean; icon?: any }) => (
  <li className={`flex items-start gap-3 text-sm ${active ? (highlight ? 'text-white' : 'text-slate-200') : 'text-slate-600'}`}>
    {active ? (
      <div className={`rounded-full p-0.5 mt-0.5 flex-shrink-0 ${highlight ? 'bg-[#C5F82A] text-black' : 'bg-slate-700 text-slate-300'}`}>
        {IconComponent ? <IconComponent size={12} /> : <CheckCircle2 size={12} />}
      </div>
    ) : (
      <Lock size={12} className="mt-0.5 flex-shrink-0 text-slate-600" />
    )}
    <span>{text}</span>
  </li>
);

const WhyCard = ({ title, desc }: { title: string; desc: string }) => (
  <div className="p-6 bg-gradient-to-r from-[#16181D] to-[#121418] rounded-xl border border-white/5 shadow-md hover:border-white/10 transition-all">
    <h4 className="text-xl font-bold text-[#C5F82A] mb-2">{title}</h4>
    <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

const ResultItem = ({ text }: { text: string }) => (
  <div className="flex items-start gap-3">
    <ShieldCheck className="w-5 h-5 flex-shrink-0 text-[#C5F82A] mt-1" />
    <p className="text-lg text-white leading-relaxed">{text}</p>
  </div>
);
