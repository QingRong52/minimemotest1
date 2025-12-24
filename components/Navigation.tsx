
import React from 'react';
import { Page } from '../types';

interface Props {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const Navigation: React.FC<Props> = ({ currentPage, onNavigate }) => {
  const tabs = [
    { id: Page.DASHBOARD, label: '主页', icon: '🏠' },
    { id: Page.TASKS, label: '工作', icon: '📝' },
    { id: Page.TRAIN, label: '修炼', icon: '⚡' },
    { id: Page.STATS, label: '飞升', icon: '📈' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 z-40 pointer-events-none">
      <nav className="max-w-md mx-auto glass border border-white/50 shadow-2xl rounded-[32px] flex justify-around items-center py-4 pointer-events-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className={`flex flex-col items-center gap-1 transition-all duration-300 relative ${currentPage === tab.id ? 'scale-110' : 'opacity-40 grayscale hover:opacity-100'}`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className={`text-[8px] font-black uppercase tracking-tighter ${currentPage === tab.id ? 'text-gray-900' : 'text-gray-400'}`}>{tab.label}</span>
            {currentPage === tab.id && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full animate-ping" />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Navigation;
