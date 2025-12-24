
import React from 'react';
import { DayHistory } from '../types';

interface Props {
  history: DayHistory[];
  onBack: () => void;
}

const CalendarView: React.FC<Props> = ({ history, onBack }) => {
  return (
    <div className="p-8 h-screen bg-[#ffe6d1] flex flex-col animate-fade-in">
      <header className="flex items-center gap-4 mb-8 shrink-0">
        <button 
          onClick={onBack}
          className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm text-gray-400 hover:text-gray-800"
        >
          ←
        </button>
        <div>
          <h2 className="text-2xl font-black text-[#2e3a59]">打卡记录</h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">大人的复仇轨迹</p>
        </div>
      </header>

      <div className="flex-1 bg-white rounded-[40px] p-8 shadow-xl overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-8">
           <span className="text-xs font-bold text-gray-400">2025年 5月</span>
           <div className="flex gap-2">
              <div className="flex items-center gap-1">
                 <div className="w-2 h-2 rounded-full bg-[#7d5dfc]"></div>
                 <span className="text-[8px] font-bold text-gray-400 uppercase">全胜</span>
              </div>
              <div className="flex items-center gap-1">
                 <div className="w-2 h-2 rounded-full bg-orange-200"></div>
                 <span className="text-[8px] font-bold text-gray-400 uppercase">努力中</span>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-7 gap-3 mb-8">
          {['日', '一', '二', '三', '四', '五', '六'].map(d => (
            <div key={d} className="text-center text-[10px] font-black text-gray-300 mb-2">{d}</div>
          ))}
          {/* Mock Grid - Assuming starts on Thursday for demo purposes */}
          {[...Array(3)].map((_, i) => <div key={`empty-${i}`} />)}
          {[...Array(31)].map((_, i) => {
            const dayNum = i + 1;
            const dateStr = `2025-05-${dayNum.toString().padStart(2, '0')}`;
            const record = history.find(h => h.date === dateStr);
            const isToday = dayNum === 13; // Simulated today
            
            let statusClass = "bg-gray-50 text-gray-300";
            if (record) {
              if (record.completedCount === record.totalCount) statusClass = "bg-[#7d5dfc] text-white shadow-lg shadow-[#7d5dfc]/30";
              else statusClass = "bg-orange-100 text-orange-500";
            } else if (isToday) {
              statusClass = "border-2 border-[#7d5dfc] text-[#7d5dfc] font-black";
            }

            return (
              <div 
                key={dayNum} 
                className={`aspect-square flex flex-col items-center justify-center rounded-xl text-[10px] font-bold transition-all ${statusClass}`}
              >
                {dayNum}
                {record && (
                  <div className="mt-0.5 flex gap-0.5">
                    {[...Array(record.totalCount)].map((_, j) => (
                      <div key={j} className={`w-[2px] h-[2px] rounded-full ${j < record.completedCount ? 'bg-white' : 'bg-white/40'}`} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-[#f8f9fe] p-6 rounded-[32px] border border-gray-50">
           <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">本月成就</h4>
           <div className="space-y-4">
              <div className="flex justify-between items-center">
                 <span className="text-xs font-bold text-[#2e3a59]">全胜天数</span>
                 <span className="text-lg font-black text-[#7d5dfc]">8 天</span>
              </div>
              <div className="flex justify-between items-center">
                 <span className="text-xs font-bold text-[#2e3a59]">累计修为</span>
                 <span className="text-lg font-black text-[#7d5dfc]">1200 exp</span>
              </div>
           </div>
        </div>
      </div>
      
      <p className="mt-8 text-center text-[10px] text-gray-500 font-bold uppercase tracking-widest italic shrink-0">
        "大人走的每一步，小的都为您铭记。"
      </p>
    </div>
  );
};

export default CalendarView;
