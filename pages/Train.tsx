
import React, { useState, useEffect, useRef } from 'react';
import { TrainingStats } from '../types';
import { TYPING_TEXTS } from '../constants';

interface Props {
  setStats: React.Dispatch<React.SetStateAction<TrainingStats>>;
}

const Train: React.FC<Props> = ({ setStats }) => {
  const [mode, setMode] = useState<'TYPE' | 'COPY' | 'READ'>('TYPE');
  const [typingInput, setTypingInput] = useState('');
  const [targetText] = useState(TYPING_TEXTS[Math.floor(Math.random() * TYPING_TEXTS.length)]);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsActive(false);
            setStats(s => ({ ...s, typingMinutes: s.typingMinutes + 15 }));
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, timeLeft, setStats]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-1">修炼室</h2>
        <p className="text-xs text-gray-400 font-medium">在摸鱼中，悄悄变得更强</p>
      </header>

      <div className="flex bg-white rounded-2xl p-1 shadow-sm mb-8">
        {(['TYPE', 'COPY', 'READ'] as const).map(m => (
          <button 
            key={m}
            onClick={() => setMode(m)} 
            className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all ${mode === m ? 'bg-black text-white' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {m === 'TYPE' ? '打字' : m === 'COPY' ? '临摹' : '阅读'}
          </button>
        ))}
      </div>

      {mode === 'TYPE' && (
        <div className="space-y-6">
          <div className="bg-[#d6f5d6] p-8 rounded-[40px] card-shadow">
            <div className="flex justify-between items-center mb-6">
              <span className="text-4xl font-black text-green-900 tracking-tighter">{formatTime(timeLeft)}</span>
              <button 
                onClick={() => setIsActive(!isActive)}
                className={`px-6 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${isActive ? 'bg-red-100 text-red-600' : 'bg-white text-green-600 shadow-sm'}`}
              >
                {isActive ? '停止' : '开始'}
              </button>
            </div>
            
            <div className="bg-white/50 backdrop-blur p-6 rounded-3xl min-h-[200px] border border-green-200/50">
              <p className="text-xs text-green-900/60 font-medium mb-4 leading-relaxed italic">{targetText}</p>
              <textarea
                value={typingInput}
                onChange={e => setTypingInput(e.target.value)}
                disabled={!isActive || timeLeft <= 0}
                placeholder="在此伪装忙碌..."
                className="w-full h-32 bg-transparent text-green-900 font-bold outline-none resize-none placeholder:text-green-900/20"
              />
            </div>
          </div>
          {timeLeft <= 0 && <p className="text-center text-xs text-yellow-600 font-bold">⚠️ 休息！大人，切勿过劳。</p>}
        </div>
      )}

      {mode === 'COPY' && (
        <div className="grid grid-cols-1 gap-6">
          <div className="aspect-[4/3] bg-white rounded-[40px] p-4 card-shadow border-8 border-[#f9f3d1]">
            <img src="https://picsum.photos/seed/ui/800/600" alt="参考图" className="w-full h-full object-cover rounded-2xl grayscale" />
          </div>
          <div className="h-48 bg-white border-4 border-dashed border-gray-100 rounded-[40px] flex items-center justify-center">
             <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">请在侧方物理临摹</span>
          </div>
        </div>
      )}

      {mode === 'READ' && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-3xl card-shadow group hover:bg-black transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-blue-50 text-blue-500 group-hover:bg-gray-800 rounded-xl flex items-center justify-center font-bold">0{i}</div>
                 <h4 className="flex-1 text-sm font-bold text-gray-800 group-hover:text-white transition-colors">职场真相：如何拒绝无意义的加班</h4>
              </div>
            </div>
          ))}
          <div className="pt-8 text-center">
             <button 
              onClick={() => setStats(s => ({...s, readingCount: s.readingCount + 1}))} 
              className="px-8 py-4 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-2xl shadow-lg active:scale-95 transition-all"
             >
               朕已阅，能力+1
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Train;
