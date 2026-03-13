'use client';

import { useState, useEffect } from 'react';

type Activity = {
  time: string;
  task: string;
  advice: string;
};

type DaySchedule = {
  day: string;
  activities: Activity[];
};

const translations = {
  ru: {
    title: "Palli-Palli Планировщик 🚀",
    subtitle: "Закинь задачи, и AI раскидает их до воскресенья.",
    placeholder: "Список дел:\n- Выучить React\n- Сделать MVP\n- Поспать",
    koreanMode: "🔥 Режим Корейского Студента",
    normalMode: "☕ Обычный режим",
    generate: "Составить план",
    analyzing: "Анализирую...",
    hours: "ч",
    settings: "Настройки генерации",
    startTime: "Начало дня",
    endTime: "Конец дня",
    aiRoleTitle: "🤖 Какую роль играет ИИ?",
    aiRoleDesc: "Искусственный интеллект (LLM) анализирует сложность ваших задач, понимает контекст и распределяет их по свободным слотам вашего расписания, учитывая выбранный режим продуктивности.",
    errorServer: "Ошибка: Не удалось подключиться к серверу. Убедитесь, что backend запущен на порту 8000.",
    errorUnknown: "Неизвестная ошибка",
    complexity: {
      High: "Высокая",
      Medium: "Средняя",
      Low: "Низкая",
    },
  },
  en: {
    title: "Palli-Palli Planner 🚀",
    subtitle: "Throw in tasks, AI schedules them by Sunday.",
    placeholder: "Task list:\n- Learn React\n- Build MVP\n- Sleep",
    koreanMode: "🔥 Korean Student Mode",
    normalMode: "☕ Normal Mode",
    generate: "Create Plan",
    analyzing: "Analyzing...",
    hours: "h",
    settings: "Generation Settings",
    startTime: "Start Time",
    endTime: "End Time",
    aiRoleTitle: "🤖 What is the AI's role?",
    aiRoleDesc: "Artificial Intelligence (LLM) analyzes the complexity of your tasks, understands context, and distributes them into available slots in your schedule, considering the selected productivity mode.",
    errorServer: "Error: Could not connect to server. Ensure backend is running on port 8000.",
    errorUnknown: "Unknown error",
    complexity: {
      High: "High",
      Medium: "Medium",
      Low: "Low",
    },
  },
  ko: {
    title: "PALLI-PALLI 태스크 트래커 ⚡",
    subtitle: "할 일을 입력하면 AI가 일요일까지 계획해줍니다.",
    placeholder: "할 일 목록:\n- 리액트 공부\n- MVP 만들기\n- 잠자기",
    koreanMode: "🔥 한국 학생 모드 (K-Student Mode)",
    normalMode: "☕ 일반 모드",
    generate: "일정 생성 (GENERATE)",
    analyzing: "분석 중...",
    hours: "h",
    settings: "생성 설정",
    startTime: "시작 시간",
    endTime: "종료 시간",
    aiRoleTitle: "🤖 AI의 역할은 무엇인가요?",
    aiRoleDesc: "인공지능(LLM)이 작업의 난이도를 분석하고 문맥을 이해하여 선택한 생산성 모드에 따라 일정의 빈 슬롯에 배분합니다.",
    errorServer: "오류: 서버에 연결할 수 없습니다. 백엔드가 8000 포트에서 실행 중인지 확인하세요.",
    errorUnknown: "알 수 없는 오류",
    complexity: {
      High: "High",
      Medium: "Medium",
      Low: "Low",
    },
  }
};

type Lang = 'ko' | 'ru' | 'en';

export default function SchedulePage() {
  const [inputTasks, setInputTasks] = useState('');
  const [koreanMode, setKoreanMode] = useState(true);
  const [language, setLanguage] = useState<Lang>('ko');
  const [startTime, setStartTime] = useState('07:00');
  const [endTime, setEndTime] = useState('23:00');
  const [schedule, setSchedule] = useState<DaySchedule[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAiInfo, setShowAiInfo] = useState(false);

  useEffect(() => {
    const savedSchedule = localStorage.getItem('palli-schedule');
    if (savedSchedule) {
      try {
        setSchedule(JSON.parse(savedSchedule));
      } catch (e) {
        console.error('Ошибка загрузки расписания', e);
      }
    }
  }, []);

  useEffect(() => {
    if (schedule) {
      localStorage.setItem('palli-schedule', JSON.stringify(schedule));
    }
  }, [schedule]);

  const t = translations[language];

  const handleGenerate = async () => {
    if (!inputTasks.trim()) return;
    setLoading(true);
    setSchedule(null);

    try {
      const res = await fetch('http://localhost:8000/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tasks: inputTasks, 
          korean_student_mode: koreanMode,
          language: language,
          start_time: startTime,
          end_time: endTime
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || `Ошибка сервера: ${res.status}`);
      }
      
      const data = await res.json();
      setSchedule(data.schedule || data);
    } catch (e) {
      console.error(e);
      let errorMessage = 'Неизвестная ошибка';
      if (e instanceof Error) {
        if (e.message.includes('fetch')) {
          errorMessage = t.errorServer;
        } else {
          errorMessage = e.message;
        }
      }
      alert(`Ошибка: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] p-8 font-sans text-gray-100">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <header className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight text-[#eab308] mb-2 drop-shadow-md">
              {t.title}
            </h1>
            <p className="text-gray-400 max-w-lg">
              {t.subtitle}
            </p>
          </div>
          
          <div className="flex bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-700">
            {(['ko', 'ru', 'en'] as Lang[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${
                  language === lang 
                    ? 'bg-[#eab308] text-black' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gray-900/50 p-6 rounded-2xl shadow-lg shadow-black/40 border border-gray-800 space-y-4">
            <textarea
              className="w-full p-4 border border-gray-700 rounded-xl focus:ring-2 focus:ring-[#eab308] focus:border-transparent focus:outline-none min-h-[200px] bg-[#1e1e1e] text-gray-200 placeholder:text-gray-500 transition-all resize-none font-mono"
              placeholder={t.placeholder}
              value={inputTasks}
              onChange={(e) => setInputTasks(e.target.value)}
            />
            
            <div className="flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className={`w-full md:w-auto px-8 py-3 rounded-xl font-bold text-black transition-all transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                  koreanMode
                    ? 'bg-[#eab308] hover:bg-yellow-400 shadow-yellow-900/20'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {loading ? t.analyzing : t.generate}
              </button>
            </div>
          </div>

          <div className="bg-gray-900/50 p-6 rounded-2xl shadow-lg shadow-black/40 border border-gray-800 space-y-6">
            <h3 className="font-bold text-gray-200 border-b border-gray-800 pb-2">
              ⚙️ {t.settings}
            </h3>

            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer select-none group">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={koreanMode}
                    onChange={(e) => setKoreanMode(e.target.checked)}
                  />
                  <div className="w-12 h-7 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#121212] after:border-gray-600 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#eab308]"></div>
                </div>
                <span className={`text-sm font-medium transition-colors ${koreanMode ? 'text-[#eab308]' : 'text-gray-400'}`}>
                  {koreanMode ? t.koreanMode : t.normalMode}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">{t.startTime}</label>
                <input 
                  type="time" 
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full p-2 bg-[#1e1e1e] border border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-[#eab308] text-gray-200 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">{t.endTime}</label>
                <input 
                  type="time" 
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full p-2 bg-[#1e1e1e] border border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-[#eab308] text-gray-200 outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800">
              <button 
                onClick={() => setShowAiInfo(!showAiInfo)}
                className="flex items-center text-xs text-gray-500 hover:text-[#eab308] font-medium transition-colors"
              >
                <span className="mr-1">ℹ️</span> {t.aiRoleTitle}
              </button>
              
              {showAiInfo && (
                <div className="mt-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700 text-xs text-gray-400 leading-relaxed">
                  {t.aiRoleDesc}
                </div>
              )}
            </div>
          </div>
        </div>

        {schedule && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"> 
            {schedule.map((day, idx) => (
              <div 
                key={idx} 
                className="bg-gray-900/50 p-5 rounded-2xl shadow-lg shadow-black/20 border border-gray-800 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-800">
                  <h3 className="font-bold text-lg text-[#eab308]">{day.day}</h3>
                </div>
                <ul className="space-y-3 flex-1">
                  {day.activities.map((activity, tIdx) => (
                    <li key={tIdx} className="bg-[#1e1e1e] p-3 rounded-lg text-sm border border-gray-800 hover:border-[#eab308]/50 transition-colors group">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-gray-200">{activity.task}</span>
                        <span className="text-xs font-mono text-[#eab308] bg-yellow-900/20 px-1.5 py-0.5 rounded">
                          {activity.time}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-gray-500 italic border-l-2 border-gray-700 pl-2 group-hover:text-gray-400 group-hover:border-[#eab308] transition-all">
                        "{activity.advice}"
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
