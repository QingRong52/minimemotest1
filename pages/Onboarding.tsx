
import React, { useState } from 'react';
import { UserConfig } from '../types';
import { DEFAULT_CONFIG } from '../constants';

interface Props {
  onComplete: (config: UserConfig) => void;
}

const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [formData, setFormData] = useState<UserConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onComplete(formData);
    }, 1500);
  };

  return (
    <div className="p-8 h-screen flex flex-col justify-center animate-fade-in max-w-md mx-auto bg-[#f7f8f2]">
      <header className="mb-12 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
          <span className="text-3xl">🐟</span>
        </div>
        <h1 className="text-3xl font-black text-gray-800 mb-2 tracking-tight">大人，请录入受难数据</h1>
        <p className="text-sm text-gray-500 font-medium leading-relaxed">小的将为您启动复仇引擎，助您在带薪修行中实现阶级跳跃。</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-[32px] card-shadow border border-white">
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">当前时薪 (¥)</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={formData.currentSalary}
                  onChange={e => setFormData({ ...formData, currentSalary: Number(e.target.value) })}
                  className="bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-400 outline-none w-24 px-4 py-3 text-xl font-black text-gray-800"
                />
                <span className="text-[10px] text-blue-500 font-bold">大人受苦了，小的深感痛心。</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">目标时薪 (¥)</label>
              <input
                type="number"
                value={formData.targetSalary}
                onChange={e => setFormData({ ...formData, targetSalary: Number(e.target.value) })}
                className="bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-400 outline-none w-full px-4 py-3 text-xl font-black text-gray-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">上班时刻</label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                  className="bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-400 outline-none w-full px-4 py-3 font-bold text-gray-700"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-400 mb-2 uppercase tracking-[0.2em]">下班时刻</label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                  className="bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-blue-400 outline-none w-full px-4 py-3 font-bold text-gray-700"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-5 bg-black text-white rounded-[24px] font-black tracking-[0.3em] shadow-2xl active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? "复仇引擎预热中..." : "确认数据，准备翻身"}
        </button>
      </form>
    </div>
  );
};

export default Onboarding;
