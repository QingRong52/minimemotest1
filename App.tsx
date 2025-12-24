
import React, { useState, useEffect, useCallback } from 'react';
import { UserConfig, Task, Page, TrainingStats, DayHistory } from './types';
import { DEFAULT_CONFIG } from './constants';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Train from './pages/Train';
import Stats from './pages/Stats';
import ZombieMode from './pages/ZombieMode';
import CalendarView from './pages/CalendarView';
import Navigation from './components/Navigation';

const App: React.FC = () => {
  const [config, setConfig] = useState<UserConfig>(() => {
    const saved = localStorage.getItem('fish_slacker_config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('fish_slacker_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [stats, setStats] = useState<TrainingStats>(() => {
    const saved = localStorage.getItem('fish_slacker_stats');
    return saved ? JSON.parse(saved) : { typingMinutes: 0, readingCount: 0, copyMinutes: 0 };
  });

  const [history] = useState<DayHistory[]>(() => {
    const saved = localStorage.getItem('fish_slacker_history');
    if (saved) return JSON.parse(saved);
    // Initial mock history
    const mock = [
      { date: '2025-05-10', completedCount: 3, totalCount: 3 },
      { date: '2025-05-11', completedCount: 1, totalCount: 3 },
      { date: '2025-05-12', completedCount: 2, totalCount: 3 },
    ];
    return mock;
  });

  const [currentPage, setCurrentPage] = useState<Page>(() => {
    return localStorage.getItem('fish_slacker_config') ? Page.DASHBOARD : Page.ONBOARDING;
  });

  const [isBossMode, setIsBossMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('fish_slacker_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('fish_slacker_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('fish_slacker_stats', JSON.stringify(stats));
  }, [stats]);

  const handleDoubleClick = useCallback(() => {
    setIsBossMode(prev => !prev);
  }, []);

  useEffect(() => {
    const handleGlobalDoubleClick = () => {
      handleDoubleClick();
    };
    window.addEventListener('dblclick', handleGlobalDoubleClick);
    return () => window.removeEventListener('dblclick', handleGlobalDoubleClick);
  }, [handleDoubleClick]);

  if (isBossMode) {
    return (
      <div 
        className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center p-8 cursor-none"
        onDoubleClick={() => setIsBossMode(false)}
      >
        <img 
          src="https://picsum.photos/seed/excel/1200/800" 
          alt="Fake Excel" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute top-4 left-4 text-xs text-gray-600 font-mono">
          系统数据分析 - 正在载入工作簿...
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case Page.ONBOARDING:
        return <Onboarding onComplete={(newConfig) => {
          setConfig(newConfig);
          setCurrentPage(Page.DASHBOARD);
        }} />;
      case Page.DASHBOARD:
        return <Dashboard config={config} />;
      case Page.TASKS:
        return <Tasks 
          tasks={tasks} 
          setTasks={setTasks} 
          onZombieMode={() => setCurrentPage(Page.ZOMBIE)} 
          onOpenCalendar={() => setCurrentPage(Page.CALENDAR)}
        />;
      case Page.TRAIN:
        return <Train setStats={setStats} />;
      case Page.STATS:
        return <Stats config={config} stats={stats} tasks={tasks} />;
      case Page.ZOMBIE:
        return <ZombieMode onExit={() => setCurrentPage(Page.TASKS)} />;
      case Page.CALENDAR:
        return <CalendarView history={history} onBack={() => setCurrentPage(Page.TASKS)} />;
      default:
        return <Dashboard config={config} />;
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto relative flex flex-col bg-[#f7f8f2]">
      <main className="flex-1 pb-24 overflow-y-auto">
        {renderPage()}
      </main>
      
      {currentPage !== Page.ONBOARDING && currentPage !== Page.ZOMBIE && (
        <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      )}

      {/* Persistent SOS Trigger */}
      {currentPage === Page.DASHBOARD && (
        <button 
          onClick={() => {
            const btn = document.getElementById('sos-trigger');
            if (btn) btn.click();
          }}
          className="fixed bottom-24 right-6 w-10 h-10 rounded-full bg-white border border-gray-100 shadow-lg flex flex-col items-center justify-center text-orange-500 hover:text-orange-600 transition-colors z-50"
        >
          <span className="text-[10px] font-black leading-none">求助</span>
          <span className="text-[8px] font-bold">SOS</span>
        </button>
      )}
    </div>
  );
};

export default App;
