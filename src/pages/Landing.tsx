import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageCircle,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Play,
  Zap,
  Lock,
  Unlock,
  ArrowRight,
  Target,
  Users,
  ShieldCheck,
  Send,
  Download,
  School,
  ChevronDown,
  ChevronUp,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const LOGO_URL = "https://static.tildacdn.com/tild3339-6163-4562-b862-373037323038/___.png";

// Helper Components
const NavLink = ({ href, label }: { href: string; label: string }) => (
  <a href={href} className="hover:text-[#C5F82A] transition-colors">
    {label}
  </a>
);

const StatBox = ({ 
  value, 
  label, 
  accentColor 
}: { 
  value: string; 
  label: string; 
  accentColor: string;
}) => (
  <div className="bg-[#16181D] p-4 rounded-xl border border-white/5">
    <div className={`text-2xl font-bold ${accentColor} mb-1`}>{value}</div>
    <div className="text-xs text-slate-500 uppercase tracking-wide">{label}</div>
  </div>
);

const Bar = ({ 
  height, 
  color, 
  tooltip, 
  final = false 
}: { 
  height: string; 
  color: string; 
  tooltip: string; 
  final?: boolean;
}) => (
  <div className="flex-1 flex flex-col justify-end group relative">
    <div 
      className={`${color} rounded-t-md transition-all group-hover:opacity-80 ${final ? 'shadow-[0_0_15px_rgba(197,248,42,0.4)]' : ''}`}
      style={{ height }}
    ></div>
    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
      {tooltip}
    </div>
  </div>
);

const BentoCard = ({ 
  icon, 
  title, 
  desc 
}: { 
  icon: React.ReactNode; 
  title: string; 
  desc: string;
}) => (
  <div className="bg-[#16181D] p-6 rounded-2xl border border-white/10 hover:border-[#C5F82A]/30 transition-all group">
    <div className="mb-4 transform group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

const StepItem = ({ 
  number, 
  title, 
  desc 
}: { 
  number: string; 
  title: string; 
  desc: string;
}) => (
  <div className="flex gap-6 relative">
    <div className="w-10 h-10 rounded-full bg-[#C5F82A] text-black font-bold flex items-center justify-center text-sm flex-shrink-0 relative z-10">
      {number}
    </div>
    <div className="flex-1 pb-2">
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400">{desc}</p>
    </div>
  </div>
);

const FAQItem = ({ 
  question, 
  answer 
}: { 
  question: string; 
  answer: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="bg-[#16181D] border border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-6 flex justify-between items-center hover:bg-white/5 transition-colors"
      >
        <span className="text-lg font-semibold text-white pr-4">{question}</span>
        {isOpen ? <ChevronUp className="text-[#C5F82A] flex-shrink-0" /> : <ChevronDown className="text-slate-400 flex-shrink-0" />}
      </button>
      {isOpen && (
        <div className="px-6 pb-6 text-slate-400 leading-relaxed border-t border-white/5 pt-4">
          {answer}
        </div>
      )}
    </div>
  );
};

export default function Landing() {
  const { user, openAuthModal } = useAuth();

  return (
    <div className="min-h-screen bg-[#0B0C10] text-slate-200 font-sans selection:bg-[#C5F82A] selection:text-black overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-[#0B0C10]/80 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
          <div className="text-xl font-bold tracking-tighter text-white flex items-center gap-2">
            <img
              src={LOGO_URL}
              alt="Логотип Твой первый клиент"
              className="h-10 md:h-12 object-contain"
              onError={(e) => { 
                const target = e.target as HTMLImageElement;
                target.onerror = null; 
                target.src = "https://placehold.co/100x40/0B0C10/C5F82A?text=LOGO"; 
              }}
            />
          </div>

          <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-300">
            <NavLink href="#главная" label="Главная" />
            <NavLink href="#тариф" label="Тариф" />
            <NavLink href="#отзывы" label="Отзывы" />
            <NavLink href="#faq" label="FAQ" />
          </div>

          {user ? (
            <Link to="/trainer">
              <Button className="hidden md:block">
                К тренажеру
              </Button>
            </Link>
          ) : (
            <Button 
              className="hidden md:block"
              variant="outline"
              onClick={() => openAuthModal('login')}
              data-testid="button-login"
            >
              Войти
            </Button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header id="главная" className="relative pt-32 pb-20 md:pt-48 md:pb-20 px-4">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#C5F82A] opacity-[0.07] blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#C5F82A] animate-pulse"></span>
            <span className="text-xs md:text-sm font-medium text-slate-300 tracking-wide uppercase">
              Симулятор реальной работы
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-8">
            Твой первый клиент — <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5F82A] to-emerald-400">
              без страха и хаоса
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Практический тренажёр для маркетологов-новичков: попробуй вести переговоры, получать правки, 
            запускать рекламу и делать отчёт — как в реальных проектах, но в безопасной среде.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            {user ? (
              <Link to="/trainer">
                <Button 
                  size="lg"
                  className="w-full md:w-auto bg-[#C5F82A] hover:bg-[#b2e615] text-black px-8 py-6 text-lg shadow-[0_0_20px_rgba(197,248,42,0.3)]"
                  data-testid="button-start-free"
                >
                  Начать бесплатно
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            ) : (
              <Button 
                size="lg"
                className="w-full md:w-auto bg-[#C5F82A] hover:bg-[#b2e615] text-black px-8 py-6 text-lg shadow-[0_0_20px_rgba(197,248,42,0.3)]"
                onClick={() => openAuthModal('register')}
                data-testid="button-start-free"
              >
                Начать бесплатно
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            )}
            
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
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-white">Результаты кампании</h3>
                  <div className="h-8 w-24 bg-[#C5F82A] rounded-full flex items-center justify-center text-black text-xs font-bold shadow-md">
                    Запуск
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <StatBox value="2.4%" label="CTR (Кликбельность)" accentColor="text-[#C5F82A]" />
                  <StatBox value="750 ₽" label="Цена лида (CPL)" accentColor="text-red-400" />
                  <StatBox value="200/250" label="KPI лидов" accentColor="text-blue-400" />
                </div>

                <div className="mt-6">
                  <div className="text-slate-500 text-sm mb-2">Динамика конверсий</div>
                  <div className="flex gap-4 items-end h-32 pb-2 border-b border-white/10">
                    <Bar height="40%" color="bg-indigo-500/20" tooltip="День 1: 0.8%" />
                    <Bar height="60%" color="bg-indigo-500/40" tooltip="День 2: 1.2%" />
                    <Bar height="85%" color="bg-[#C5F82A]" tooltip="День 3: 2.4%" final={true} />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 uppercase tracking-widest pt-2">
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

      {/* For Whom Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <span className="text-[#C5F82A] font-mono text-sm tracking-wider uppercase mb-2 block">
              Аудитория
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Кому это подходит?</h2>
            <p className="text-slate-400 text-lg">
              Если ты закончил <span className="text-[#C5F82A] font-bold">теоретический курс</span>, 
              но боишься брать первого клиента — начни здесь.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <BentoCard
              icon={<Users className="text-blue-400 w-8 h-8" />}
              title="Новичкам без практики"
              desc="Знаешь теорию, но никогда не запускал рекламу за реальные деньги."
            />
            <BentoCard
              icon={<MessageCircle className="text-purple-400 w-8 h-8" />}
              title="Боишься переговоров"
              desc="Не знаешь, как отвечать на неудобные вопросы и оценивать свою работу."
            />
            <BentoCard
              icon={<Zap className="text-orange-400 w-8 h-8" />}
              title="Путаница в кабинетах"
              desc="Интерфейсы пугают? Научимся нажимать правильные кнопки без паники."
            />
            <BentoCard
              icon={<Target className="text-[#C5F82A] w-8 h-8" />}
              title="Нужен реальный кейс"
              desc="Вместо абстрактных учебных задач — симуляция живого проекта."
            />
          </div>
        </div>
      </section>

      {/* What's Inside Section */}
      <section className="py-20 px-4 bg-[#0F1116] relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#C5F82A] font-mono text-sm tracking-wider uppercase mb-2 block">
                Что внутри
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Полный маршрут маркетолога</h2>
              <p className="text-slate-400 text-lg mb-12">
                От первого неуверенного «алло» до отправки финального отчёта. 
                Пройди этот путь виртуально, чтобы в реальности чувствовать себя профи.
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

            <div className="relative">
              <div className="bg-[#1A1D24] border border-white/10 rounded-3xl p-8 relative z-10 aspect-square flex flex-col justify-between overflow-hidden group hover:shadow-[0_0_30px_rgba(197,248,42,0.1)] transition-shadow">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5F82A] blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity"></div>

                <div>
                  <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full text-xs text-slate-300 mb-4 border border-white/5">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    Входящее сообщение
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Диалог с заказчиком</h3>
                  <p className="text-slate-400 text-sm">
                    Клиент недоволен цветом кнопки на баннере. Твои действия?
                  </p>
                </div>

                <div className="mt-8 space-y-3">
                  <button className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#C5F82A]/50 transition-all text-sm text-slate-200">
                    <span className="block text-xs text-slate-500 mb-1">Вариант А</span>
                    Переделать сразу по требованию
                  </button>
                  <button className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#C5F82A]/50 transition-all text-sm text-slate-200">
                    <span className="block text-xs text-slate-500 mb-1">Вариант Б</span>
                    Уточнить, почему цвет не подходит
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#C5F82A] font-mono text-sm tracking-wider uppercase mb-2 block">
              FAQ
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Частые вопросы</h2>
          </div>

          <div className="space-y-4">
            <FAQItem 
              question="Это настоящий рекламный кабинет?"
              answer="Нет, это симулятор. Вы не тратите реальные деньги, но интерфейс максимально приближен к настоящему рекламному кабинету. Все действия безопасны."
            />
            <FAQItem 
              question="Сколько времени занимает прохождение?"
              answer="В среднем 1-2 часа. Вы можете делать паузы и возвращаться к тренажёру в любое время."
            />
            <FAQItem 
              question="Нужны ли предварительные знания?"
              answer="Да, базовое понимание таргетированной рекламы желательно. Тренажёр подходит тем, кто изучил теорию, но боится практики."
            />
            <FAQItem 
              question="Могу ли я пройти тренажёр несколько раз?"
              answer="Конечно! После покупки премиум-доступа вы можете проходить тренажёр сколько угодно раз."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="тариф" className="py-20 px-4 bg-[#0F1116]">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[#C5F82A] font-mono text-sm tracking-wider uppercase mb-2 block">
            Тариф
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Простая и честная цена</h2>
          <p className="text-slate-400 text-lg mb-12">
            Попробуйте бесплатно или получите полный доступ к премиум функциям.
          </p>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="bg-[#16181D] border border-white/10 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-2">Бесплатно</h3>
              <div className="text-4xl font-bold text-white mb-6">
                0 ₽
              </div>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#C5F82A] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Первый диалог с клиентом</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#C5F82A] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Базовые функции тренажера</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lock className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-500">Полный кейс заблокирован</span>
                </li>
              </ul>
              {user ? (
                <Link to="/trainer">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    data-testid="button-try-free"
                  >
                    Попробовать
                  </Button>
                </Link>
              ) : (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => openAuthModal('register')}
                  data-testid="button-try-free"
                >
                  Попробовать
                </Button>
              )}
            </div>

            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-[#C5F82A]/20 to-[#16181D] border-2 border-[#C5F82A] rounded-2xl p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C5F82A] text-black px-4 py-1 rounded-full text-xs font-bold">
                Рекомендуем
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Премиум</h3>
              <div className="text-4xl font-bold text-white mb-1">
                790 ₽
              </div>
              <div className="text-sm text-slate-400 mb-6 line-through">2 900 ₽</div>
              <ul className="space-y-3 mb-8 text-left">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#C5F82A] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Полный кейс от начала до конца</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#C5F82A] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Симулятор рекламного кабинета</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#C5F82A] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Экспорт диалогов в .docx</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#C5F82A] flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">Безлимитные повторные прохождения</span>
                </li>
              </ul>
              <Link to="/payment">
                <Button 
                  className="w-full bg-[#C5F82A] hover:bg-[#b2e615] text-black"
                  data-testid="button-buy-premium"
                >
                  Получить доступ
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm text-slate-500">
              © 2025 Твой первый клиент. Все права защищены.
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/oferta" className="text-slate-400 hover:text-[#C5F82A] transition-colors">
                Договор-оферта
              </Link>
              <a href="https://t.me/irinavoitovich" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#C5F82A] transition-colors">
                Связаться с автором
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
