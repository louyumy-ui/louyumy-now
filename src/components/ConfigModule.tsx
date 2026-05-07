import React, { useState } from 'react';
import { cn } from '../lib/utils';

const ConfigModule: React.FC = () => {
  const [coolingHours, setCoolingHours] = useState(24);
  const [rejectLimit, setRejectLimit] = useState(5);
  const [timeRange, setTimeRange] = useState({ start: '09:00', end: '18:00' });

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-[28px] font-[900] text-black tracking-tighter leading-none uppercase">核心业务策略集群</h3>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-3 underline decoration-gray-200 decoration-2 underline-offset-4">Global Security & Compliance Framework</p>
        </div>
        <button 
          className="px-10 py-5 bg-black text-white rounded-[24px] text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-black/20 hover:scale-105 active:scale-95 transition-all"
        >
          保存当前下发方案
        </button>
      </div>

      <div className="grid grid-cols-2 gap-10">
        {/* 号码冷却与隔离 */}
        <div className="bg-white p-12 rounded-[48px] border-[1.33px] border-gray-100 shadow-sm space-y-10">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-[900] text-black uppercase tracking-[0.2em]">号码冷却隔离规则</h4>
            <div className="w-2 h-2 rounded-full bg-blue-600" />
          </div>

          <div className="space-y-6">
            <div className="p-8 bg-gray-50 rounded-[32px] border border-gray-100 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">触发阈值 / TRIGGER</span>
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">DYNAMIC</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex-1 space-y-2">
                   <p className="text-[9px] font-black text-gray-900 uppercase">累计拒接限额</p>
                   <input 
                    type="number" 
                    value={rejectLimit}
                    onChange={(e) => setRejectLimit(parseInt(e.target.value))}
                    className="w-full bg-white border border-gray-100 p-4 rounded-2xl text-lg font-black"
                   />
                </div>
                <div className="flex-1 space-y-2">
                   <p className="text-[9px] font-black text-gray-900 uppercase">冷却隔离时长</p>
                   <input 
                    type="number" 
                    value={coolingHours}
                    onChange={(e) => setCoolingHours(parseInt(e.target.value))}
                    className="w-full bg-white border border-gray-100 p-4 rounded-2xl text-lg font-black"
                   />
                </div>
              </div>
            </div>

            <div className="p-8 bg-white border-[1.33px] border-gray-100 rounded-[32px] flex items-center justify-between">
               <div>
                  <p className="text-[10px] font-black text-black uppercase tracking-widest">自动负载补号开关</p>
                  <p className="text-[9px] text-gray-400 font-bold mt-1">触发冷却后系统自动从公共池调度补齐</p>
               </div>
               <div className="w-16 h-8 bg-black rounded-full p-1 flex items-center cursor-pointer">
                  <div className="w-6 h-6 bg-white rounded-full ml-auto shadow-sm" />
               </div>
            </div>
          </div>
        </div>

        {/* 全局合规管控 */}
        <div className="bg-white p-12 rounded-[48px] border-[1.33px] border-gray-100 shadow-sm space-y-10">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-[900] text-black uppercase tracking-[0.2em]">全局合规时间管控</h4>
            <div className="w-2 h-2 rounded-full bg-black" />
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-8">
               <div className="space-y-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">业务启始时间</p>
                  <input 
                    type="time" 
                    value={timeRange.start}
                    onChange={(e) => setTimeRange({ ...timeRange, start: e.target.value })}
                    className="w-full bg-gray-50 border-none p-6 rounded-[32px] text-2xl font-[900]"
                  />
               </div>
               <div className="space-y-3">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">强制熔断时间</p>
                  <input 
                    type="time" 
                    value={timeRange.end}
                    onChange={(e) => setTimeRange({ ...timeRange, end: e.target.value })}
                    className="w-full bg-gray-50 border-none p-6 rounded-[32px] text-2xl font-[900]"
                  />
               </div>
            </div>

            <div className="p-10 bg-[#1A1A1A] rounded-[40px] text-white space-y-6">
               <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">系统风险隔离提示</p>
               <p className="text-xs leading-relaxed font-bold opacity-80">
                  当前处于 [高敏感] 行业准入模式下，所有策略修改将实时同步至 24 个边缘网关节点，预计全球生效时间为 450ms。
               </p>
               <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 w-2/3" />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigModule;
