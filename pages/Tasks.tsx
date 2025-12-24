
import React, { useState, useEffect } from 'react';
import { Task } from '../types';

interface Props {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onZombieMode: () => void;
  onOpenCalendar: () => void;
}

const Fireworks: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[2px]"></div>
      <div className="relative text-4xl font-black text-[#7d5dfc] animate-bounce text-center drop-shadow-lg">✨ 恭喜完成！ ✨<br/><span className="text-xl">大人真乃神人也</span></div>
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full animate-firework"
          style={{
            backgroundColor: ['#ff7b5c', '#7d5dfc', '#ffcf5c', '#5cd6ff', '#ff85a1'][i % 5],
            left: '50%',
            top: '50%',
            '--x': `${(Math.random() - 0.5) * 600}px`,
            '--y': `${(Math.random() - 0.5) * 600}px`,
            animationDelay: `${Math.random() * 0.8}s`
          } as any}
        />
      ))}
      <style>{`
        @keyframes firework {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(var(--x), var(--y)) scale(0); opacity: 0; }
        }
        .animate-firework {
          animation: firework 1.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

const SlackerIllustration: React.FC = () => (
  <div className="relative w-full h-32 bg-[#ffe6d1] overflow-hidden flex items-end justify-center shrink-0">
    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ff9a9e 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
    <div className="absolute bottom-0 w-full h-4 bg-[#f9cfab]"></div>
    <div className="relative mb-1 z-10 animate-soft-bounce">
      <div className="relative w-12 h-8 bg-[#b2e2f2] rounded-[40%_40%_30%_30%] border-2 border-[#8ab6c4] flex items-center justify-center">
        <div className="flex gap-0.5 mb-0.5">
          <div className="w-2.5 h-1.5 bg-gray-800 rounded-sm"></div>
          <div className="w-2.5 h-1.5 bg-gray-800 rounded-sm"></div>
        </div>
      </div>
      <div className="absolute -top-4 -right-2 text-xs">☕</div>
    </div>
    <div className="absolute bottom-4 left-8 w-3 h-8 bg-[#4a7c59] rounded-t-full opacity-20"></div>
    <div className="absolute bottom-4 right-8 w-4 h-10 bg-[#4a7c59] rounded-t-full opacity-20"></div>
  </div>
);

const Tasks: React.FC<Props> = ({ tasks, setTasks, onZombieMode, onOpenCalendar }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showFireworks, setShowFireworks] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatElapsedTime = (task: Task) => {
    let total = task.elapsedTime || 0;
    if (task.isTracking && task.lastStartTime) {
      total += Date.now() - task.lastStartTime;
    }
    const seconds = Math.floor(total / 1000);
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (tasks.length >= 3) {
      setError('大人，脑细胞昂贵，三件足矣。');
      setTimeout(() => setError(null), 3000);
      return;
    }
    if (!input.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), title: input, completed: false, elapsedTime: 0 }]);
    setInput('');
  };

  const toggleTracking = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        if (t.isTracking) {
          return { ...t, isTracking: false, elapsedTime: (t.elapsedTime || 0) + (Date.now() - (t.lastStartTime || Date.now())) };
        } else {
          return { ...t, isTracking: true, lastStartTime: Date.now() };
        }
      }
      if (t.isTracking) {
        return { ...t, isTracking: false, elapsedTime: (t.elapsedTime || 0) + (Date.now() - (t.lastStartTime || Date.now())) };
      }
      return t;
    }));
  };

  const completeTask = (id: string) => {
    setTasks(prev => {
      const newTasks = prev.map(t => {
        if (t.id === id) {
          if (!t.completed) setShowFireworks(true);
          const finalTime = t.isTracking ? (t.elapsedTime || 0) + (Date.now() - (t.lastStartTime || Date.now())) : (t.elapsedTime || 0);
          return { ...t, completed: true, isTracking: false, elapsedTime: finalTime };
        }
        return t;
      });
      return newTasks;
    });
  };

  const removeTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const allCompleted = tasks.length > 0 && tasks.every(t => t.completed);

  return (
    <div className="h-screen bg-[#ffe6d1] flex flex-col overflow-hidden relative">
      {showFireworks && <Fireworks onComplete={() => setShowFireworks(false)} />}
      
      <SlackerIllustration />

      <div className="flex-1 bg-white rounded-t-[40px] px-6 pt-5 shadow-[0_-15px_40px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
        {/* Header - Compact */}
        <div className="flex justify-between items-center mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-[#2e3a59]">今日目标</h2>
            <span className="text-base">📋</span>
          </div>
          <button 
            onClick={onOpenCalendar}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100 shadow-sm text-[9px] font-bold text-[#2e3a59]"
          >
            <span>📅</span>
            <span>打卡记录</span>
          </button>
        </div>

        {/* Milestone Tracker - Compact */}
        <div className="mb-5 px-1 shrink-0">
          <div className="flex justify-between items-center mb-0.5">
            {[1, 2, 3].map((milestone) => (
              <div key={milestone} className="flex flex-col items-center">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] transition-all duration-500 ${completedCount >= milestone ? 'bg-[#7d5dfc] text-white shadow-md' : 'bg-gray-100 text-gray-300'}`}>
                  {completedCount >= milestone ? '✓' : ''}
                </div>
                <span className="text-[7px] font-bold text-gray-400 mt-0.5 uppercase">
                  策{milestone}
                </span>
              </div>
            ))}
            
            <button 
              onClick={allCompleted ? onZombieMode : undefined}
              disabled={!allCompleted}
              className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${allCompleted ? 'bg-[#7d5dfc] text-white shadow-lg active:scale-95 animate-pulse' : 'bg-gray-100 text-gray-300'}`}
            >
              魂归天外
            </button>
          </div>
          <div className="relative h-1 bg-gray-100 rounded-full -mt-5.5 mx-2.5 -z-10 overflow-hidden">
             <div 
              className="absolute left-0 top-0 h-full bg-[#7d5dfc] transition-all duration-700 ease-out"
              style={{ width: `${(completedCount / 3) * 100}%` }}
             />
          </div>
        </div>

        {/* Add Task Input - Ultra Compact */}
        {tasks.length < 3 && (
          <form onSubmit={addTask} className="mb-4 relative shrink-0">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="输入今日摸鱼策略..."
              className="w-full bg-[#f8f9fe] border-none rounded-2xl px-4 py-3 outline-none focus:ring-1 focus:ring-[#7d5dfc]/30 text-[11px] font-bold shadow-inner"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#7d5dfc] rounded-xl shadow-md text-white font-black text-base">+</button>
            {error && <p className="text-[8px] text-red-400 mt-1 font-bold absolute left-4 -bottom-3">{error}</p>}
          </form>
        )}

        {/* Task List - Auto-adjust space */}
        <div className="space-y-2.5 flex-1 overflow-hidden">
          {tasks.map((task, idx) => (
            <div 
              key={task.id} 
              className={`bg-[#f8f9fe] p-3 rounded-[24px] flex items-center gap-3 border border-transparent transition-all group relative ${task.completed ? 'opacity-50' : 'hover:border-[#7d5dfc]/10'}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm shrink-0 ${idx === 0 ? 'bg-[#e7f4ff]' : idx === 1 ? 'bg-[#f4f1ff]' : 'bg-[#fff7e6]'}`}>
                 <span className="text-lg">{idx === 0 ? '🍵' : idx === 1 ? '💻' : '📂'}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className={`text-[11px] font-black text-[#2e3a59] truncate ${task.completed ? 'line-through' : ''}`}>{task.title}</h4>
                  <span className="text-[8px] font-mono font-bold text-gray-400">{formatElapsedTime(task)}</span>
                </div>
                
                <div className="flex items-center gap-2 mt-1">
                  {!task.completed && (
                    <button 
                      onClick={() => toggleTracking(task.id)}
                      className={`text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider transition-colors ${task.isTracking ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {task.isTracking ? '计时中...' : '开始记录'}
                    </button>
                  )}
                  {task.completed && (
                    <span className="text-[8px] font-black text-green-500">✅ 已完成</span>
                  )}
                </div>
              </div>

              <button 
                onClick={() => completeTask(task.id)}
                disabled={task.completed}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 ${task.completed ? 'bg-green-500 text-white shadow-inner' : 'bg-white text-gray-100 shadow-sm border border-gray-50 hover:text-[#7d5dfc]'}`}
              >
                {task.completed ? '✓' : '✓'}
              </button>
              
              {!task.completed && (
                <button 
                  onClick={() => removeTask(task.id)} 
                  className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 w-4 h-4 bg-red-400 text-white rounded-full text-[8px] flex items-center justify-center shadow-md"
                >
                  ×
                </button>
              )}
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center opacity-10 py-10">
              <span className="text-5xl mb-2">🎈</span>
              <p className="text-[10px] font-black tracking-widest uppercase">大人今日无杂务</p>
            </div>
          )}
        </div>

        {/* Footer - Static and compact */}
        <div className="py-4 text-center shrink-0 border-t border-gray-50 mt-auto">
          <p className="text-[9px] text-gray-400 font-bold italic mb-12">
            {allCompleted ? "“三策已成，大人可得长生”" : "“大人请自便，小的时刻待命”"}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes soft-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-soft-bounce {
          animation: soft-bounce 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Tasks;
