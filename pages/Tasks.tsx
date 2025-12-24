
import React, { useState, useEffect, useRef } from 'react';
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
      <div className="relative text-6xl animate-bounce">✨ 恭喜完成！ ✨</div>
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full animate-firework"
          style={{
            backgroundColor: ['#ff7b5c', '#7d5dfc', '#ffcf5c', '#5cd6ff'][i % 4],
            left: '50%',
            top: '50%',
            '--x': `${(Math.random() - 0.5) * 400}px`,
            '--y': `${(Math.random() - 0.5) * 400}px`,
            animationDelay: `${Math.random() * 0.5}s`
          } as any}
        />
      ))}
      <style>{`
        @keyframes firework {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(var(--x), var(--y)) scale(0); opacity: 0; }
        }
        .animate-firework {
          animation: firework 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

const SlackerIllustration: React.FC = () => (
  <div className="relative w-full h-32 bg-[#ffe6d1] overflow-hidden flex items-end justify-center shrink-0">
    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ff9a9e 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
    <div className="absolute bottom-0 w-full h-6 bg-[#f9cfab]"></div>
    <div className="relative mb-2 z-10 animate-soft-bounce">
      <div className="relative w-14 h-10 bg-[#b2e2f2] rounded-[40%_40%_30%_30%] border-2 border-[#8ab6c4] flex items-center justify-center">
        <div className="flex gap-0.5 mb-1">
          <div className="w-3 h-2 bg-gray-800 rounded-sm"></div>
          <div className="w-3 h-2 bg-gray-800 rounded-sm"></div>
        </div>
      </div>
    </div>
    <div className="absolute bottom-6 left-10 w-4 h-10 bg-[#4a7c59] rounded-t-full opacity-30"></div>
    <div className="absolute bottom-6 right-10 w-6 h-12 bg-[#4a7c59] rounded-t-full opacity-30"></div>
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
      // Stop others
      if (t.isTracking) {
        return { ...t, isTracking: false, elapsedTime: (t.elapsedTime || 0) + (Date.now() - (t.lastStartTime || Date.now())) };
      }
      return t;
    }));
  };

  const completeTask = (id: string) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        if (!t.completed) setShowFireworks(true);
        const finalTime = t.isTracking ? (t.elapsedTime || 0) + (Date.now() - (t.lastStartTime || Date.now())) : (t.elapsedTime || 0);
        return { ...t, completed: true, isTracking: false, elapsedTime: finalTime };
      }
      return t;
    }));
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

      <div className="flex-1 bg-white rounded-t-[40px] px-6 pt-6 shadow-[0_-15px_40px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-[#2e3a59]">今日三策</h2>
            <span className="text-lg">📋</span>
          </div>
          <button 
            onClick={onOpenCalendar}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100 shadow-sm text-[10px] font-bold text-[#2e3a59]"
          >
            <span>📅</span>
            <span>打卡历史</span>
          </button>
        </div>

        {/* Milestone Tracker */}
        <div className="mb-6 px-1 shrink-0">
          <div className="flex justify-between items-center mb-1">
            {[1, 2, 3].map((milestone) => (
              <div key={milestone} className="flex flex-col items-center">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-all duration-500 ${completedCount >= milestone ? 'bg-[#7d5dfc] text-white shadow-md' : 'bg-gray-100 text-gray-300'}`}>
                  {completedCount >= milestone ? '✓' : ''}
                </div>
                <span className="text-[8px] font-bold text-gray-400 mt-1 uppercase">
                  策{milestone}
                </span>
              </div>
            ))}
            
            <button 
              onClick={allCompleted ? onZombieMode : undefined}
              disabled={!allCompleted}
              className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${allCompleted ? 'bg-[#7d5dfc] text-white shadow-lg active:scale-95' : 'bg-gray-100 text-gray-300'}`}
            >
              魂归天外
            </button>
          </div>
          <div className="relative h-1 bg-gray-100 rounded-full -mt-6 mx-3 -z-10 overflow-hidden">
             <div 
              className="absolute left-0 top-0 h-full bg-[#7d5dfc] transition-all duration-700 ease-out"
              style={{ width: `${(completedCount / 3) * 100}%` }}
             />
          </div>
        </div>

        {/* Add Task Input (Only if less than 3) */}
        {tasks.length < 3 && (
          <form onSubmit={addTask} className="mb-4 relative shrink-0">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="添加今日必办（三件足矣）..."
              className="w-full bg-[#f8f9fe] border-none rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[#7d5dfc]/30 text-xs font-bold shadow-inner"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#7d5dfc] rounded-xl shadow-md text-white font-black text-lg">+</button>
          </form>
        )}

        {/* Task List Container - Fixed height with flex-1 but no scroll needed if only 3 items */}
        <div className="space-y-3 flex-1 overflow-hidden">
          {tasks.map((task, idx) => (
            <div 
              key={task.id} 
              className={`bg-[#f8f9fe] p-4 rounded-[28px] flex items-center gap-4 border border-transparent transition-all group relative ${task.completed ? 'opacity-60' : 'hover:border-[#7d5dfc]/10'}`}
            >
              {/* Task Icon */}
              <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center shadow-sm shrink-0 ${idx === 0 ? 'bg-[#e7f4ff]' : idx === 1 ? 'bg-[#f4f1ff]' : 'bg-[#fff7e6]'}`}>
                 <span className="text-xl">{idx === 0 ? '🍵' : idx === 1 ? '💻' : '📂'}</span>
              </div>

              {/* Task Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className={`text-xs font-black text-[#2e3a59] truncate ${task.completed ? 'line-through' : ''}`}>{task.title}</h4>
                  <span className="text-[9px] font-mono font-bold text-gray-400">{formatElapsedTime(task)}</span>
                </div>
                
                <div className="flex items-center gap-2 mt-2">
                  {!task.completed && (
                    <button 
                      onClick={() => toggleTracking(task.id)}
                      className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-wider transition-colors ${task.isTracking ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {task.isTracking ? '暂停计时' : '开始计时'}
                    </button>
                  )}
                  {task.completed && (
                    <span className="text-[9px] font-black text-green-500">已圆满完成</span>
                  )}
                </div>
              </div>

              {/* Complete Toggle */}
              <button 
                onClick={() => completeTask(task.id)}
                disabled={task.completed}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${task.completed ? 'bg-green-500 text-white shadow-inner' : 'bg-white text-gray-100 shadow-sm border border-gray-50 hover:text-[#7d5dfc]'}`}
              >
                {task.completed ? '✓' : '✓'}
              </button>
              
              {/* Subtle Delete */}
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
            <div className="h-full flex flex-col items-center justify-center opacity-10">
              <span className="text-6xl mb-4">🏮</span>
              <p className="text-xs font-black tracking-widest uppercase">大人今日无心杂务</p>
            </div>
          )}
        </div>

        {/* Footer Prompt */}
        <div className="py-6 text-center shrink-0">
          <p className="text-[10px] text-gray-400 font-bold italic">
            {allCompleted ? "“三策已成，大人功德圆满”" : "“大人，慢条斯理，方显贵气”"}
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
