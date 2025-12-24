
import React, { useState, useEffect, useMemo } from 'react';
import { UserConfig } from '../types';
import { getHumbleEncouragement } from '../geminiService';
import { HUMBLE_MESSAGES } from '../constants';

interface Props {
  config: UserConfig;
}

const SlimeMascot: React.FC = () => {
  return (
    <div className="relative w-32 h-28 flex items-center justify-center animate-soft-bounce">
      {/* Slime Body */}
      <div className="absolute w-24 h-20 bg-[#d9f1bc] rounded-[50%_50%_45%_45%] border-2 border-[#8ba36e] shadow-inner overflow-hidden">
        {/* Shine */}
        <div className="absolute top-2 left-4 w-6 h-4 bg-white/40 rounded-full blur-[2px] transform -rotate-12"></div>
        {/* Eyes */}
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-1.5 h-1.5 bg-gray-800 rounded-full"></div>
        <div className="absolute top-1/2 right-1/3 -translate-y-1/2 w-1.5 h-1.5 bg-gray-800 rounded-full"></div>
        {/* Cheeks */}
        <div className="absolute top-[55%] left-[22%] w-3 h-1.5 bg-pink-300/60 rounded-full blur-[1px]"></div>
        <div className="absolute top-[55%] right-[22%] w-3 h-1.5 bg-pink-300/60 rounded-full blur-[1px]"></div>
      </div>
      
      {/* Sprout on top */}
      <div className="absolute -top-2 flex flex-col items-center">
        <div className="w-0.5 h-6 bg-[#6b8e23] transform -rotate-12 origin-bottom"></div>
        <div className="absolute -top-1 -right-2 w-4 h-3 bg-[#a2d149] rounded-[80%_10%_80%_10%] border border-[#6b8e23] transform rotate-[30deg]"></div>
        <div className="absolute top-0 -left-1 w-2 h-2 border-t-2 border-l-2 border-[#6b8e23] rounded-tl-full transform -rotate-[60deg]"></div>
      </div>

      {/* Shadow */}
      <div className="absolute -bottom-1 w-16 h-2 bg-black/10 rounded-full blur-[2px]"></div>
    </div>
  );
};

const Dashboard: React.FC<Props> = ({ config }) => {
  const [earnedToday, setEarnedToday] = useState(0);
  const [sosMessage, setSosMessage] = useState<string | null>(null);
  const [isSosLoading, setIsSosLoading] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeData = useMemo(() => {
    const [startH, startM] = config.startTime.split(':').map(Number);
    const [endH, endM] = config.endTime.split(':').map(Number);
    const [lStartH, lStartM] = config.lunchStart.split(':').map(Number);
    const [lEndH, lEndM] = config.lunchEnd.split(':').map(Number);

    const start = new Date(now).setHours(startH, startM, 0, 0);
    const end = new Date(now).setHours(endH, endM, 0, 0);
    const lunchStart = new Date(now).setHours(lStartH, lStartM, 0, 0);
    const lunchEnd = new Date(now).setHours(lEndH, lEndM, 0, 0);
    const currentTime = now.getTime();

    let phaseProgress = 0;
    let label = "等待开工";
    let subLabel = "尚未到达上班时间";
    let timeRemainingLabel = "0m";

    if (currentTime < start) {
      phaseProgress = 0;
      label = "蓄势待发";
      subLabel = "大人的巅峰时刻即将到来";
    } else if (currentTime < lunchStart) {
      phaseProgress = ((currentTime - start) / (lunchStart - start)) * 100;
      label = "冲刺午休";
      subLabel = "干饭魂！每一秒都在接近";
      const diff = lunchStart - currentTime;
      const hours = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      timeRemainingLabel = hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
    } else if (currentTime < lunchEnd) {
      phaseProgress = 100;
      label = "午间休憩";
      subLabel = "补充元气，准备下半场刺杀";
      timeRemainingLabel = "休整中";
    } else if (currentTime < end) {
      phaseProgress = ((currentTime - lunchEnd) / (end - lunchEnd)) * 100;
      label = "奔向自由";
      subLabel = "资本的枷锁即将断裂";
      const diff = end - currentTime;
      const hours = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      timeRemainingLabel = hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
    } else {
      phaseProgress = 100;
      label = "功成身退";
      subLabel = "复仇完毕，大人该归家了";
      timeRemainingLabel = "自由已达";
    }

    const totalWorkMillis = (end - start) - (lunchEnd - lunchStart);
    let currentWorkedMillis = 0;
    if (currentTime > start) {
      currentWorkedMillis = Math.min(currentTime, lunchStart) - start;
      if (currentTime > lunchEnd) {
        currentWorkedMillis += Math.min(currentTime, end) - lunchEnd;
      }
    }
    const totalDayProgress = Math.min(100, Math.max(0, (currentWorkedMillis / totalWorkMillis) * 100));
    const earned = (currentWorkedMillis / (1000 * 60 * 60)) * config.currentSalary;

    return {
      phaseProgress: Math.min(100, Math.max(0, phaseProgress)),
      totalDayProgress,
      earned,
      label,
      subLabel,
      timeRemainingLabel
    };
  }, [now, config]);

  useEffect(() => {
    setEarnedToday(timeData.earned);
  }, [timeData.earned]);

  const handleSos = async () => {
    setIsSosLoading(true);
    setSosMessage(null);
    try {
      const msg = await getHumbleEncouragement();
      setSosMessage(msg);
    } catch {
      setSosMessage(HUMBLE_MESSAGES[Math.floor(Math.random() * HUMBLE_MESSAGES.length)]);
    } finally {
      setIsSosLoading(false);
    }
  };

  return (
    <div className="p-6 pb-28 min-h-screen bg-[#b2e2f2]">
      <header className="flex justify-between items-center mb-10">
        <div className="bg-white/30 px-3 py-1 rounded-full backdrop-blur-sm">
          <p className="text-[10px] text-gray-700 font-bold uppercase tracking-widest">
            {now.toLocaleDateString('zh-CN', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/40 p-1">
          <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${config.currentSalary}`} alt="avatar" className="w-full h-full" />
        </div>
      </header>

      {/* Progress & IP Section */}
      <div className="flex flex-col items-center justify-center py-8 mb-4">
        <SlimeMascot />
        
        {/* Progress Bar Container */}
        <div className="w-full max-w-[200px] mt-6">
          <div className="relative h-[3px] bg-[#8ab6c4] rounded-full">
            <div 
              className="absolute left-0 top-0 h-full bg-[#ff7b5c] transition-all duration-1000 ease-out"
              style={{ width: `${timeData.phaseProgress}%` }}
            >
              {/* Dot at the end of progress */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[6px] h-[6px] bg-[#ff7b5c] rounded-full shadow-[0_0_4px_rgba(255,123,92,0.8)]"></div>
            </div>
          </div>
          <div className="text-center mt-3">
             <span className="text-xs font-medium text-gray-600/80 italic font-mono">{timeData.timeRemainingLabel}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Emotional Support Section (Dominant) */}
        <div 
          onClick={handleSos}
          className="bg-white/80 backdrop-blur-md p-8 rounded-[40px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-white/50 cursor-pointer active:scale-[0.98] transition-all"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-[#f9e1d1] rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-inner">🧸</div>
            <h3 className="text-xs font-black text-orange-900/40 uppercase tracking-[0.2em] mb-3">小的私语</h3>
            {isSosLoading ? (
               <div className="animate-pulse flex space-x-1">
                  <div className="h-1.5 w-1.5 bg-gray-300 rounded-full"></div>
                  <div className="h-1.5 w-1.5 bg-gray-300 rounded-full"></div>
                  <div className="h-1.5 w-1.5 bg-gray-300 rounded-full"></div>
               </div>
            ) : (
              <p className="text-lg font-bold text-gray-800 leading-snug">
                {sosMessage || "大人，每一秒的坚持，都是对命运的温柔反击。小的时刻为您祈福。"}
              </p>
            )}
            <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">( 点击寻求关怀 )</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Salary Tracker (Subtle) */}
          <div className="bg-white/40 backdrop-blur-sm p-6 rounded-[32px] border border-white/40 flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">累计收益</span>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-bold text-gray-500">¥</span>
                <span className="text-xl font-black text-gray-800 tracking-tight">{earnedToday.toFixed(3)}</span>
              </div>
            </div>
          </div>

          {/* Off-work Total Progress Card (Subtle) */}
          <div className="bg-blue-100/50 backdrop-blur-sm p-6 rounded-[32px] border border-white/40 flex flex-col justify-between">
            <div>
              <span className="text-[9px] font-black text-blue-900/40 uppercase tracking-tighter">离岗进度</span>
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-blue-900 tracking-tight">{Math.round(timeData.totalDayProgress)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button id="sos-trigger" onClick={handleSos} className="hidden" />

      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0) scaleX(1); }
          50% { transform: translateY(-8px) scaleX(0.98); }
        }
        .animate-soft-bounce {
          animation: bounce-subtle 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
