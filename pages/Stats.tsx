
import React, { useMemo } from 'react';
import { UserConfig, TrainingStats, Task } from '../types';

interface Props {
  config: UserConfig;
  stats: TrainingStats;
  tasks: Task[];
}

const Stats: React.FC<Props> = ({ config, stats, tasks }) => {
  const portfolioValue = useMemo(() => {
    return (stats.typingMinutes * 5) + (stats.readingCount * 50) + (stats.copyMinutes * 2);
  }, [stats]);

  const statsItems = [
    { label: '打字特训', val: stats.typingMinutes, unit: 'min', color: '#d6f5d6', textColor: '#2e7d32' },
    { label: '阅读进阶', val: stats.readingCount, unit: '篇', color: '#d0e1ff', textColor: '#1565c0' },
    { label: '临摹练习', val: stats.copyMinutes, unit: 'min', color: '#f9f3d1', textColor: '#f9a825' },
  ];

  return (
    <div className="p-8">
      <header className="mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-1">飞升概况</h2>
        <p className="text-xs text-gray-400 font-medium">大人身价正在指数级增长</p>
      </header>

      <div className="bg-black p-10 rounded-[48px] shadow-2xl mb-10 relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">当前作品集价值</p>
          <div className="flex items-baseline gap-2">
            <span className="text-xl text-green-400 font-bold">¥</span>
            <h3 className="text-5xl font-black text-white tracking-tighter">{portfolioValue.toLocaleString()}</h3>
          </div>
          <p className="text-[10px] text-gray-400 mt-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            阶级跃迁中...
          </p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </div>

      <div className="grid grid-cols-1 gap-4 mb-10">
        {statsItems.map((item, idx) => (
          <div key={idx} style={{ backgroundColor: item.color }} className="p-6 rounded-[32px] flex items-center justify-between shadow-sm border border-white/50">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-50" style={{ color: item.textColor }}>{item.label}</p>
              <div className="flex items-baseline gap-1" style={{ color: item.textColor }}>
                 <span className="text-2xl font-black">{item.val}</span>
                 <span className="text-xs font-bold">{item.unit}</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white/40 flex items-center justify-center text-xl">
               {idx === 0 ? '⌨️' : idx === 1 ? '📚' : '🎨'}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-[40px] card-shadow">
        <div className="flex justify-between items-end mb-6">
           <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">身价目标</p>
              <p className="text-lg font-bold text-gray-800">¥ {config.targetSalary} /h</p>
           </div>
           <div className="text-right">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">完成度</p>
              <p className="text-lg font-bold text-blue-500">{Math.min(100, Math.round((config.currentSalary / config.targetSalary) * 100))}%</p>
           </div>
        </div>
        <div className="w-full h-4 bg-gray-50 rounded-2xl border-4 border-white shadow-inner overflow-hidden">
           <div 
            className="h-full bg-blue-400 rounded-full" 
            style={{ width: `${Math.min(100, (config.currentSalary / config.targetSalary) * 100)}%` }} 
           />
        </div>
        <p className="text-center text-[10px] text-gray-400 mt-6 font-bold uppercase tracking-widest italic">大人，小的时刻追随您的光芒</p>
      </div>
    </div>
  );
};

export default Stats;
